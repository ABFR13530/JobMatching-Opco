import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdvisorDashboard = () => {
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(!localStorage.getItem('user_role'));
  const [activeTab, setActiveTab] = useState('events'); // events | candidates | companies
  const [showCandidateForm, setShowCandidateForm] = useState(false);

  const [events, setEvents] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);

  const userRegion = localStorage.getItem('user_region') || 'Île-de-France';

  const handleExportCSV = () => {
    if (candidates.length === 0) return alert("Aucun candidat à exporter.");
    const headers = "Nom,Prenom,Email,Region,Employabilit\u00E9\n";
    const csvContent = candidates.map(c => `${c.nom},${c.prenom},${c.email},${c.region},Niveau ${c.niveau_employabilite}`).join("\n");
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `export_candidats_atlas_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [newEvent, setNewEvent] = useState({ 
    titre: '', 
    date: '', 
    date_fin: '',
    heure_debut: '09:00',
    heure_fin: '18:00',
    pause_debut: '12:30',
    pause_fin: '13:30',
    region: userRegion, 
    max_participants: 100, 
    event_format: 'virtuel', 
    interview_duration: 20, 
    description: '' 
  });

  const [newCandidate, setNewCandidate] = useState({
    nom: '', prenom: '', email: '', region: 'Île-de-France',
    niveau_employabilite: 1
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

  const fetchEventDashboard = async (eventId) => {
     setIsLoading(true);
     try {
        const res = await fetch(`/api/events/${eventId}/dashboard`);
        if (res.ok) {
           const data = await res.json();
           setSelectedEventDetails(data);
        }
     } catch (e) {
        alert("Erreur lors de la récupération des détails du pilotage.");
     }
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
      const res = await fetch('/api/companies/all');
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
        body: JSON.stringify({
           ...newEvent,
           counselor_region: userRegion
        })
      });
      if (res.ok) {
        alert("✅ Événement créé et ajouté au calendrier global !");
        setNewEvent({ 
           titre: '', date: '', date_fin: '', 
           heure_debut: '09:00', heure_fin: '18:00',
           pause_debut: '12:30', pause_fin: '13:30',
           region: userRegion, max_participants: 100, 
           event_format: 'virtuel', interview_duration: 20, description: '' 
        });
        fetchEvents();
      } else {
        const error = await res.json();
        alert(`❌ Erreur : ${error.error || "Impossible de créer l'événement"}`);
      }
    } catch (e) { 
        alert("❌ Erreur réseau : Vérifiez votre connexion."); 
    }
    setIsSubmitting(false);
  };

  const handleToggleStatus = async (eventId, currentStatus) => {
    const newStatus = currentStatus === 'publie' ? 'brouillon' : 'publie';
    try {
      const res = await fetch(`/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatus })
      });
      if (res.ok) {
        fetchEvents();
      }
    } catch (e) {
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCandidate)
      });
      if (res.ok) {
        alert("✅ Candidat enregistré avec succès dans la CVthèque !");
        setNewCandidate({ nom: '', prenom: '', email: '', region: 'Île-de-France', niveau_employabilite: 1 });
        fetchCandidates();
        setShowCandidateForm(false);
      } else {
          const error = await res.json();
          alert(`❌ Erreur : ${error.error}`);
      }
    } catch (e) { alert("Erreur réseau"); }
    setIsSubmitting(false);
  };

  const handleValidateCompany = async (id) => {
    try {
      const res = await fetch(`/api/companies/${id}/validate`, { method: 'PATCH' });
      if (res.ok) {
        alert("✅ Entreprise validée pour le forum.");
        fetchCompanies();
      }
    } catch (e) { console.error(e); }
  };

  if (showPicker) {
     const regions = ["Île-de-France", "Auvergne-Rhône-Alpes", "Provence-Alpes-Côte d'Azur", "Hauts-de-France", "Nouvelle-Aquitaine", "Occitanie", "Grand Est", "Bretagne", "Pays de la Loire", "Normandie", "Bourgogne-Franche-Comté", "Centre-Val de Loire", "Corse"];
     return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-slate-900">
           <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl animate-fadeIn">
              <div className="text-6xl mb-8">🛡️</div>
              <h2 className="text-3xl font-display font-black text-slate-900 mb-4 italic">Pilotage Atlas</h2>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">Choisissez votre région de rattachement pour accéder au pilotage.</p>
              
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">Ma Région</label>
                    <select id="login-region" className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium">
                       {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                 </div>
                 <button onClick={() => { 
                    const reg = document.getElementById('login-region').value;
                    localStorage.setItem('user_role', 'advisor'); 
                    localStorage.setItem('user_name', 'Conseiller Atlas'); 
                    localStorage.setItem('user_region', reg);
                    setShowPicker(false); 
                 }} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:scale-105 transition-all text-[10px] uppercase tracking-widest">Se Connecter au Dashboard</button>
                 <Link to="/" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Retour à l'accueil</Link>
              </div>
           </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 text-slate-900">
      <header className="bg-[#0f172a] text-white relative overflow-hidden shadow-2xl border-b border-white/5">
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[120px] opacity-10 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10 flex justify-between items-center text-white">
          <div className="flex items-center gap-6">
            <Link to="/" className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-display font-black text-slate-900 text-3xl shadow-xl hover:scale-110 transition-transform hover:text-blue-600">N</Link>
            <div>
              <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black tracking-widest uppercase mb-1">Moniteur de Forum • {userRegion}</span>
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
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Début</label>
                        <input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Fin (Optionnel)</label>
                        <input type="date" value={newEvent.date_fin} onChange={e => setNewEvent({...newEvent, date_fin: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium" />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Heure Début</label>
                        <input type="time" required value={newEvent.heure_debut} onChange={e => setNewEvent({...newEvent, heure_debut: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Heure Fin</label>
                        <input type="time" required value={newEvent.heure_fin} onChange={e => setNewEvent({...newEvent, heure_fin: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium" />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                     <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Début Pause</label>
                        <input type="time" value={newEvent.pause_debut} onChange={e => setNewEvent({...newEvent, pause_debut: e.target.value})} className="w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-xs font-medium" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Fin Pause</label>
                        <input type="time" value={newEvent.pause_fin} onChange={e => setNewEvent({...newEvent, pause_fin: e.target.value})} className="w-full rounded-xl border-slate-200 bg-white px-4 py-3 text-xs font-medium" />
                     </div>
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Région du forum</label>
                     <select value={newEvent.region} onChange={e => setNewEvent({...newEvent, region: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium">
                        <option>Île-de-France</option>
                        <option>Auvergne-Rhône-Alpes</option>
                        <option>Provence-Alpes-Côte d'Azur</option>
                        <option>Hauts-de-France</option>
                        <option>Nouvelle-Aquitaine</option>
                        <option>Occitanie</option>
                        <option>Grand Est</option>
                        <option>Bretagne</option>
                        <option>Pays de la Loire</option>
                        <option>Normandie</option>
                        <option>Bourgogne-Franche-Comté</option>
                        <option>Centre-Val de Loire</option>
                        <option>Corse</option>
                     </select>
                     {newEvent.event_format !== 'virtuel' && newEvent.region !== userRegion && (
                        <p className="mt-2 text-[10px] font-bold text-red-500 italic">⚠️ Vos droits régionaux ne permettent pas de créer en dehors de {userRegion}.</p>
                     )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Format</label>
                        <select value={newEvent.event_format} onChange={e => setNewEvent({...newEvent, event_format: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium">
                           <option value="virtuel">100% Virtuel (National)</option>
                           <option value="hybride">Hybride (Régional)</option>
                           <option value="presentiel">Présentiel (Régional)</option>
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
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">Catalogue Événements</h2>
                  <div className="px-6 py-2 bg-slate-900 text-white rounded-full text-xl font-black">{events.length}</div>
               </div>
               
               {isLoading && !selectedEventDetails ? (
                  <div className="py-20 text-center animate-pulse text-blue-500 font-black tracking-widest italic">SYNCHRONISATION...</div>
               ) : events.length === 0 ? (
                  <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
                     <div className="text-6xl mb-6 opacity-20">📭</div>
                     <p className="text-slate-400 font-bold italic">Aucun forum n'est programmé pour le moment.</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {events.map(evt => (
                        <div key={evt.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-blue-500 transition-all group relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[3rem] group-hover:bg-blue-50 transition-colors"></div>
                           <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">{evt.titre}</h3>
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 italic text-left">📍 {evt.region} • {new Date(evt.date).toLocaleDateString()}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase mb-6 tracking-widest text-left">🕒 {evt.heure_debut} - {evt.heure_fin}</p>
                           <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
                              <div className="flex gap-2">
                                 <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-lg">{evt.event_format}</span>
                                 <button 
                                    onClick={() => handleToggleStatus(evt.id, evt.statut)}
                                    className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg border transition-all ${
                                       evt.statut === 'publie' 
                                       ? 'bg-green-50 text-green-600 border-green-200' 
                                       : 'bg-orange-50 text-orange-600 border-orange-200'
                                    }`}
                                 >
                                    {evt.statut === 'publie' ? 'Visible' : 'Brouillon'}
                                 </button>
                              </div>
                              <div className="flex gap-4">
                                 <button onClick={() => fetchEventDashboard(evt.id)} className="text-[10px] font-black text-slate-900 uppercase tracking-widest hover:underline">Détails Pilote →</button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
          </div>
        )}

        {/* MODAL DETAIL PILOTE (DASHBOARD ÉVÉNEMENT) */}
        {selectedEventDetails && (
           <div className="fixed inset-0 bg-[#0f172a]/95 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-fadeIn text-slate-900">
              <div className="bg-white rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-0 overflow-hidden text-left">
                 <button onClick={() => setSelectedEventDetails(null)} className="absolute top-8 right-8 text-white bg-slate-900 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black z-20">×</button>
                 
                 <div className="bg-blue-600 p-4 text-center text-white text-[10px] font-black uppercase tracking-widest italic">
                    Pilotage Opérationnel : {selectedEventDetails.event.titre}
                 </div>

                 <div className="p-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                       <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Recruteurs Inscrits</p>
                          <p className="text-4xl font-black text-slate-900 tracking-tighter">{selectedEventDetails.recruiters.length}</p>
                       </div>
                       <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Total Créneaux</p>
                          <p className="text-4xl font-black text-slate-900 tracking-tighter">
                             {selectedEventDetails.recruiters.reduce((acc, r) => acc + parseInt(r.total_slots), 0)}
                          </p>
                       </div>
                       <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">RDV Confirmés</p>
                          <p className="text-4xl font-black text-blue-600 tracking-tighter">
                             {selectedEventDetails.bookings.length}
                          </p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                       {/* Section Recruteurs */}
                       <div>
                          <h3 className="text-xl font-black mb-6 italic underline decoration-blue-500 decoration-4">Entreprises Exposantes</h3>
                          <div className="space-y-4">
                             {selectedEventDetails.recruiters.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">Aucune entreprise n'a encore généré d'agenda.</p>
                             ) : (
                                selectedEventDetails.recruiters.map(r => (
                                   <div key={r.id} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                      <div>
                                         <p className="font-bold text-slate-900">{r.name}</p>
                                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{r.industry}</p>
                                      </div>
                                      <div className="text-right">
                                         <p className="text-[10px] font-black text-blue-600">{r.booked_slots} / {r.total_slots} RDV</p>
                                         <div className="w-24 bg-slate-200 h-1.5 rounded-full mt-1">
                                            <div className="bg-blue-600 h-full rounded-full" style={{width: `${(r.booked_slots/r.total_slots)*100}%`}}></div>
                                         </div>
                                      </div>
                                   </div>
                                ))
                             )}
                          </div>
                       </div>

                       {/* Section Bookings (Dernières résas) */}
                       <div>
                          <h3 className="text-xl font-black mb-6 italic underline decoration-orange-500 decoration-4">Planning des Matchs</h3>
                          <div className="space-y-4">
                             {selectedEventDetails.bookings.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">En attente des premières réservations candidats.</p>
                             ) : (
                                selectedEventDetails.bookings.map(b => (
                                   <div key={b.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start gap-4">
                                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 uppercase">
                                         {new Date(b.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </div>
                                      <div>
                                         <p className="text-xs font-black text-slate-900">{b.candidate_nom} {b.candidate_prenom} ⚡ {b.company_name}</p>
                                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lien de salle : <span className="text-blue-500 hover:underline">Meet Jitsi</span></p>
                                      </div>
                                   </div>
                                ))
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* TAB COMPANIES */}
        {activeTab === 'companies' && (
           <div className="space-y-8">
              <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                 <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-2xl font-display font-black text-slate-900 italic">Pool des Entreprises</h2>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{companies.length} Partenaires</span>
                 </div>
                 <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {companies.map(comp => (
                          <div key={comp.id} className="border border-slate-100 rounded-[2rem] p-8 bg-slate-50/30 hover:bg-white hover:shadow-xl transition-all">
                             <div className="w-16 h-16 bg-white rounded-2xl shadow-sm mb-6 flex items-center justify-center text-2xl font-black text-slate-900">{comp.name.substring(0,1)}</div>
                             <h3 className="font-bold text-slate-900 text-lg mb-1">{comp.name}</h3>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{comp.industry}</p>
                             {comp.is_validated ? (
                                <span className="block text-center py-3 bg-green-50 text-green-600 rounded-xl text-[9px] font-black uppercase border border-green-100">Validée pour Forum</span>
                             ) : (
                                <button onClick={() => handleValidateCompany(comp.id)} className="w-full py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">Valider l'adhésion</button>
                             )}
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* TAB CANDIDATES (La CVthèque Alumn) */}
        {activeTab === 'candidates' && (
           <div className="space-y-8">
              <div className="flex justify-between items-center">
                 <h2 className="text-4xl font-display font-black text-slate-900 tracking-tighter italic">CVthèque Qualifiée</h2>
                 <div className="flex gap-4">
                    <button onClick={handleExportCSV} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all">Exporter la Qualif CSV</button>
                    <button onClick={() => setShowCandidateForm(true)} className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">+ Nouveau Talent</button>
                 </div>
              </div>

              {showCandidateForm && (
                 <div className="bg-white rounded-[3rem] p-10 border-2 border-blue-100 shadow-2xl animate-fadeIn">
                    <h3 className="text-xl font-bold mb-8 italic text-slate-900">📄 Fiche d'inscription Candidat</h3>
                    <form onSubmit={handleCreateCandidate} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-900">
                       <input type="text" placeholder="Nom" required className="w-full rounded-2xl border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium" value={newCandidate.nom} onChange={e => setNewCandidate({...newCandidate, nom: e.target.value})} />
                       <input type="text" placeholder="Prénom" required className="w-full rounded-2xl border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium" value={newCandidate.prenom} onChange={e => setNewCandidate({...newCandidate, prenom: e.target.value})} />
                       <input type="email" placeholder="Email" required className="w-full rounded-2xl border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium" value={newCandidate.email} onChange={e => setNewCandidate({...newCandidate, email: e.target.value})} />
                       <select className="w-full rounded-2xl border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium" value={newCandidate.niveau_employabilite} onChange={e => setNewCandidate({...newCandidate, niveau_employabilite: e.target.value})}>
                          <option value="1">Niveau 1 - Débutant</option>
                          <option value="2">Niveau 2 - Confirmé</option>
                          <option value="3">Niveau 3 - Senior / Prêt à l'emploi</option>
                       </select>
                       <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                          <button type="button" onClick={() => setShowCandidateForm(false)} className="px-8 py-4 font-bold text-slate-400 text-xs">Annuler</button>
                          <button type="submit" disabled={isSubmitting} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 uppercase text-[10px] tracking-widest">{isSubmitting ? 'Enregistrement...' : 'Enregistrer le Profil'}</button>
                       </div>
                    </form>
                 </div>
              )}

              <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Candidat</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Région</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Employabilité</th>
                          <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Action</th>
                       </tr>
                    </thead>
                    <tbody>
                       {candidates.length === 0 ? (
                          <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 italic font-bold">La CVthèque est vide pour le moment.</td></tr>
                       ) : (
                          candidates.map(c => (
                             <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                <td className="px-8 py-6 font-bold text-slate-900">{c.nom} {c.prenom}</td>
                                <td className="px-8 py-6 text-sm text-slate-500 ">{c.email}</td>
                                <td className="px-8 py-6 text-sm font-bold text-slate-900">{c.region}</td>
                                <td className="px-8 py-6">
                                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm border ${c.niveau_employabilite === 3 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                      Niveau {c.niveau_employabilite}
                                   </span>
                                </td>
                                <td className="px-8 py-6">
                                   <button className="text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:underline">Fiche Alumn →</button>
                                </td>
                             </tr>
                          ))
                       )}
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
