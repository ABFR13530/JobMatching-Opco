/**
 * controllers/candidate.controller.js
 * 
 * Gestion CRUD des candidats en mode "Standalone".
 * Permet aux conseillers régionaux de créer ou modifier manuellement les profils.
 */

module.exports = (db) => {
  return {
    /**
     * @route POST /api/candidates
     * @desc Crée un candidat manuellement (Mode Standalone)
     */
    async createCandidate(req, res) {
      const { nom, prenom, email, region, competences, niveau_employabilite } = req.body;
      
      try {
        const query = `
          INSERT INTO candidates (source, nom, prenom, email, region, competences, niveau_employabilite, employability_score_locked)
          VALUES ('manual', $1, $2, $3, $4, $5::jsonb, $6, false)
          RETURNING *
        `;
        const { rows } = await db.query(query, [
          nom, prenom, email, region, JSON.stringify(competences || []), niveau_employabilite || null
        ]);
        
        res.status(201).json({ success: true, candidate: rows[0] });
      } catch (err) {
        if (err.code === '23505') { // Code d'erreur PostgreSQL pour unicité (email)
           return res.status(409).json({ error: "Cet email est déjà utilisé." });
        }
        res.status(500).json({ error: err.message });
      }
    },

    /**
     * @route PUT /api/candidates/:id
     * @desc Met à jour un candidat (avec blocage du niveau d'employabilité si issu de Numeric'Emploi)
     */
    async updateCandidate(req, res) {
      const { id } = req.params;
      const { competences, niveau_employabilite, statut } = req.body;

      try {
        // En mode SQL, on utilise un CASE pour empêcher la modification du score s'il est verrouillé.
        const query = `
          UPDATE candidates SET 
            competences = COALESCE($1::jsonb, competences),
            niveau_employabilite = CASE WHEN employability_score_locked = false THEN COALESCE($2, niveau_employabilite) ELSE niveau_employabilite END,
            statut = COALESCE($3, statut),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $4
          RETURNING *
        `;
        const { rows } = await db.query(query, [JSON.stringify(competences), niveau_employabilite, statut, id]);

        if (rows.length === 0) return res.status(404).json({ error: "Candidat introuvable." });
        
        res.status(200).json({ success: true, candidate: rows[0] });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    /**
     * @route GET /api/candidates
     * @desc Liste des profils qualifiés (Employabilité 1 ou 2), filtrés par région (pour l'event)
     */
    async getQualifiedCandidates(req, res) {
      const { region } = req.query;
      let query = "SELECT * FROM candidates WHERE niveau_employabilite IN (1, 2)";
      const params = [];

      if (region) {
        query += " AND region = $1";
        params.push(region);
      }

      try {
         const { rows } = await db.query(query, params);
         res.status(200).json({ success: true, candidates: rows });
      } catch (err) {
         res.status(500).json({ error: err.message });
      }
    }
  };
};
