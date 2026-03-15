-- Migration 006 : Système de Notifications
BEGIN;

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT,               -- ID du candidat ou du recruteur (ou null pour broadcast)
    user_role VARCHAR(50),      -- candidate, recruiter, advisor
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- info, success, warning, match
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour accélérer la lecture des notifs par utilisateur
CREATE INDEX idx_notifications_user ON notifications(user_id, user_role) WHERE user_id IS NOT NULL;

COMMIT;
