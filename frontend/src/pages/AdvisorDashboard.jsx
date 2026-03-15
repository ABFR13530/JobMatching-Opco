import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdvisorDashboard = () => {
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(!localStorage.getItem('user_role'));
  const [activeTab, setActiveTab] = useState('events'); // events | candidates | companies

  const [events, setEvents] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Formulaire Nouvel Événement (Enrichi)
  const [newEvent, setNewEvent] = useState({ 
    titre: '', date: '', region: 'Île-de-France', 
    max_participants: 100, event_format: 'virtuel', 
    interview_duration: 20, description: '' 
  });
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

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/companies');
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies || []);
      }
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!showPicker) {
      if (activeTab === 'events') fetchEvents();
      if (activeTab === 'candidates') fetchCandidates();
      if (activeTab === 'companies') fetchCompanies();
    }
  }, [showPicker, activeTab]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      if (res.ok) {
        alert("✅ Événement créé et ajouté au calendrier global !");
        setNewEvent({ titre: '', date: '', region: 'Île-de-France', max_participants: 100, event_format: 'virtuel', interview_duration: 20, description: '' });
        fetchEvents();
      }
    } catch (e) { alert("Erreur réseau"); }
    setIsSubmitting(false);
  };

  const handleQuickLogin = (acc) => {
    localStorage.setItem('token', 'DEMO_JWT_2026');
    localStorage.setItem('user_role', acc.role);
    localStorage.setItem('user_name', acc.name);
    setShowPicker(false);
  };

  if (showPicker) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-display font-black text-white mb-2 uppercase tracking-tighter italic italic">Numeric'Emploi <span className="text-blue-500">Fast-Login</span></h2>
            <p className="text-slate-400 text-sm font-medium">Portail de gestion régionale (MVP Jalon 1)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button onClick={() => handleQuickLogin({role:'advisor', name:'Marc Durand'})} className="group bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] text-left hover:border-blue-500/50 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-xl group-hover:rotate-6 transition-transform italic">👩‍💼</div>
                <h3 className="text-white font-black text-xl mb-1">Marc Durand</h3>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest italic">Conseiller IDF</p>
            </button>
            <button onClick={() => navigate('/dashboard/superadmin')} className="group bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] text-left hover:border-purple-500/50 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-purple-600 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-xl group-hover:rotate-6 transition-transform italic">👑</div>
                <h3 className="text-white font-black text-xl mb-1">Albane Bossan</h3>
                <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest italic">Responsable Plateforme</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="bg-[#0f172a] text-white relative overflow-hidden shadow-2xl border-b border-white/5">
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[120px] opacity-10 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 flex justify-between items-center text-white">
          <div className="flex items-center gap-6">
            <Link to="/" className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-display font-black text-slate-900 text-3xl shadow-xl hover:scale-110 transition-transform">N</Link>
            <div>
              <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black tracking-widest uppercase mb-1">Moniteur de Forum</span>
              <h1 className="text-3xl font-display font-black tracking-tighter leading-none italic">Direction {localStorage.getItem('user_name')}</h1>
            </div>
          </div>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Quitter le pilotage</button>
        </div>
      </header>

      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex gap-12">
          <button onClick={() => setActiveTab('events')} className={`py-6 font-bold text-sm transition-all border-b-4 ${activeTab === 'events' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>🗓️ Événements & Foras</button>
          <button onClick={() => setActiveTab('companies')} className={`py-6 font-bold text-sm transition-all border-b-4 ${activeTab === 'companies' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>🏢 Pool Entreprises</button>
          <button onClick={() => setActiveTab('candidates')} className={`py-6 font-bold text-sm transition-all border-b-4 ${activeTab === 'candidates' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>👨‍🎓 CVthèque Qualifiée</button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 animate-fade-in-up">
        
        {/* TAB EVENTS */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 sticky top-32">
                <h2 className="text-2xl font-display font-black text-slate-900 mb-8 flex items-center gap-3 italic">➕ Nouveau Forum</h2>
                <form onSubmit={handleCreateEvent} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nom de l'édition</label>
                    <input type="text" required value={newEvent.titre} onChange={e => setNewEvent({...newEvent, titre: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10" placeholder="Ex: Forum Jobs Numériques 2026" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Format</label>
                        <select value={newEvent.event_format} onChange={e => setNewEvent({...newEvent, event_format: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium">
                           <option value="virtuel">100% Virtuel</option>
                           <option value="hybride">Hybride</option>
                           <option value="presentiel">Présentiel</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Durée RDV</label>
                        <select value={newEvent.interview_duration} onChange={e => setNewEvent({...newEvent, interview_duration: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium">
                           <option value="15">15 min</option>
                           <option value="20">20 min</option>
                           <option value="30">30 min</option>
                        </select>
                     </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:scale-105 transition-all text-[10px] uppercase tracking-widest">{isSubmitting ? 'Publication...' : 'Ouvrir les inscriptions'}</button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-3xl font-display font-black text-slate-900 mb-8 italic flex justify-between items-center">Catalogue Événements <span>{events.length}</span></h2>
              <div className="space-y-6">
                {events.map(evt => (
                  <div key={evt.id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition-all border-t-8 border-t-blue-600">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                         <h3 className="font-black text-slate-900 text-xl mb-1 italic group-hover:text-blue-600">{evt.titre}</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">📍 {evt.region} • 📅 {new Date(evt.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${evt.statut === 'publie' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                           {evt.statut}
                        </span>
                     </div>
                     <div className="flex gap-4">
                        <div className="flex-1 bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                           <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Format</p>
                           <p className="font-black text-slate-900 text-xs">{evt.event_format.toUpperCase()}</p>
                        </div>
                        <div className="flex-1 bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                           <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Durée RDV</p>
                           <p className="font-black text-slate-900 text-xs">{evt.interview_duration} MIN</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-50">
                        <button className="py-3.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition">Paramètres</button>
                        <button className="py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-600 transition">Dashboard Live</button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* POOL ENTREPRISES (VALUATION STANDS) */}
        {activeTab === 'companies' && (
          <div className="animate-fade-in-up">
             <div className="flex justify-between items-end mb-10">
                <h2 className="text-4xl font-display font-black text-slate-900 italic">Pool Entreprises Inscrits</h2>
                <div className="px-5 py-2 bg-blue-100 text-blue-700 rounded-full font-black text-xs">{companies.length} Structures actives</div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {companies.map(comp => (
                  <div key={comp.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition relative group">
                     {comp.is_validated && <div className="absolute top-6 right-6 text-green-500 font-black text-xs italic">✓ Validé</div>}
                     <div className="w-16 h-16 bg-[#0f172a] text-white rounded-2xl flex items-center justify-center text-xl font-black mb-6 shadow-xl">
                        {comp.name.substring(0,2).toUpperCase()}
                     </div>
                     <h3 className="text-xl font-black text-slate-900 mb-1 leading-none">{comp.name}</h3>
                     <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-6">{comp.industry}</p>
                     <p className="text-xs text-slate-500 line-clamp-3 mb-8 italic">"{comp.description}"</p>
                     {!comp.is_validated && (
                        <button className="w-full py-4 bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:scale-105 transition">Valider le Stand</button>
                     )}
                     <button className="w-full mt-3 py-4 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition">Consulter Dossier</button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* POOL CANDIDATS */}
        {activeTab === 'candidates' && (
          <div className="animate-fade-in-up">
             <div className="flex justify-between items-end mb-10">
                <h2 className="text-4xl font-display font-black text-slate-900 italic">CVthèque Forum</h2>
                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 transition">Exporter la Qualif CSV</button>
             </div>
             <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-[#0f172a] text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      <tr>
                        <th className="px-10 py-6">Candidat Principal</th>
                        <th className="px-10 py-6">Région Forum</th>
                        <th className="px-10 py-6">Qualif.</th>
                        <th className="px-10 py-6">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {candidates.map(cand => (
                        <tr key={cand.id} className="hover:bg-slate-50/50 transition group">
                           <td className="px-10 py-6">
                              <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic">{cand.prenom} {cand.nom}</p>
                              <p className="text-[10px] text-slate-400 font-bold lowercase">{cand.email}</p>
                           </td>
                           <td className="px-10 py-6 text-xs font-bold text-slate-600">{cand.region}</td>
                           <td className="px-10 py-6">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${cand.niveau_employabilite === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>Niveau {cand.niveau_employabilite}</span>
                           </td>
                           <td className="px-10 py-6">
                              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Analyser Profil →</button>
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
