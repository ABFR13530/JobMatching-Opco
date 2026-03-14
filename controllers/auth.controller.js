/**
 * controllers/auth.controller.js
 * 
 * Gestion de l'authentification Standalone et de l'administration des comptes internes.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth.middleware');

module.exports = (db) => {
  return {
    /**
     * @route POST /api/auth/login
     * @desc Authentifie un collaborateur (Super Admin ou Conseiller) et renvoie un JWT.
     */
    async loginInternal(req, res) {
      const { email, password } = req.body;

      try {
        const { rows } = await db.query('SELECT * FROM collaborators WHERE email = $1', [email]);
        if (rows.length === 0) return res.status(401).json({ error: "Identifiants invalides." });

        const user = rows[0];

        // Vérification par mot de passe (si défini)
        // Note: Le Super Admin par défaut doit configurer son MDP ou utiliser un mot de passe temporaire initialisé
        if (user.password_hash) {
          const valid = await bcrypt.compare(password, user.password_hash);
          if (!valid) return res.status(401).json({ error: "Identifiants invalides." });
        } else if (email === 'abossan@opco-atlas.fr') {
          // Bypass temporaire de premier démarrage pour le Super Admin (à retirer en Prod)
          if (password !== 'AdminAtlas2026!') return res.status(401).json({ error: "Identifiants invalides." });
        } else {
             return res.status(401).json({ error: "Compte non initialisé." });
        }

        // On forge le Token avec son Rôle (admin ou advisor)
        const token = jwt.sign({ id: user.id, role: user.role, region: user.region }, JWT_SECRET, { expiresIn: '8h' });

        res.status(200).json({ success: true, token, user: { email: user.email, role: user.role, region: user.region } });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    /**
     * @route POST /api/admin/advisors
     * @desc Créer un nouveau compte Conseiller. ROUTE RÉSERVÉE AU SUPER ADMIN.
     */
    async createAdvisor(req, res) {
      const { email, password, region } = req.body;

      try {
        // Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const query = `
          INSERT INTO collaborators (email, password_hash, role, region)
          VALUES ($1, $2, 'advisor', $3) RETURNING id, email, role, region
        `;
        const { rows } = await db.query(query, [email, passwordHash, region]);
        
        res.status(201).json({ success: true, advisor: rows[0] });
      } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: "Cet email possède déjà un compte." });
        res.status(500).json({ error: err.message });
      }
    }
  };
};
