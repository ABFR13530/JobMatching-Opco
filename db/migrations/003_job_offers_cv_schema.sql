-- Migration 003 : Dépôt d'Offres & Profils Candidats Enrichis

BEGIN;

-- 1. Ajout des compléments d'infos pour les Candidats
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS cv_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS short_bio TEXT,
ADD COLUMN IF NOT EXISTS annees_experience INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS disponibilite VARCHAR(50);

-- 2. Création de la table des Offres d'Emploi (Dépôt par Recruteur)
CREATE TABLE IF NOT EXISTS job_offers (
    id SERIAL PRIMARY KEY,
    recruiter_id INT NOT NULL, -- FK vers la table companies/recruiters
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    contract_type VARCHAR(50) NOT NULL CHECK (contract_type IN ('CDI', 'CDD', 'Alternance', 'Stage', 'Freelance')),
    location VARCHAR(255) NOT NULL,
    salary_range VARCHAR(100),
    is_remote BOOLEAN DEFAULT false,
    statut VARCHAR(50) DEFAULT 'active' CHECK (statut IN ('active', 'pourvue', 'archivee')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_offers_recruiter ON job_offers(recruiter_id);

COMMIT;
