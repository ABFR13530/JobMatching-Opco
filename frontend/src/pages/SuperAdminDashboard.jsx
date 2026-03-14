import React, { useState } from 'react';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('conseillers'); 

  // --- Mock Data simulée provenant de l'API ---
  const currentAdmin = {
    email: 'abossan@opco-atlas.fr',
    role: 'super_admin'
  };

  const [advisors, setAdvisors] = useState([
    { id: 1, email: 'conseiller.idf@opco-atlas.fr', region: 'Île-de-France', eventsCount: 4, status: 'actif' },
    { id: 2, email: 'conseiller.na@opco-atlas.fr', region: 'Nouvelle-Aquitaine', eventsCount: 2, status: 'actif' },
  ]);

  // Formulaire de création de conseiller
  const [newAdvisor, setNewAdvisor] = useState({ email: '', region: 'Île-de-France', password: '' });
  const [creationStatus, setCreationStatus] = useState(null);

  // --- Handlers UI ---
  const handleCreateAdvisor = async (e) => {
    e.preventDefault();
    try {
      // Simulation: Appel réel vers "POST /api/admin/advisors", protégé par le JWT du Super Admin
      /* 
      const response = await fetch('/api/admin/advisors', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(newAdvisor)
      });
      */
      
      const newEntry = { 
        id: Date.now(), 
        email: newAdvisor.email, 
        region: newAdvisor.region, 
        eventsCount: 0, 
        status: 'actif' 
      };
      
      setAdvisors([...advisors, newEntry]);
      setCreationStatus('success');
      setNewAdvisor({ email: '', region: 'Île-de-France', password: '' });
      setTimeout(() => setCreationStatus(null), 3000);
      
    } catch (err) {
      setCreationStatus('error');
    }
  };

  const handleDeleteAdvisor = (id) => {
    if(window.confirm("Êtes-vous sûr de vouloir bloquer ce conseiller ?")) {
      setAdvisors(advisors.filter(a => a.id !== id));
      // Appellerait idéalement un "PUT /api/admin/advisors/:id { statut: 'inactif' }"
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Header National (Super Admin) */}
      <header className="bg-slate-900 text-white p-6 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Super Administration — Numeric'Emploi</h1>
            <p className="text-sm text-slate-400 mt-1">Plateforme de Job Matching (Accès National)</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-semibold">{currentAdmin.email}</div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-900 text-red-100">
                Super Admin
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-lg border border-slate-600">
              AB
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Interne */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('conseillers')} className={`${activeTab === 'conseillers' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
              Réseau de Conseillers Régionaux
            </button>
            <button onClick={() => setActiveTab('stats')} className={`${activeTab === 'stats' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
              Vue Globale Job Matching
            </button>
            <button onClick={() => setActiveTab('params')} className={`${activeTab === 'params' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
              Paramètres du Module & Webhooks
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* --- TAB : GESTION DES CONSEILLERS --- */}
        {activeTab === 'conseillers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Colonne de Gauche : Création */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Ajouter un Conseiller</h2>
                
                {creationStatus === 'success' && (
                  <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">
                    Nouveau collaborateur ajouté avec succès.
                  </div>
                )}
                
                <form onSubmit={handleCreateAdvisor} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Opco Atlas</label>
                    <input type="email" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
                           value={newAdvisor.email} onChange={e => setNewAdvisor({...newAdvisor, email: e.target.value})} placeholder="nom@opco-atlas.fr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Région Assignée</label>
                    <select className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            value={newAdvisor.region} onChange={e => setNewAdvisor({...newAdvisor, region: e.target.value})}>
                      <option>Île-de-France</option>
                      <option>Nouvelle-Aquitaine</option>
                      <option>Auvergne-Rhône-Alpes</option>
                      <option>Bretagne</option>
                      <option>National (Toutes régions)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe temporaire</label>
                    <input type="text" required className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                           value={newAdvisor.password} onChange={e => setNewAdvisor({...newAdvisor, password: e.target.value})} placeholder="Mot de passe fort" />
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-600 text-white text-sm font-medium flex justify-center items-center rounded-md hover:bg-indigo-700 shadow-sm transition">
                    Créer le compte
                  </button>
                </form>
              </div>
            </div>

            {/* Colonne de Droite : Liste des Conseillers */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-900">Réseau Actif ({advisors.length})</h2>
                </div>
                <ul className="divide-y divide-slate-200">
                  {advisors.map(adv => (
                    <li key={adv.id} className="p-6 hover:bg-slate-50 transition flex flex-col sm:flex-row justify-between sm:items-center">
                      <div className="flex items-center gap-4 mb-3 sm:mb-0">
                        <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                          {adv.region.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{adv.email}</p>
                          <p className="text-xs text-slate-500 mt-0.5 flex gap-2">
                            <span>📍 {adv.region}</span>
                            <span className="text-slate-300">|</span>
                            <span>📅 {adv.eventsCount} événements créés</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Compte Actif</span>
                        <button onClick={() => handleDeleteAdvisor(adv.id)} className="text-xs font-semibold text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition">
                          Révoquer Accès
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
          </div>
        )}

        {/* --- TAB : VUE GLOBALE (MOCK) --- */}
        {activeTab === 'stats' && (
          <div className="bg-white rounded-xl shadow border border-slate-200 p-8 text-center text-slate-500">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Statistiques Nationales Job Matching</h2>
            <p>Cet espace consolidera les données remontées par l'ensemble des conseillers régionaux :<br/>Nombre total d'inscrits, Entretiens réalisés par les entreprises, Taux de présence Jitsi global.</p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                <div className="text-3xl font-bold text-indigo-600">6</div>
                <div className="text-sm uppercase font-semibold text-slate-500 mt-1">Événements en cours</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                <div className="text-3xl font-bold text-indigo-600">142</div>
                <div className="text-sm uppercase font-semibold text-slate-500 mt-1">Entreprises Impliquées</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                <div className="text-3xl font-bold text-green-600">89%</div>
                <div className="text-sm uppercase font-semibold text-slate-500 mt-1">Taux de présence Visio</div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB : PARAMÈTRES (Interopérabilité) --- */}
        {activeTab === 'params' && (
          <div className="bg-white rounded-xl shadow border border-slate-200 p-8 max-w-3xl">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Paramètres d'Interopérabilité (Béta)</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="Mode Standalone" type="radio" name="mode" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" defaultChecked />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-slate-700">Mode Standalone (Actuel)</label>
                  <p className="text-slate-500 mt-1 text-xs">Le module vit de façon autonome. Vos conseillers importent les candidats par CSV ou les créent manuellement.</p>
                </div>
              </div>
              
              <div className="flex items-start pt-4 border-t border-slate-100">
                <div className="flex items-center h-5">
                  <input id="Mode Connecté" type="radio" name="mode" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-slate-700">Mode Connecté SSO (En cours d'intégration)</label>
                  <p className="text-slate-500 mt-1 text-xs">Les candidats seront synchronisés automatiquement via l'API (Webhooks) de Numeric'Emploi après la passe IA.</p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mt-4 font-mono text-xs overflow-x-auto text-slate-600">
                 URL de réception Webhook future : <br/>
                 <span className="font-bold text-indigo-600">POST https://jobmatching.opco-atlas.fr/api/webhooks/numeric-emploi</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default SuperAdminDashboard;
