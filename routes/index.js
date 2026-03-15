/**
 * routes/index.js
 * 
 * Ce fichier regroupe l'injection du pool DB et configure l'Express Router
 * avec le support de Multer pour l'upload de fichiers CSV/JSON.
 */
const express = require('express');
const multer = require('multer');

// Middleware Multer natif (stockage en mémoire) pour intercepter multipart/form-data
const upload = multer({ storage: multer.memoryStorage() });

module.exports = (db) => {
  const router = express.Router();

  // Import des contrôleurs injectés
  const interopCtrl = require('../controllers/interop.controller')(db);
  const eventCtrl = require('../controllers/event.controller')(db);
  const candidateCtrl = require('../controllers/candidate.controller')(db);
  const authCtrl = require('../controllers/auth.controller')(db);
  const jobOfferCtrl = require('../controllers/job_offer.controller')(db);
  const companyCtrl = require('../controllers/company.controller')(db);
  const userCtrl = require('../controllers/user.controller')(db);
  const notificationCtrl = require('../controllers/notification.controller')(db);
  const { verifyToken, requireRole } = require('../middleware/auth.middleware');

  // ==========================================
  // ROUTES D'AUTHENTIFICATION & SUPER ADMIN
  // ==========================================
  router.post('/auth/login', authCtrl.loginInternal);
  
  // Seul le Super Admin peut créer des comptes Conseillers régionaux
  router.post('/admin/advisors', verifyToken, requireRole(['super_admin']), authCtrl.createAdvisor);

  // Suppression de compte (RGPD)
  router.delete('/auth/me', userCtrl.deleteAccount);

  // ==========================================
  // ROUTES D'INTEROPÉRABILITÉ (Standalone/Connecté)
  // ==========================================
  
  // POST form-data "file" pour upload manuel OU JSON brut
  router.post('/candidates/import', upload.single('file'), interopCtrl.importCandidates);
  router.get('/candidates/export', interopCtrl.exportCandidates);

  // Webhook sécurisé pour Numeric'Emploi (Mode Connecté)
  router.post('/webhooks/numeric-emploi', interopCtrl.numericEmploiWebhook);


  // ==========================================
  // ROUTES DE GESTION DES CANDIDATS (CRUD CONSEILLER)
  // ==========================================
  router.post('/candidates', candidateCtrl.createCandidate);
  router.put('/candidates/:id', candidateCtrl.updateCandidate);
  router.get('/candidates/qualified', candidateCtrl.getQualifiedCandidates);

  // ==========================================
  // ROUTES D'ÉVÉNEMENTS & JOB MATCHING
  // ==========================================
  router.post('/events', eventCtrl.createEvent);
  router.get('/events', eventCtrl.listEvents);
  router.get('/events/:id/slots', eventCtrl.listSlots);
  router.post('/events/:id/slots', eventCtrl.createSlots);
  
  // Endpoint critique de réservation transactionnelle
  router.post('/events/book', eventCtrl.bookSlot);

  // ==========================================
  // ROUTES DES OFFRES D'EMPLOI (DÉPÔT ENTREPRISE)
  // ==========================================
  router.get('/offers', jobOfferCtrl.listOffers);
  router.post('/offers', jobOfferCtrl.createOffer);
  router.post('/offers/:id/apply', jobOfferCtrl.applyToOffer);
  router.delete('/offers/:id', jobOfferCtrl.deleteOffer);

  // ==========================================
  // ROUTES DES ENTREPRISES (STAND EXPOSANT)
  // ==========================================
  router.get('/companies', companyCtrl.listCompanies);
  router.get('/companies/all', companyCtrl.listAllCompanies);
  router.get('/companies/:id', companyCtrl.getCompany);
  router.put('/companies/:id', companyCtrl.updateCompany);
  router.patch('/companies/:id/validate', companyCtrl.validateCompany);

  // ==========================================
  // ROUTES DES NOTIFICATIONS
  // ==========================================
  router.get('/notifications', notificationCtrl.listNotifications);
  router.put('/notifications/:id/read', notificationCtrl.markAsRead);

  return router;
};
