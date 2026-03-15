module.exports = (db) => {
  return {
    /**
     * @desc Liste les notifications pour un utilisateur spécifique
     */
    async listNotifications(req, res) {
      const { userId, role } = req.query; // Simulé : ID passé en query pour la démo
      try {
        const query = `
          SELECT * FROM notifications 
          WHERE (user_id = $1 AND user_role = $2) OR (user_id IS NULL AND user_role = $2)
          ORDER BY created_at DESC LIMIT 20
        `;
        const { rows } = await db.query(query, [userId || null, role]);
        res.status(200).json({ success: true, notifications: rows });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    /**
     * @desc Marquer une notification comme lue
     */
    async markAsRead(req, res) {
      const { id } = req.params;
      try {
        await db.query('UPDATE notifications SET is_read = true WHERE id = $1', [id]);
        res.status(200).json({ success: true });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  };
};
