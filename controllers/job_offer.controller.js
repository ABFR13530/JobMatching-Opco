/**
 * controllers/job_offer.controller.js
 * 
 * Gestion des offres d'emploi (Dépôt par les recruteurs)
 */

module.exports = (db) => {
  return {
    /**
     * @route GET /api/offers
     */
    async listOffers(req, res) {
      try {
        const { rows } = await db.query('SELECT * FROM job_offers ORDER BY created_at DESC');
        res.status(200).json({ success: true, offers: rows });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    /**
     * @route POST /api/offers
     */
    async createOffer(req, res) {
      const { title, description, contract_type, location, salary_range, is_remote } = req.body;
      const recruiter_id = req.user?.id || 1; // Fallback pour la démo

      try {
        const query = `
          INSERT INTO job_offers (recruiter_id, title, description, contract_type, location, salary_range, is_remote)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `;
        const { rows } = await db.query(query, [recruiter_id, title, description, contract_type, location, salary_range, is_remote]);
        res.status(201).json({ success: true, offer: rows[0] });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  };
};
