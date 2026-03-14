/**
 * controllers/interop.controller.js
 * 
 * Ce contrôleur gère toutes les demandes liées à l'intégration externe :
 * Import, Export, et réception via Webhooks (Mode connecté).
 */
const ImportService = require('../services/interop/importService');
const ExportService = require('../services/interop/exportService');

// Ces endpoints nécessitent une instance de base de données injectée (ex: pool pg)
module.exports = (db) => {
  const importService = new ImportService(db);
  const exportService = new ExportService(db);

  return {
    /**
     * @route POST /api/candidates/import
     * @desc Importe une liste de candidats qualifiés depuis un fichier (CSV) ou body (JSON)
     */
    async importCandidates(req, res) {
      try {
        // En mode "API" pur, le JSON arrive souvent dans req.body,
        // En mode Formulaire/Upload, le CSV arrive dans req.files (ex: avec multer)
        let format, dataBuffer;
        const source = req.body.source || 'import_csv';

        if (req.is('application/json')) {
          format = 'json';
          dataBuffer = Buffer.from(JSON.stringify(req.body.candidates));
        } else if (req.file) {
          format = req.file.mimetype.includes('csv') ? 'csv' : 'json';
          dataBuffer = req.file.buffer;
        } else {
           return res.status(400).json({ error: "Format non supporté ou fichier manquant." });
        }

        const result = await importService.processImport(dataBuffer, format, req.file?.originalname || 'api_upload', source);
        res.status(200).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    /**
     * @route GET /api/candidates/export
     * @desc Exporte les candidats, avec statuts d'entretiens si un event_id est fourni.
     * @query format (csv|json), event_id (optionnel)
     */
    async exportCandidates(req, res) {
      try {
        const format = req.query.format || 'json';
        const eventId = req.query.event_id || null;

        const result = await exportService.exportCandidates(format, eventId);
        
        // On configure les headers pour forcer le téléchargement si demandé par le client
        res.setHeader('Content-Type', result.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.status(200).send(result.data);
      } catch (err) {
        res.status(500).json({ error: `Erreur d'export: ${err.message}` });
      }
    },

    /**
     * @route POST /api/webhooks/numeric-emploi
     * @desc Endpoint pour la synchronisation automatique (Mode Connecté)
     */
    async numericEmploiWebhook(req, res) {
      const isIntegrationActive = process.env.NUMERIC_EMPLOI_INTEGRATION === 'true';
      if (!isIntegrationActive) {
        return res.status(403).json({ error: "Mode connecté désactivé (Standalone actif)." });
      }

      // TODO: Implémenter la vérification du header HMAC (X-Signature)
      const signature = req.headers['x-signature'];
      if (!signature) {
        return res.status(401).json({ error: "Signature manquante." });
      }

      // Traitement direct via l'import de json
      try {
        const result = await importService.processImport(
          Buffer.from(JSON.stringify(req.body.candidates)), 
          'json', 
          'webhook_sync', 
          'numeric_emploi'
        );
        res.status(200).json({ success: true, processed: result });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  };
};
