import React, { useState, useEffect } from 'react';

const AdvisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('events'); // events | candidats
  
  // États réels pour l'API
  const [events, setEvents] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Formulaire Nouvel Événement
  const [newEvent, setNewEvent] = useState({ title: '', description: '', event_date: '', location_type: 'visio', region: 'Île-de-France', recruiter_id: 1 });
  const [isCreating, setIsCreating] = useState(false);

  // MOCK LOGIN TEMPORAIRE (On simule un token/header pour l'API)
  const headers = { 'Content-Type': 'application/json' };

  // Charger les vraies données depuis l'API Node.js
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'events') {
        const res = await fetch('/api/events', { headers });
        if(res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        } else {
          // Fallback d'affichage si la BDD est vide ou token invalide
          setEvents([]); 
        }
      } else {
        const res = await fetch('/api/candidates/qualified', { headers });
        if(res.ok) {
          const data = await res.json();
          setCandidates(data.candidates || []);
        }
      }
    } catch (e) {
      console.error("Erreur connexion API", e);
    }
    setIsLoading(false);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers,
        body: JSON.stringify(newEvent)
      });
      if(res.ok) {
        // Rafraîchir la liste et vider le form
        await fetchData();
        setNewEvent({ title: '', description: '', event_date: '', location_type: 'visio', region: 'Île-de-France', recruiter_id: 1 });
      } else {
        alert("Erreur lors de la création en base de données.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur réseau");
    }
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Header Premium Numeric'Emploi */}
      <header className="bg-brand-900 border-b border-brand-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-brand-600 rounded-full blur-[100px] opacity-30 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <div className="flex justify-between items-end">
             <div>
                <span className="inline-block px-3 py-1 bg-brand-800 rounded-full text-brand-200 text-xs font-semibold tracking-wider uppercase mb-4 border border-brand-700">
                  Espace Interne
                </span>
                <h1 className="text-3xl font-display font-bold text-white tracking-tight">Espace Conseiller Régional</h1>
                <p className="text-brand-200 mt-2 font-light">Opco Atlas • Pilotage du Job Matching</p>
             </div>
             <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">Conseiller Actif</p>
                  <p className="text-xs text-brand-300">Île-de-France</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold backdrop-blur">
                  CR
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          <button 
            onClick={() => setActiveTab('events')} 
            className={`py-4 font-medium text-sm transition-all border-b-2 ${activeTab === 'events' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
             📅 Piloter les Job Dating
          </button>
          <button 
            onClick={() => setActiveTab('candidats')} 
            className={`py-4 font-medium text-sm transition-all border-b-2 ${activeTab === 'candidats' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
             👤 Vivier Candidats (Niv 1 & 2)
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* TAB EVENTS */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
            
            {/* Formulaire API de création */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-50 rounded-full blur-[40px] -z-10 -translate-y-1/2 translate-x-1/2"></div>
                <h2 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="text-accent-500">✨</span> Créer un Job Dating
                </h2>
                
                <form onSubmit={handleCreateEvent} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Titre de l'événement</label>
                    <input type="text" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} 
                           className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition" 
                           placeholder="Ex: Soirée Recrutement Développeurs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                    <textarea required value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} rows="3"
                           className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition" 
                           placeholder="Objectifs, thématique..."></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Date (Y-M-D H:i)</label>
                    <input type="datetime-local" required value={newEvent.event_date} onChange={e => setNewEvent({...newEvent, event_date: e.target.value})}
                           className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition" />
                  </div>
                  <button type="submit" disabled={isCreating} className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl font-semibold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 transition-all text-sm flex justify-center items-center gap-2">
                    {isCreating ? 'Enregistrement BD...' : 'Publier l\'événement'}
                  </button>
                </form>
              </div>
            </div>

            {/* Liste API des événements */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-end mb-6">
                 <h2 className="text-2xl font-display font-bold text-slate-900">Vos Événements Actifs</h2>
                 <span className="text-sm font-medium text-slate-500 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-200">
                    {events.length} au total
                 </span>
              </div>
              
              {isLoading ? (
                 <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                   <div className="text-brand-500 flex flex-col items-center">
                     <span className="animate-spin text-4xl mb-4">⚙️</span>
                     <p className="font-medium text-sm">Synchronisation API en cours...</p>
                   </div>
                 </div>
              ) : events.length === 0 ? (
                 <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
                    <div className="text-5xl mb-4">📭</div>
                    <h3 className="text-lg font-bold text-slate-700">Aucun événement trouvé</h3>
                    <p className="text-slate-500 text-sm mt-2">La base de données ne contient aucun Job Dating actif pour le moment. Utilisez le formulaire de gauche pour insérer votre première donnée réelle !</p>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((evt) => (
                    <div key={evt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition group relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-1 h-full bg-brand-500 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                       <div className="flex justify-between items-start mb-4">
                         <div className="p-2 bg-brand-50 text-brand-600 rounded-lg text-xl">
                            {evt.location_type === 'visio' ? '💻' : '🏢'}
                         </div>
                         <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">Publié</span>
                       </div>
                       <h3 className="font-bold text-slate-900 mb-1">{evt.title}</h3>
                       <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">{evt.description}</p>
                       <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-medium text-slate-600">
                         <span>📍 {evt.region}</span>
                         <span>📅 {new Date(evt.event_date).toLocaleDateString()}</span>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        )}

        {/* TAB CANDIDATS (Interopérabilité) */}
        {activeTab === 'candidats' && (
           <div className="animate-fade-in-up">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                 <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">Vivier d'Employabilité (Niv 1 & 2)</h2>
                      <p className="text-sm text-slate-500 mt-1">Candidats prêts au matching, synchronisés avec la base.</p>
                    </div>
                    <button className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
                       📥 Importer CSV
                    </button>
                 </div>
                 
                 <div className="p-12 text-center bg-slate-50 text-slate-600">
                    <p className="font-medium text-lg">💡 Module d'interopérabilité actif.</p>
                    <p className="text-sm mt-2 max-w-lg mx-auto">
                       En mode Standalone, importez vos candidats existants via le bouton CSV en haut à droite. En mode Connecté (production), ce tableau se remplira automatiquement via les Webhooks en provenance de la plateforme Mentorat de Numeric'Emploi.
                    </p>
                 </div>
              </div>
           </div>
        )}

      </main>
    </div>
  );
};

export default AdvisorDashboard;
