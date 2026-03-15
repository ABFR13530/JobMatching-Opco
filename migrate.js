require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigrations() {
  console.log("🚀 Démarrage de la migration de la base de données...");
  
  const migrationFiles = [
    '001_job_matching_schema.sql',
    '002_collaborators_schema.sql',
    '003_job_offers_cv_schema.sql',
    '004_companies_stand_schema.sql',
    '005_events_advanced_schema.sql',
    '006_notifications_schema.sql',
    '007_job_applications_schema.sql'
  ];

  for (const file of migrationFiles) {
    console.log(`📑 Lecture de ${file}...`);
    const filePath = path.join(__dirname, 'db', 'migrations', file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    try {
      await pool.query(sql);
      console.log(`✅ ${file} appliqué avec succès.`);
    } catch (err) {
      console.error(`❌ Erreur sur ${file}:`, err.message);
    }
  }

  console.log("\n✨ Migration terminée ! Vous pouvez maintenant rafraîchir la page sur Render.");
  process.exit();
}

runMigrations();
