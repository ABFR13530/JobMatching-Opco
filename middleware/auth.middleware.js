/**
 * middleware/auth.middleware.js
 * 
 * Middleware de sécurité : Vérification des JWT et contrôle des Rôles (RBAC).
 * Prêt pour une future intégration SSO (les tokens viendront de Numeric'Emploi).
 */
const jwt = require('jsonwebtoken');

// Clé secrète (à mettre absolument dans le .env en production)
const JWT_SECRET = process.env.JWT_SECRET || 'numeric_emploi_super_secret_key_2026';

/**
 * Middleware générique pour vérifier qu'un utilisateur est connecté (token valide)
 */
const verifyToken = (req, res, next) => {
  // Le token est attendu dans le header: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Accès refusé. Token manquant ou mal formaté." });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Si le token est valide, on extrait le payload (id, role, region, etc.)
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // On l'injecte dans la requête pour les prochains contrôleurs
    next();
  } catch (err) {
    return res.status(403).json({ error: "Session expirée ou Token invalide." });
  }
};

/**
 * Middleware de contrôle d'accès basé sur les rôles (RBAC)
 * @param {Array} allowedRoles - Liste des rôles autorisés (ex: ['advisor', 'recruiter'])
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // On s'assure que verifyToken est bien passé avant
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: "Rôle non défini dans la session." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Accès interdit. Cette action nécessite les droits : ${allowedRoles.join(' ou ')}.` 
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
  JWT_SECRET // Exporté au cas où le contrôleur de Login en a besoin
};
