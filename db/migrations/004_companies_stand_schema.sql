-- Migration 004 : Entreprises & Stands Virtuels
BEGIN;

-- 1. Table des Entreprises (Recruteurs)
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    siret VARCHAR(14),
    description TEXT,
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    website_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    industry VARCHAR(100), -- Secteur d'activité
    size VARCHAR(50),     -- Taille (TPE, PME, etc.)
    video_url VARCHAR(255), -- Lien YouTube/Vimeo
    address TEXT,
    contact_email VARCHAR(255),
    is_validated BOOLEAN DEFAULT false, -- Validation par l'organisateur
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Ajout de la liaison dans job_offers si pas déjà fait ou pour renforcer
-- Note: On garde recruiter_id pour la compatibilité, mais on pourra utiliser company_id
ALTER TABLE job_offers 
ADD COLUMN IF NOT EXISTS company_id INT REFERENCES companies(id) ON DELETE SET NULL;

-- 3. Ajout de colonnes pour les documents téléchargeables (simplifié en JSONB)
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]'::jsonb; -- [{name: 'Brochure', url: '...'}]

-- 4. Insertion d'une entreprise démo
INSERT INTO companies (name, description, industry, size, website_url, is_validated)
VALUES (
    'Capgemini France', 
    'Leader mondial du conseil, des services informatiques et de la transformation numérique, Capgemini est à la pointe de l’innovation pour répondre à l’ensemble des opportunités de ses clients.', 
    'Services Numériques', 
    'Grande Entreprise', 
    'https://www.capgemini.com/fr-fr/', 
    true
) ON CONFLICT DO NOTHING;

COMMIT;
