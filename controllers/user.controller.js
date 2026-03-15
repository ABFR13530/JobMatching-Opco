module.exports = (db) => {
  return {
    /**
     * @desc Supprimer son propre profil (RGPD - Droit à l'oubli)
     */
    async deleteAccount(req, res) {
      // Pour la démo, on récupère les ID depuis le localstorage via le front,
      // mais en prod on utiliserait req.user (JWT)
      const { userId, role } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "Identifiant utilisateur manquant" });
      }

      try {
        await db.query('BEGIN');

        if (role === 'candidate') {
          // 1. Supprimer les réservations
          await db.query('DELETE FROM interview_slots WHERE candidate_id = $1', [userId]);
          // 2. Supprimer le candidat
          await db.query('DELETE FROM candidates WHERE id = $1', [userId]);
        } 
        else if (role === 'recruiter') {
          // 3. Supprimer les offres de l'entreprise
          await db.query('DELETE FROM job_offers WHERE company_id = $1', [userId]);
          // 4. Supprimer l'entreprise
          await db.query('DELETE FROM companies WHERE id = $1', [userId]);
        }

        await db.query('COMMIT');
        res.status(200).json({ success: true, message: "Compte supprimé definitivement. Vos données ont été effacées conformément au RGPD." });
      } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la suppression du compte" });
      }
    }
  };
};
