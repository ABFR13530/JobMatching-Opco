# Module Job Matching (Numeric'Emploi)
**Version :** 1.0 (Standalone / Interopérable)

Ce module permet de gérer la mise en relation (Job Dating visio) entre des **candidats qualifiés** (niveaux d'employabilité 1 ou 2) et des recruteurs, le tout géré par un **Conseiller Régional**.

Il a été conçu selon le principe "**Adapter > Remplacer**". Il peut être utilisé en totale autonomie dès aujourd'hui (création manuelle des profils ou via CSV), et pourra être synchronisé nativement avec l'IA de *Numeric'Emploi* demain (via Webhooks).

---

## 🚀 1. Installation en mode Standalone

### Prérequis
- **Node.js** (v18+)
- **PostgreSQL** (v14+)
- Un serveur mail SMTP configuré pour SendGrid/Resend (optionnel en dev).

### Étapes d'initialisation
1. Clonez ou installez ce module dans votre environnement :
   ```bash
   cd module_job_matching
   npm install
   ```

2. Créez un fichier `.env` à la racine :
   ```env
   PORT=3000
   DATABASE_URL=postgres://user:password@localhost:5432/numeric_emploi
   # Mettre à "false" pour agir en 100% autonome (Conseiller en contrôle direct)
   NUMERIC_EMPLOI_INTEGRATION=false 
   ```

3. Exécutez les migrations SQL pour initier le schéma de la base de données :
   > Exécutez le script `/db/migrations/001_job_matching_schema.sql` sur votre base PostgreSQL locale.

4. Démarrez le serveur (Mode Dev) :
   ```bash
   npm run dev
   ```

---

## 🛠️ 2. Fonctionnalités Principales (Standalone)

### Espace Conseiller
- Validation des profils entrants et qualification manuelle des scores (1 = Emploi, 2 = Mentoring, 3 = Apprentissage).
- Création d'événements physiques/visio (Job Dating).
- **Import massif** : Via l'interface React, uploadez un `.csv` de candidats (Pôle Emploi, partenaires).

### Espace Candidat
- Pas de création de profil laborieuse. Si qualification validée (1 ou 2), il accède directement au tableau de bord.
- Réservation en **1 CLIC** d'un créneau recruteur limité à sa région.

### Espace Entreprise (Recruteur)
- Accès restreint uniquement aux "candidats qualifiés". 
- Formulaire d'ouverture de créneaux automatiques de 30 minutes.
- Saisie de notes et d'absences en post-visio.

### API Jitsi (Visioconférence)
Aucune installation de serveur Jitsi n'est requise. Le système génère automatiquement des liens sécurisés à usage unique (ex: `https://meet.jit.si/numericEmploi_[EVENT_ID]...`) intégrés dans le dashboard des deux parties.

---

## 🔗 3. Interconnexion avec Numeric'Emploi (Le mode "Connecté")

Passez la variable `NUMERIC_EMPLOI_INTEGRATION=true` pour activer les Webhooks sécurisés. La gestion des profils passera alors en lecture seule pour les conseillers locaux ("Source de vérité : IA centrale").

### A) Import manuel API (via CSV ou JSON)
**POST /api/candidates/import**
*(Form-data `file` ou body JSON)*
Format JSON attendu :
```json
{
  "candidates": [
    {
      "nom": "Dupont",
      "prenom": "Alice",
      "email": "alice@gmail.com",
      "region": "Île-de-France",
      "employabilite_locked": true,
      "niveau_employabilite": 1,
      "competences": ["React", "Express"]
    }
  ]
}
```

### B) Webhook / Synchronisation temps-réel
Le module central *Numeric'Emploi* de l'Opco Atlas peut "pousser" de nouveaux candidats automatiquement dès que l'IA a mis à jour leur score, via :
**POST /api/webhooks/numeric-emploi**
*(Nécessite le Header `X-Signature` HMAC de sécurité).*

### C) Exportation des résultats (pour le BackOffice Central)
Le BackOffice principal peut "tirer" les données de participation (qui est venu et qui a raté son entretien ?) via :
**GET /api/candidates/export?format=csv**

---
✒️ *Module développé par l'Agent IA Antigravity pour la stack MERN (+ PostgreSQL).*
