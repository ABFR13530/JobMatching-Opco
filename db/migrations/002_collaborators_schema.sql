-- Migration 002 : Gestion des accès internes (Opco Atlas)
-- Création des collaborateurs et du Super Admin

BEGIN;

-- 1. Table des utilisateurs internes (Super Admin & Conseillers)
CREATE TABLE IF NOT EXISTS collaborators (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255), -- Utilisé uniquement en mode Standalone
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'advisor')),
    region VARCHAR(100), -- NULL pour le super_admin (accès national)
    statut VARCHAR(50) DEFAULT 'actif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insertion automatique du Super Admin (abossan@opco-atlas.fr)
-- En mode Standalone, il faudra définir son premier mot de passe.
-- Ici on insère le compte par défaut.
INSERT INTO collaborators (email, role, region)
VALUES ('abossan@opco-atlas.fr', 'super_admin', NULL)
ON CONFLICT (email) DO NOTHING;

COMMIT;
