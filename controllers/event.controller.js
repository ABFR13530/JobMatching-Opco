/**
 * controllers/event.controller.js
 * 
 * Gestion des événements Job Matching, réservation de créneaux
 * et interfaçage avec Jitsi.
 */

module.exports = (db) => {
  return {
    /**
     * @route POST /api/events
     * @desc Créer un nouvel événement (Conseiller/Admin)
     */
    async createEvent(req, res) {
      const { 
        titre, date, date_fin, region, max_participants, 
        event_format, interview_duration, description,
        heure_debut, heure_fin, pause_debut, pause_fin,
        counselor_region 
      } = req.body;

      // Logique de restriction régionale
      if (event_format !== 'virtuel' && counselor_region && region !== counselor_region) {
        return res.status(403).json({ error: `Action interdite : Vous ne pouvez créer des événements présentiels/hybrides que pour votre région (${counselor_region}).` });
      }

      try {
        const query = `
          INSERT INTO job_matching_events (
            titre, date, date_fin, region, max_participants, 
            event_format, interview_duration, description, 
            heure_debut, heure_fin, pause_debut, pause_fin,
            statut, created_by_region
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'brouillon', $13) RETURNING *
        `;
        const { rows } = await db.query(query, [
          titre, date, date_fin || date, region, max_participants, 
          event_format || 'virtuel', interview_duration || 20, description,
          heure_debut || '09:00', heure_fin || '18:00', 
          pause_debut || '12:30', pause_fin || '13:30',
          counselor_region
        ]);
        res.status(201).json({ success: true, event: rows[0] });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    /**
     * @route GET /api/events
     * @desc Liste les événements. Filtre par région pour Candidats et Recruteurs.
     */
    async listEvents(req, res) {
      const { region, role } = req.query; 
      
      let query = "SELECT * FROM job_matching_events";
      const params = [];

      // Filtrage par région : On ne voit que les événements de sa région OU les virtuels nationaux
      if ((role === 'candidat' || role === 'recruiter') && region) {
        query += " WHERE (region = $1 OR event_format = 'virtuel')";
        params.push(region);
        
        if (role === 'candidat') {
          query += " AND statut = 'publie'";
        }
      }

      try {
        const { rows } = await db.query(query, params);
        res.status(200).json({ success: true, events: rows });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    /**
     * @route GET /api/events/:id/slots
     * @desc Liste les créneaux disponibles pour un événement
     */
    async listSlots(req, res) {
      const { id } = req.params;
      try {
        const query = `
          SELECT s.*, c.name as company_name 
          FROM event_slots s
          JOIN companies c ON s.recruiter_id = c.id
          WHERE s.event_id = $1 AND s.is_booked = false
          ORDER BY s.start_time ASC
        `;
        const { rows } = await db.query(query, [id]);
        res.status(200).json({ success: true, slots: rows });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    /**
     * @route POST /api/events/:id/slots
     * @desc Générer des créneaux pour un recruteur (Batch creation)
     */
    async createSlots(req, res) {
      const { id } = req.params;
      const { recruiter_id, start_time, count, duration } = req.body;
      
      try {
        let currentStart = new Date(start_time);
        const slots = [];
        
        for (let i = 0; i < count; i++) {
          let currentEnd = new Date(currentStart.getTime() + duration * 60000);
          
          const query = `
            INSERT INTO event_slots (event_id, recruiter_id, start_time, end_time)
            VALUES ($1, $2, $3, $4) RETURNING *
          `;
          const { rows } = await db.query(query, [id, recruiter_id, currentStart, currentEnd]);
          slots.push(rows[0]);
          
          // Intervalle de 5 min entre les RDV
          currentStart = new Date(currentEnd.getTime() + 5 * 60000);
        }
        
        res.status(201).json({ success: true, slots });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    /**
     * @route POST /api/events/book
     * @desc Réservation d'un créneau par un candidat + Génération Jitsi
     */
    async bookSlot(req, res) {
      const { slot_id, candidate_id } = req.body;
      
      // Validation transactionnelle stricte pour la réservation
      const client = await db.connect();
      try {
        await client.query('BEGIN');

        // 1. Verrouiller le créneau pour empêcher la concurrence (double-booking)
        const slotQuery = `SELECT id, is_booked, event_id FROM event_slots WHERE id = $1 FOR UPDATE`;
        const slotRes = await client.query(slotQuery, [slot_id]);

        if (slotRes.rows.length === 0) throw new Error("Créneau introuvable.");
        if (slotRes.rows[0].is_booked) throw new Error("Ce créneau est déjà réservé.");

        // 2. Générer le lien Jitsi unique
        const event_id = slotRes.rows[0].event_id;
        // On génère un lien obscurci pour la sécurité
        const uniqueString = Math.random().toString(36).substring(2, 15);
        const jitsiLink = `https://meet.jit.si/numericEmploi_${event_id}_${slot_id}_${uniqueString}`;

        // 3. Insérer la réservation
        const bookQuery = `
          INSERT INTO event_bookings (slot_id, candidate_id, jitsi_link)
          VALUES ($1, $2, $3) RETURNING *
        `;
        const booking = await client.query(bookQuery, [slot_id, candidate_id, jitsiLink]);

        // 4. Mettre à jour le créneau comme "réservé"
        await client.query(`UPDATE event_slots SET is_booked = true WHERE id = $1`, [slot_id]);

        await client.query('COMMIT');
        
        // (Optionnel immédiat) : Appel au /services/notificationsService pour SendGrid Confirmation
        
        res.status(200).json({ success: true, booking: booking.rows[0] });
      } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: err.message });
      } finally {
        client.release();
      }
    }
  };
};
