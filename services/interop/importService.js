/**
 * services/interop/importService.js
 * 
 * Service d'importation des candidats (CSV / JSON)
 * Assure la validation, l'insertion en base et la journalisation des erreurs.
 */
const csvParse = require('csv-parse/sync');

class ImportService {
  constructor(db) {
    this.db = db; // Instance de base de données (ex: pool pg)
  }

  /**
   * Process l'import d'un fichier et insère les candidats valides
   */
  async processImport(fileBuffer, format, filename, source = 'import_csv') {
    let rows = [];
    const errors = [];
    let records_ok = 0;
    
    // 1. Parsing du fichier
    try {
      if (format === 'csv') {
        // csv-parse gère nativement les headers et supprime les espaces
         rows = csvParse.parse(fileBuffer, { columns: true, skip_empty_lines: true, trim: true });
      } else if (format === 'json') {
         rows = JSON.parse(fileBuffer.toString('utf8'));
         if(!Array.isArray(rows)) throw new Error("Le document JSON doit représenter un tableau d'objets.");
      } else {
         throw new Error("Format non supporté. Utilisez 'csv' ou 'json'.");
      }
    } catch (err) {
      await this.logRun('import', format, filename, 0, 0, 1, [{ line: 0, error: `Erreur de parsing: ${err.message}` }]);
      throw new Error(`Échec de la lecture du fichier : ${err.message}`);
    }

    const records_total = rows.length;

    // 2. Traitement ligne par ligne
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const validationError = this.validateRow(row);
      
      if (validationError) {
        errors.push({ line: i + 1, data: row.email || row.nom || 'Inconnu', error: validationError });
        continue;
      }

      try {
        await this.upsertCandidate(row, source);
        records_ok++;
      } catch (dbErr) {
        errors.push({ line: i + 1, data: row.email, error: `BDD Erreur: ${dbErr.message}` });
      }
    }

    // 3. Journalisation de l'opération dans import_export_logs
    await this.logRun('import', format, filename, records_total, records_ok, errors.length, errors);
    
    return {
      success: true,
      records_total,
      records_ok,
      records_error: errors.length,
      errors
    };
  }

  /**
   * Vérifie la validité d'une ligne avant l'insertion
   */
  validateRow(row) {
    if (!row.nom) return "Nom manquant";
    if (!row.prenom) return "Prénom manquant";
    if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) return "Email invalide ou manquant";
    if (!row.region) return "Région manquante";
    if (!row.niveau_employabilite || ![1, 2, 3].includes(Number(row.niveau_employabilite))) {
       return "Niveau d'employabilité invalide (doit être 1, 2 ou 3)";
    }
    return null;
  }

  /**
   * Insère ou Met à jour un candidat.
   * La mise à jour du score n'a lieu que s'il n'est PAS verrouillé par l'IA.
   */
  async upsertCandidate(data, source) {
    // Si la source est 'numeric_emploi', on verrouille le score pour empêcher une modif manuelle.
    const isLocked = source === 'numeric_emploi' || String(data.employability_score_locked) === 'true';
    const externalId = data.external_id || null;
    const competences = data.competences ? JSON.stringify(data.competences) : '[]';

    const query = `
      INSERT INTO candidates (external_id, source, nom, prenom, email, region, competences, niveau_employabilite, employability_score_locked, statut)
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10)
      ON CONFLICT (email) 
      DO UPDATE SET 
        nom = EXCLUDED.nom,
        prenom = EXCLUDED.prenom,
        region = EXCLUDED.region,
        competences = EXCLUDED.competences,
        -- Ne mettre à jour le niveau que s'il n'est pas déjà verrouillé en base
        niveau_employabilite = CASE WHEN candidates.employability_score_locked = false THEN EXCLUDED.niveau_employabilite ELSE candidates.niveau_employabilite END,
        employability_score_locked = EXCLUDED.employability_score_locked,
        updated_at = CURRENT_TIMESTAMP
    `;
    
    await this.db.query(query, [
      externalId,
      source,
      data.nom,
      data.prenom,
      data.email,
      data.region,
      competences,
      Number(data.niveau_employabilite),
      isLocked,
      data.statut || 'actif'
    ]);
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

module.exports = ImportService;
