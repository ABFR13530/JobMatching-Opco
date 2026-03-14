import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('conseillers'); 
  const [advisors, setAdvisors] = useState([
    { id: 1, email: 'conseiller.idf@opco-atlas.fr', region: 'Île-de-France', eventsCount: 4, status: 'actif' },
    { id: 2, email: 'conseiller.na@opco-atlas.fr', region: 'Nouvelle-Aquitaine', eventsCount: 2, status: 'actif' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newAdvisor, setNewAdvisor] = useState({ email: '', region: 'Île-de-France', password: '' });
  const [creationStatus, setCreationStatus] = useState(null);

  const handleCreateAdvisor = async (e) => {
    e.preventDefault();
    setCreationStatus('loading');
    try {
      const response = await fetch('/api/admin/advisors', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}` 
        },
        body: JSON.stringify(newAdvisor)
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdvisors([...advisors, { ...data.advisor, eventsCount: 0 }]);
        setCreationStatus('success');
        setNewAdvisor({ email: '', region: 'Île-de-France', password: '' });
      } else {
        setCreationStatus('error');
      }
    } catch (err) {
      setCreationStatus('error');
    }
    setTimeout(() => setCreationStatus(null), 4000);
  };

  const handleDeleteAdvisor = (id) => {
    if(window.confirm("Êtes-vous sûr de vouloir bloquer ce conseiller ?")) {
      setAdvisors(advisors.filter(a => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Header National (Super Admin) - Premium Slate */}
      <header className="bg-slate-900 border-b border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
               <Link to="/" className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-display font-bold text-slate-900 text-2xl shadow-lg hover:scale-105 transition">N</Link>
               <div>
                 <h1 className="text-2xl font-display font-bold text-white tracking-tight">Super Administration</h1>
                 <p className="text-slate-400 text-sm mt-0.5">Numeric'Emploi • Pilotage National Opco Atlas</p>
               </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white">abossan@opco-atlas.fr</p>
                  <Link to="/" className="text-xs text-orange-400 font-bold hover:underline italic">Se déconnecter</Link>
               </div>
               <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-lg border border-white/10 shadow-lg backdrop-blur">
                  AB
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Interne */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('conseillers')} className={`${activeTab === 'conseillers' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-5 px-1 border-b-2 font-bold text-sm transition-all`}>
              Réseau de Conseillers Régionaux
            </button>
            <button onClick={() => setActiveTab('stats')} className={`${activeTab === 'stats' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-5 px-1 border-b-2 font-bold text-sm transition-all`}>
              Vue Globale Job Matching
            </button>
            <button onClick={() => setActiveTab('params')} className={`${activeTab === 'params' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-5 px-1 border-b-2 font-bold text-sm transition-all`}>
              Paramètres du Module & Webhooks
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 animate-fade-in-up">
        
        {/* --- TAB : GESTION DES CONSEILLERS --- */}
        {activeTab === 'conseillers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Colonne de Gauche : Création */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sticky top-28">
                <h2 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-3">
                   <span className="text-indigo-500">➕</span> Nouveau Conseiller
                </h2>
                
                {creationStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 text-green-700 text-xs font-bold rounded-xl border border-green-100">
                    ✅ Collaborateur ajouté avec succès.
                  </div>
                )}
                {creationStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-100">
                    ⚠️ Erreur lors de la création du compte.
                  </div>
                )}
                
                <form onSubmit={handleCreateAdvisor} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Opco Atlas</label>
                    <input type="email" required className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
                           value={newAdvisor.email} onChange={e => setNewAdvisor({...newAdvisor, email: e.target.value})} placeholder="nom@opco-atlas.fr" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Région Assignée</label>
                    <select className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                            value={newAdvisor.region} onChange={e => setNewAdvisor({...newAdvisor, region: e.target.value})}>
                      <option>Île-de-France</option>
                      <option>Nouvelle-Aquitaine</option>
                      <option>Auvergne-Rhône-Alpes</option>
                      <option>Bretagne</option>
                      <option>National (Toutes régions)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mot de passe temporaire</label>
                    <input type="text" required className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                           value={newAdvisor.password} onChange={e => setNewAdvisor({...newAdvisor, password: e.target.value})} placeholder="Mot de passe fort" />
                  </div>
                  <button type="submit" disabled={creationStatus === 'loading'} className="w-full py-4 bg-indigo-600 text-white text-sm font-bold flex justify-center items-center rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50">
                    {creationStatus === 'loading' ? 'Création...' : 'Créer le compte'}
                  </button>
                </form>
              </div>
            </div>

            {/* Colonne de Droite : Liste des Conseillers */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h2 className="text-xl font-display font-bold text-slate-900">Réseau Actif ({advisors.length})</h2>
                </div>
                <ul className="divide-y divide-slate-100">
                  {advisors.map(adv => (
                    <li key={adv.id} className="p-8 hover:bg-slate-50/50 transition flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 flex-shrink-0 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-sm shadow-inner">
                          {adv.region.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-900">{adv.email}</p>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 font-medium">
                            <span className="flex items-center gap-1">📍 {adv.region}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-indigo-600">📅 {adv.eventsCount} événements</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-600 border border-green-100">Actif</span>
                        <button onClick={() => handleDeleteAdvisor(adv.id)} className="text-xs font-bold text-red-500 hover:text-white px-4 py-2 hover:bg-red-500 rounded-xl border border-red-50 transition-all">
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
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 text-center">
             <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">📊</div>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Statistiques Nationales</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Consolidation des données temps réel remontées par l'ensemble des conseillers régionaux Opco Atlas.</p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner group hover:bg-white hover:shadow-2xl transition-all duration-300">
                <div className="text-4xl font-display font-bold text-indigo-600 mb-2">6</div>
                <div className="text-xs uppercase font-bold text-slate-400 tracking-widest">Événements Actifs</div>
                <div className="mt-4 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-indigo-500 h-full w-2/3"></div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner group hover:bg-white hover:shadow-2xl transition-all duration-300">
                <div className="text-4xl font-display font-bold text-indigo-600 mb-2">142</div>
                <div className="text-xs uppercase font-bold text-slate-400 tracking-widest">Entreprises Partenaires</div>
              </div>
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner group hover:bg-white hover:shadow-2xl transition-all duration-300">
                <div className="text-4xl font-display font-bold text-green-500 mb-2">89%</div>
                <div className="text-xs uppercase font-bold text-slate-400 tracking-widest">Taux de présence Visio</div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB : PARAMÈTRES (Interopérabilité) --- */}
        {activeTab === 'params' && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 max-w-3xl">
            <h2 className="text-xl font-display font-bold text-slate-900 mb-8 flex items-center gap-3">
               <span className="text-2xl">⚙️</span> Configuration Interopérable
            </h2>
            <div className="space-y-8">
              <label className="flex items-start p-6 rounded-2xl border-2 border-indigo-100 bg-indigo-50/30 cursor-pointer">
                <input type="radio" name="mode" className="mt-1 h-5 w-5 text-indigo-600 border-gray-300" defaultChecked />
                <div className="ml-5">
                  <span className="block font-bold text-slate-900 tracking-tight">Mode Standalone (Déploiement Indépendant)</span>
                  <p className="text-slate-500 mt-2 text-sm leading-relaxed">Le module gère sa propre base de données. Les conseillers pilotent les inscriptions manuellement ou par import CSV.</p>
                </div>
              </label>
              
              <label className="flex items-start p-6 rounded-2xl border border-slate-100 hover:bg-slate-50 transition cursor-not-allowed opacity-60">
                <input type="radio" name="mode" className="mt-1 h-5 w-5 text-slate-300 border-gray-200" disabled />
                <div className="ml-5">
                  <span className="block font-bold text-slate-400 tracking-tight">Mode Connecté (Numeric'Emploi Native)</span>
                  <p className="text-slate-400 mt-2 text-sm leading-relaxed">Synchronisation bi-directionnelle automatique via Webhooks. SSO Numeric'Emploi activé.</p>
                </div>
              </label>
              
              <div className="bg-slate-900 p-6 rounded-2xl font-mono text-[11px] shadow-2xl relative overflow-hidden group">
                 <div className="absolute right-0 top-0 p-3 text-[10px] text-slate-500 font-sans uppercase">API Endpoint</div>
                 <div className="text-indigo-400 mb-2"># Webhook Future URL</div>
                 <code className="text-white block">
                   POST auth_key=ATLAS_2026_X <br/>
                   https://jobmatching.opco-atlas.fr/api/webhooks/numeric-emploi
                 </code>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default SuperAdminDashboard;
