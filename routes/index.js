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
  const offerCtrl = require('../controllers/job_offer.controller')(db);
  const companyCtrl = require('../controllers/company.controller')(db);
  const { verifyToken, requireRole } = require('../middleware/auth.middleware');

  // ==========================================
  // ROUTES D'AUTHENTIFICATION & SUPER ADMIN
  // ==========================================
  router.post('/auth/login', authCtrl.loginInternal);
  
  // Seul le Super Admin peut créer des comptes Conseillers régionaux
  router.post('/admin/advisors', verifyToken, requireRole(['super_admin']), authCtrl.createAdvisor);

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
  
  // Endpoint critique de réservation transactionnelle
  router.post('/events/book', eventCtrl.bookSlot);

  // ==========================================
  // ROUTES DES OFFRES D'EMPLOI (DÉPÔT ENTREPRISE)
  // ==========================================
  router.get('/offers', offerCtrl.listOffers);
  router.post('/offers', offerCtrl.createOffer);

  // ==========================================
  // ROUTES DES ENTREPRISES (STAND EXPOSANT)
  // ==========================================
  router.get('/companies', companyCtrl.listCompanies);
  router.get('/companies/:id', companyCtrl.getCompany);
  router.put('/companies/:id', companyCtrl.updateCompany);

  return router;
};
