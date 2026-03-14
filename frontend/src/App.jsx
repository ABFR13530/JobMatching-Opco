import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// Import de nos écrans
import Home from './pages/Home';
import AdvisorDashboard from './pages/AdvisorDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import CandidateRegistration from './pages/CandidateRegistration';
import RecruiterRegistration from './pages/RecruiterRegistration';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'Accueil Principale (Le magnifique hub) */}
        <Route path="/" element={<Home />} />
        
        {/* Pages Publiques (Standalone) */}
        <Route path="/register-candidat" element={<CandidateRegistration />} />
        <Route path="/register-recruteur" element={<RecruiterRegistration />} />
        
        {/* Les Accès aux Dashboards connectés */}
        <Route path="/connexion/interne" element={<AdvisorDashboard />} />
        <Route path="/connexion/candidat" element={<CandidateDashboard />} />
        <Route path="/connexion/recruteur" element={<RecruiterDashboard />} />

        {/* Garder la compatibilité avec les anciens chemins de l'Admin */}
        <Route path="/dashboard/superadmin" element={<SuperAdminDashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
