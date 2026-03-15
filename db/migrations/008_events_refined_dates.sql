-- Migration 008: Raffinement des dates et heures des événements
ALTER TABLE job_matching_events 
ADD COLUMN IF NOT EXISTS date_fin DATE,
ADD COLUMN IF NOT EXISTS heure_debut TIME DEFAULT '09:00',
ADD COLUMN IF NOT EXISTS heure_fin TIME DEFAULT '18:00',
ADD COLUMN IF NOT EXISTS pause_debut TIME DEFAULT '12:30',
ADD COLUMN IF NOT EXISTS pause_fin TIME DEFAULT '13:30',
ADD COLUMN IF NOT EXISTS created_by_region VARCHAR(100);

-- Mettre à jour les données existantes pour ne pas avoir de NULL sur date_fin
UPDATE job_matching_events SET date_fin = date WHERE date_fin IS NULL;
