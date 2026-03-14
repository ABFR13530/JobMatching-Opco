import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdvisorDashboard = () => {
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(!localStorage.getItem('user_role'));
  const [activeTab, setActiveTab] = useState('events'); // events | candidates

  // États pour les données
  const [events, setEvents] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Formulaire Nouvel Événement
  const [newEvent, setNewEvent] = useState({ titre: '', date: '', region: 'Île-de-France', max_participants: 50 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/candidates/qualified');
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
      }
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!showPicker) {
      if (activeTab === 'events') fetchEvents();
      if (activeTab === 'candidates') fetchCandidates();
    }
  }, [showPicker, activeTab]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newEvent)
      });
      if (res.ok) {
        setNewEvent({ titre: '', date: '', region: 'Île-de-France', max_participants: 50 });
        fetchEvents();
        setActiveTab('events');
      } else {
        const err = await res.json();
        alert("Erreur Base de Données : " + (err.error || "Impossible de créer l'événement"));
      }
    } catch (e) {
      alert("Erreur Réseau");
    }
    setIsSubmitting(false);
  };

  const handleQuickLogin = (acc) => {
    localStorage.setItem('token', 'DEMO_JWT_2026');
    localStorage.setItem('user_role', acc.role);
    localStorage.setItem('user_name', acc.name);
    localStorage.setItem('user_region', acc.region);
    setShowPicker(false);
  };

  if (showPicker) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-black text-white mb-2 uppercase tracking-tighter italic">Numeric'Emploi <span className="text-blue-500">Fast-Login</span></h2>
            <p className="text-slate-400 text-sm font-medium">Choisissez un profil conseiller pour la démonstration</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => handleQuickLogin({role:'advisor', name:'Marc Durand', region:'Île-de-France'})} className="group bg-slate-900/50 border border-white/10 p-8 rounded-[2rem] text-left hover:border-blue-500/50 transition-all">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:rotate-6 transition-transform">👩‍💼</div>
                <h3 className="text-white font-bold text-lg">Marc Durand</h3>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Conseiller IDF</p>
            </button>
            <button onClick={() => navigate('/dashboard/superadmin')} className="group bg-slate-900/50 border border-white/10 p-8 rounded-[2rem] text-left hover:border-purple-500/50 transition-all">
                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:rotate-6 transition-transform">👑</div>
                <h3 className="text-white font-bold text-lg">Albane Bossan</h3>
                <p className="text-purple-400 text-xs font-bold uppercase tracking-widest">Super Admin</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-slate-900 border-b border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 py-6 relative z-10 flex justify-between items-center text-white">
          <div className="flex items-center gap-6">
            <Link to="/" className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-display font-bold text-slate-900 text-2xl shadow-lg hover:scale-105 transition">N</Link>
            <div>
              <span className="inline-block px-2 py-0.5 bg-slate-800 rounded text-blue-300 text-[10px] font-bold tracking-widest uppercase mb-1 border border-slate-700">Conseiller Régional</span>
              <h1 className="text-2xl font-display font-bold text-white tracking-tight leading-none">Espace {localStorage.getItem('user_name')}</h1>
            </div>
          </div>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all">Déconnexion</button>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          <button onClick={() => setActiveTab('events')} className={`py-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'events' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>🗓️ Gestion Événements</button>
          <button onClick={() => setActiveTab('candidates')} className={`py-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'candidates' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>👨‍🎓 Pool Candidats</button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10 animate-fade-in-up">
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Formulaire Création */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sticky top-24">
                <h2 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-3">➕ Créer un Job Dating</h2>
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Titre de l'événement</label>
                    <input type="text" required value={newEvent.titre} onChange={e => setNewEvent({...newEvent, titre: e.target.value})} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500" placeholder="Ex: Job Dating Dev Web IDF" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date</label>
                    <input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Région</label>
                    <select value={newEvent.region} onChange={e => setNewEvent({...newEvent, region: e.target.value})} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                      <option>Île-de-France</option><option>Nouvelle-Aquitaine</option><option>Auvergne-Rhône-Alpes</option><option>Bretagne</option>
                    </select>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:scale-105 transition-all active:scale-95 text-sm uppercase tracking-widest">{isSubmitting ? 'Création...' : 'Publier au Pool'}</button>
                </form>
              </div>
            </div>

            {/* Liste Événements */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-6 flex justify-between items-center">Sessions Actives <span>{events.length}</span></h2>
              {isLoading ? (
                <div className="py-20 text-center animate-pulse text-brand-500">Chargement...</div>
              ) : events.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">Aucun événement créé pour le moment.</div>
              ) : (
                <div className="space-y-4">
                  {events.map(evt => (
                    <div key={evt.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition flex items-center justify-between">
                       <div>
                         <h3 className="font-bold text-slate-900 text-lg">{evt.titre}</h3>
                         <div className="flex gap-4 text-xs font-medium text-slate-500 mt-1">
                           <span>📅 {new Date(evt.date).toLocaleDateString()}</span>
                           <span>📍 {evt.region}</span>
                           <span className="text-orange-500 font-bold uppercase">{evt.statut}</span>
                         </div>
                       </div>
                       <div className="flex gap-2">
                          <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition">Modifier</button>
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20">Inviter Candidats</button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="animate-fade-in-up">
             <div className="flex justify-between items-end mb-8">
               <div>
                 <h2 className="text-3xl font-display font-bold text-slate-900">Pool Candidats</h2>
                 <p className="text-slate-500 mt-1">Profils qualifiés (Niveau 1 & 2) disponibles pour le matching.</p>
               </div>
               <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition">⬇️ Exporter CSV</button>
             </div>
             <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <tr>
                        <th className="px-8 py-5">Candidat</th>
                        <th className="px-8 py-5">Région</th>
                        <th className="px-8 py-5">Niveau</th>
                        <th className="px-8 py-5">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {candidates.map(cand => (
                        <tr key={cand.id} className="hover:bg-slate-50 transition">
                           <td className="px-8 py-5">
                              <p className="font-bold text-slate-900">{cand.prenom} {cand.nom}</p>
                              <p className="text-xs text-slate-500 lowercase">{cand.email}</p>
                           </td>
                           <td className="px-8 py-5 text-sm font-medium text-slate-600">{cand.region}</td>
                           <td className="px-8 py-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${cand.niveau_employabilite === 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>Niveau {cand.niveau_employabilite}</span>
                           </td>
                           <td className="px-8 py-5">
                              <button className="text-xs font-bold text-brand-600 hover:underline">Voir Profil</button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdvisorDashboard;
