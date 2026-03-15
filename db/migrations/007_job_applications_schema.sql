-- Migration 007 : Candidatures aux Offres
BEGIN;

CREATE TABLE IF NOT EXISTS job_applications (
    id SERIAL PRIMARY KEY,
    offer_id INT NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
    candidate_id INT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    cover_letter TEXT,
    statut VARCHAR(50) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'entrevue', 'refusee', 'recrute')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(offer_id, candidate_id) -- Un candidat ne postule qu'une fois par offre
);

CREATE INDEX idx_job_app_offer ON job_applications(offer_id);
CREATE INDEX idx_job_app_candidate ON job_applications(candidate_id);

COMMIT;
