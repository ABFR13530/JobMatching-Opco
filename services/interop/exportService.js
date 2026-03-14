/**
 * services/interop/exportService.js
 * 
 * Service d'exportation des candidats (CSV / JSON)
 * Permet d'exporter les profils qualifiés ainsi que les résultats des événements (présence, feedback).
 */
const { stringify } = require('csv-stringify/sync');

class ExportService {
  constructor(db) {
    this.db = db;
  }

  /**
   * Exporte l'ensemble des candidats, filtrables par événement.
   * Si eventId est renseigné, on ajoute les datas de présence et feedback du recruteur.
   */
  async exportCandidates(format = 'json', eventId = null) {
    let query = `
      SELECT 
        c.external_id, c.source, c.nom, c.prenom, c.email, c.region, 
        c.niveau_employabilite, c.employability_score_locked, c.statut,
        b.attended, b.feedback_recruiter, e.titre as event_title, e.date as event_date
      FROM candidates c
    `;
    
    const params = [];
    
    if (eventId) {
      query += `
        JOIN event_bookings b ON c.id = b.candidate_id
        JOIN event_slots s ON b.slot_id = s.id
        JOIN job_matching_events e ON s.event_id = e.id
        WHERE e.id = $1
      `;
      params.push(eventId);
    } else {
      query += `
        LEFT JOIN event_bookings b ON c.id = b.candidate_id
        LEFT JOIN event_slots s ON b.slot_id = s.id
        LEFT JOIN job_matching_events e ON s.event_id = e.id
      `;
    }

    query += ` ORDER BY c.nom, c.prenom`;

    try {
      const { rows } = await this.db.query(query, params);
      
      let output;
      if (format === 'csv') {
        // Transformation des objets JSON en colonnes plates pour CSV
        output = stringify(rows, { header: true, delimiter: ';' });
      } else {
        output = JSON.stringify(rows, null, 2);
      }

      // 2. Journalisation du flux de sortie
      const filename = `export_candidates_${Date.now()}.${format}`;
      await this.logRun('export', format, filename, rows.length, rows.length, 0, []);

      return {
        data: output,
        filename,
        contentType: format === 'csv' ? 'text/csv' : 'application/json'
      };

    } catch (err) {
      // Log l'erreur d'export en base de manière autonome pour monitoring technique
      await this.logRun('export', format, 'export.error', 0, 0, 1, [{ error: err.message }]);
      throw new Error(`Erreur lors de l'exportation des données : ${err.message}`);
    }
  }

  /**
   * Historisation dans la table dédiée
   */
  async logRun(type, format, filename, total, ok, errorCount, errors) {
    const query = `
      INSERT INTO import_export_logs (type, format, filename, records_total, records_ok, records_error, errors)
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
    `;
    await this.db.query(query, [type, format, filename, total, ok, errorCount, JSON.stringify(errors)]);
  }
}

module.exports = ExportService;
