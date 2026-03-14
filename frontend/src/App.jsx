import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// Import de nos écrans précédemment générés
import AdvisorDashboard from './pages/AdvisorDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import CandidateRegistration from './pages/CandidateRegistration';
import RecruiterRegistration from './pages/RecruiterRegistration';

// Une page simple de Login pour orienter les tests
import LoginMock from './pages/LoginMock';

// Un composant Layout basique avec un Header de navigation de démonstration
const DevLayout = ({ children }) => (
  <div>
    <div className="bg-gray-800 text-white text-xs p-2 flex justify-center gap-4 border-b border-gray-700">
       <span className="font-bold text-yellow-500">Mode Développement (Navigation Rapide) :</span>
       <Link to="/" className="hover:text-white text-gray-400 underline">Login Simulateur</Link>
       <Link to="/register-candidat" className="hover:text-white text-gray-400 underline">Inscription Candidat</Link>
       <Link to="/register-recruteur" className="hover:text-white text-gray-400 underline">Inscription Entreprise</Link>
    </div>
    {children}
  </div>
);

function App() {
  return (
    <Router>
      <DevLayout>
        <Routes>
          {/* Par défaut on arrive sur un simulateur de Login */}
          <Route path="/" element={<LoginMock />} />
          
          {/* Pages d'inscription publiques Autonomes */}
          <Route path="/register-candidat" element={<CandidateRegistration />} />
          <Route path="/register-recruteur" element={<RecruiterRegistration />} />
          
          {/* Dashboards Protegés (Routage purement statique pour la Démo) */}
          <Route path="/dashboard/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/dashboard/advisor" element={<AdvisorDashboard />} />
          <Route path="/dashboard/candidat" element={<CandidateDashboard />} />
          <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DevLayout>
    </Router>
  );
}

export default App;
