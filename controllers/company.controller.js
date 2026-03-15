/**
 * controllers/company.controller.js
 * 
 * Gestion des entreprises et de leur stand (Espace Exposant)
 */

module.exports = (db) => {
  return {
    /**
     * @route GET /api/companies/:id
     * @desc Récupère les détails d'une entreprise pour son stand
     */
    async getCompany(req, res) {
      const { id } = req.params;
      try {
        const { rows } = await db.query('SELECT * FROM companies WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Entreprise non trouvée" });
        res.status(200).json({ success: true, company: rows[0] });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    /**
     * @route PUT /api/companies/:id
     * @desc Met à jour les informations du stand (Description, liens, vidéo)
     */
    async updateCompany(req, res) {
      const { id } = req.params;
      const { name, description, website_url, linkedin_url, video_url, industry, size } = req.body;

      try {
        const query = `
          UPDATE companies SET 
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            website_url = COALESCE($3, website_url),
            linkedin_url = COALESCE($4, linkedin_url),
            video_url = COALESCE($5, video_url),
            industry = COALESCE($6, industry),
            size = COALESCE($7, size),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $8
          RETURNING *
        `;
        const { rows } = await db.query(query, [name, description, website_url, linkedin_url, video_url, industry, size, id]);

        if (rows.length === 0) return res.status(404).json({ error: "Entreprise introuvable." });
        
        res.status(200).json({ success: true, company: rows[0] });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    /**
     * @route GET /api/companies
     * @desc Liste toutes les entreprises validées (pour les candidats)
     */
    async listCompanies(req, res) {
      try {
        const { rows } = await db.query('SELECT * FROM companies WHERE is_validated = true ORDER BY name ASC');
        res.status(200).json({ success: true, companies: rows });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  };
};
