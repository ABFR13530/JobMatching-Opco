require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

// 1. Initialisation de l'application
const app = express();
const PORT = process.env.PORT || 3000;

// ... (Middlewares et DB existants) ...
app.use(cors());
app.use(express.json());

const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/numeric_emploi',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

dbPool.on('connect', () => {
    console.log('🔗 Connecté à la base PostgreSQL');
});

const routes = require('./routes/index')(dbPool);
app.use('/api', routes);

app.get('/health', (req, res) => {
    res.json({ status: 'Online', mode: process.env.NUMERIC_EMPLOI_INTEGRATION === 'true' ? 'Connected' : 'Standalone' });
});

// ==========================================
// CONFIGURATION DE PRODUCTION (Hébergement)
// Serve les fichiers du Frontend (React) construits
// ==========================================
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Route "Catch-all" pour le React Router (Single Page Application)
// Toute requête qui n'est pas une requête API sera redirigée vers l'interface React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// 5. Lancement du Serveur
app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`🚀 MODULE JOB MATCHING DÉMARRÉ SUR LE PORT ${PORT}`);
  console.log(`📡 Mode Intégration Numeric'Emploi : ${process.env.NUMERIC_EMPLOI_INTEGRATION === 'true' ? 'ACTIF' : 'INACTIF (Standalone)'}`);
  console.log(`===========================================\n`);
});
