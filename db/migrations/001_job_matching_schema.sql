-- Migration Initiale : Module Job Matching Autonome & Interopérable
-- Création du schéma de base de données

BEGIN;

-- 1. Table des candidats (hybride : autonome / importé)
CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE, -- ID provenant de Numeric'Emploi (si importé)
    source VARCHAR(50) NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'numeric_emploi', 'import_csv')),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    region VARCHAR(100) NOT NULL,
    competences JSONB DEFAULT '[]'::jsonb,
    niveau_employabilite INT CHECK (niveau_employabilite IN (1, 2, 3)),
    employability_score_locked BOOLEAN DEFAULT false,
    statut VARCHAR(50) DEFAULT 'actif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table des événements de Job Matching
CREATE TABLE IF NOT EXISTS job_matching_events (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    region VARCHAR(100) NOT NULL,
    max_participants INT NOT NULL DEFAULT 50,
    statut VARCHAR(50) DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'publie', 'cloture', 'archive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table de liaison Événements <-> Entreprises (Recruteurs)
-- Note: 'company_id' référence une table 'companies' existante dans la DB Numeric'Emploi,
-- ou sert de référence externe en mode standalone.
CREATE TABLE IF NOT EXISTS event_companies (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES job_matching_events(id) ON DELETE CASCADE,
    company_id INT NOT NULL, -- FK vers la table companies (à adapter selon le schéma principal)
    UNIQUE(event_id, company_id)
);

-- 4. Table des créneaux horaires ouverts par les recruteurs
CREATE TABLE IF NOT EXISTS event_slots (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES job_matching_events(id) ON DELETE CASCADE,
    recruiter_id INT NOT NULL, -- FK vers la table des utilisateurs/recruteurs
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_booked BOOLEAN DEFAULT false,
    -- Empêcher le chevauchement (basique) pour un même recruteur
    CONSTRAINT chk_time_order CHECK (end_time > start_time)
);

-- 5. Table des réservations de créneaux candidas
CREATE TABLE IF NOT EXISTS event_bookings (
    id SERIAL PRIMARY KEY,
    slot_id INT NOT NULL REFERENCES event_slots(id) ON DELETE CASCADE UNIQUE, -- 1 résa max par slot
    candidate_id INT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    jitsi_link VARCHAR(255),
    attended BOOLEAN DEFAULT NULL, -- NULL = Pas encore passé, True = Présent, False = Absent
    feedback_recruiter TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Un candidat ne peut réserver qu'un seul créneau avec le même recruteur sur un même événement
    -- Cette contrainte complexe est généralement gérée côté applicatif, mais l'unicité du slot_id évite déjà le double-booking du créneau.
    UNIQUE(slot_id, candidate_id)
);

-- 6. Table des invitations aux événements
CREATE TABLE IF NOT EXISTS event_invitations (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES job_matching_events(id) ON DELETE CASCADE,
    candidate_id INT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    opened_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'envoyee' CHECK (status IN ('envoyee', 'ouverte', 'acceptee', 'refusee')),
    UNIQUE(event_id, candidate_id)
);

-- 7. Table de traçabilité des imports / exports (Interopérabilité)
CREATE TABLE IF NOT EXISTS import_export_logs (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('import', 'export')),
    format VARCHAR(10) NOT NULL CHECK (format IN ('csv', 'json')),
    filename VARCHAR(255),
    records_total INT DEFAULT 0,
    records_ok INT DEFAULT 0,
    records_error INT DEFAULT 0,
    errors JSONB DEFAULT '[]'::jsonb, -- Détail des lignes en erreur
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les recherches fréquentes
CREATE INDEX idx_candidates_region ON candidates(region);
CREATE INDEX idx_candidates_niveau ON candidates(niveau_employabilite);
CREATE INDEX idx_events_region ON job_matching_events(region);
CREATE INDEX idx_events_statut ON job_matching_events(statut);
CREATE INDEX idx_slots_event_recruiter ON event_slots(event_id, recruiter_id);

COMMIT;
