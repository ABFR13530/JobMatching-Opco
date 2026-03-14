import React, { useState } from 'react';

const AdvisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('candidats'); // 'candidats', 'entreprises', 'events', 'import'

  // --- Mock Data pour affichage UI ---
  const pendingCandidates = [
    { id: 1, nom: 'Dupont', prenom: 'Alice', email: 'alice@example.com', region: 'Île-de-France', competences: 'React, Node', statut: 'en attente' },
    { id: 2, nom: 'Martin', prenom: 'Paul', email: 'paul@example.com', region: 'Nouvelle-Aquitaine', competences: 'Python, SQL', statut: 'en attente' },
  ];

  const pendingCompanies = [
    { 
      id: 1, nom_entreprise: 'Tech Solutions', recruteur: 'Marc Blanc', email: 'marc@techsolutions.com', 
      offre: 'Développeur Fullstack React/Node - CDI (Île-de-France)' 
    }
  ];

  const events = [
    { id: 1, titre: 'Job Dating IDF - Tech & Data', date: '2026-04-10', region: 'Île-de-France', inscrits: 45, slots_reserves: 30, slots_total: 50, statut: 'publie' },
    { id: 2, titre: 'Rencontre Alternance Cyber', date: '2026-05-15', region: 'Nouvelle-Aquitaine', inscrits: 12, slots_reserves: 0, slots_total: 20, statut: 'brouillon' }
  ];

  // --- Handlers UI (Front-end simulé) ---
  const handleValidateCandidate = (id, niveau) => {
    alert(`Candidat ${id} validé avec le niveau d'employabilité ${niveau}. Il accèdera au Job Matching.`);
    // Requête réelle: PUT /api/candidates/:id { statut: 'actif', niveau_employabilite: niveau }
  };

  const handleValidateCompany = (id) => {
    alert(`Entreprise ${id} et son offre d'emploi validées.`);
    // Requête réelle: PUT /api/companies/:id { statut: 'actif' } ...
  };

  const handleImport = (e) => {
    e.preventDefault();
    alert("Simulation de l'upload du fichier CSV/JSON au serveur...");
    // Requête réelle avec form-data vers POST /api/candidates/import
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto block">
        
        {/* Header Dashboard */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Conseiller Régional</h1>
            <p className="text-sm text-gray-500 mt-1">Module Job Matching (Mode Standalone)</p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 shadow flex items-center gap-2">
            <span>+</span> Nouvel Événement
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['candidats', 'entreprises', 'events', 'import'].map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab === 'events' ? 'Événements Job Matching' : tab === 'import' ? 'Interopérabilité (Import)' : `${tab} En attente`}
              </button>
            ))}
          </nav>
        </div>

        {/* --- TAB : CANDIDATS EN ATTENTE --- */}
        {activeTab === 'candidats' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Candidats à qualifier (Apportés via Inscription Publique)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Région</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compétences</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Décision</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingCandidates.map(c => (
                    <tr key={c.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{c.prenom} {c.nom}</div>
                        <div className="text-sm text-gray-500">{c.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.region}</td>
                      <td className="px-6 py-4 text-sm text-gray-500"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{c.competences}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button onClick={() => handleValidateCandidate(c.id, 1)} className="text-green-600 hover:text-green-900 font-medium mr-3">Valider (Niv 1)</button>
                        <button onClick={() => handleValidateCandidate(c.id, 2)} className="text-blue-600 hover:text-blue-900 font-medium mr-3">Valider (Niv 2)</button>
                        <button className="text-red-600 hover:text-red-900 font-medium">Refuser</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB : ENTREPRISES EN ATTENTE --- */}
        {activeTab === 'entreprises' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recruteurs et Offres à valider</h2>
            <div className="space-y-4">
              {pendingCompanies.map(comp => (
                <div key={comp.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-gray-50 hover:bg-white transition">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{comp.nom_entreprise} <span className="text-sm font-normal text-gray-500">({comp.recruteur} - {comp.email})</span></h3>
                    <p className="text-sm text-indigo-600 font-medium mt-1">Offre déposée : {comp.offre}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleValidateCompany(comp.id)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow-sm text-sm font-medium">Accepter & Ouvrir l'accès</button>
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 shadow-sm text-sm font-medium">Mettre en attente</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB : EVENTS --- */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Mes Événements Régionaux</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {events.map(ev => (
                <div key={ev.id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{ev.titre}</h3>
                      <p className="text-sm text-gray-500">{ev.date} - {ev.region}</p>
                    </div>
                    {ev.statut === 'publie' ? 
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Publié</span> :
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Brouillon</span>
                    }
                  </div>
                  <div className="px-4 py-5 sm:p-6 bg-gray-50">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                      <div><dt className="text-sm font-medium text-gray-500">Candidats Ins.</dt><dd className="mt-1 text-2xl font-semibold text-gray-900">{ev.inscrits}</dd></div>
                      <div><dt className="text-sm font-medium text-gray-500">RDV Réservés</dt><dd className="mt-1 text-2xl font-semibold text-blue-600">{ev.slots_reserves}/{ev.slots_total}</dd></div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Remplissage</dt>
                        <dd className="mt-1 text-2xl font-semibold text-green-600">{Math.round((ev.slots_reserves/ev.slots_total || 0)*100)}%</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="px-4 py-4 sm:px-6">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Gérer les invitations & listes ➔</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB : IMPORT DATA --- */}
        {activeTab === 'import' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Importation de masse (Interopérabilité CSV/JSON)</h2>
            <p className="text-sm text-gray-500 mb-6">Uploadez une base de candidats issue d'un système tiers. Le système validera les profils automatiquement.</p>
            
            <form onSubmit={handleImport} className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition">
              <div className="text-gray-400 mb-2">
                 <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Sélectionner un fichier</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv,.json" />
              </label>
              <p className="text-xs text-gray-500 mt-2">CSV ou JSON jusqu'à 5 Mo.</p>
              
              <button type="submit" className="mt-6 w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Lancer l'importation
              </button>
            </form>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Logs d'intégration récents</h3>
              <div className="bg-gray-100 rounded p-4 text-sm font-mono text-gray-700">
                <p>🟢 [2026-03-12] import_candidats_v2.csv : 142 profils intégrés, 0 erreur.</p>
                <p>🔴 [2026-03-14] api_pôle_emploi.json : 8 profils intégrés, <span className="text-red-600 font-bold">2 erreurs (email invalide)</span>.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdvisorDashboard;
