-- Migration 005 : Événements Avancés & Quotas
BEGIN;

-- 1. Ajout des options de format et durée aux événements
ALTER TABLE job_matching_events
ADD COLUMN IF NOT EXISTS event_format VARCHAR(50) DEFAULT 'virtuel' CHECK (event_format IN ('presentiel', 'virtuel', 'hybride')),
ADD COLUMN IF NOT EXISTS interview_duration INT DEFAULT 20, -- Durée en minutes (15, 20, 30)
ADD COLUMN IF NOT EXISTS max_companies INT DEFAULT 10,  -- Quota entreprises
ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. Liaison Entreprise <-> Événement (Statut d'inscription)
-- On utilise event_companies mais on lui ajoute un statut
ALTER TABLE event_companies
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'invite' CHECK (status IN ('invite', 'confirme', 'refuse', 'present'));

COMMIT;
