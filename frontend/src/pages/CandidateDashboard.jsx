import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('matching'); // matching | profile | companies
  const [events, setEvents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null); // Pour la modal Stand
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // État du profil candidat enrichi
  const [profile, setProfile] = useState({
    cvFile: null,
    linkedin: '',
    bio: "Développeur Full-Stack React passionné par les architectures Cloud et l'expérience utilisateur.",
    experience: '2-4',
    timeline: [
      { id: 1, title: 'Développeur Web Junior', company: 'Tech Solutions', date: '2022 - 2024' },
      { id: 2, title: 'Formation Titre RNCP V', company: 'Digital School', date: '2021 - 2022' }
    ]
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
    fetchNotifications();
  }, [activeTab]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?role=candidate&userId=1');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {}
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'matching') {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } else if (activeTab === 'companies') {
        const res = await fetch('/api/companies');
        if (res.ok) {
          const data = await res.json();
          setCompanies(data.companies || []);
        }
      }
    } catch { /* Ignorer pour la démo */ }
    setIsLoading(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      alert("✅ Profil mis à jour sur la plateforme !");
      setIsSaving(false);
    }, 1500);
  };

  const fetchSlots = async (eventId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/slots`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || []);
        setSelectedEvent(eventId);
      }
    } catch { alert("Erreur lors de la récupération des créneaux."); }
    setIsLoading(false);
  };

  const handleBookSlot = async (slotId) => {
    try {
      const res = await fetch('/api/events/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot_id: slotId, candidate_id: 1 }) // ID 1 pour la démo
      });
      if (res.ok) {
        const data = await res.json();
        alert(`✅ RDV Confirmé ! Votre lien Jitsi est disponible.`);
        setSelectedEvent(null);
        fetchData(); // Rafraîchir
      } else {
        const err = await res.json();
        alert(`Erreur : ${err.error}`);
      }
    } catch { alert("Erreur réseau"); }
  };

  const handleApplyToOffer = async (offerId) => {
    try {
      const res = await fetch(`/api/offers/${offerId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: 1, cover_letter: "Candidature spontanée via module Job Matching" })
      });
      if (res.ok) {
        alert("✅ Candidature envoyée avec succès au recruteur !");
      }
    } catch { alert("Erreur réseau"); }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("⚠️ ATTENTION : Cette action est irréversible. Toutes vos données seront effacées conformément au RGPD. Souhaitez-vous vraiment supprimer votre compte ?")) {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 1, role: 'candidate' }) // Simulé pour la démo
        });
        if (res.ok) {
          alert("✅ Compte supprimé avec succès. Au revoir !");
          localStorage.clear();
          window.location.href = '/';
        }
      } catch (e) { alert("Erreur réseau"); }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Header Premium (Identité Visuelle Dark Mode) */}
      <header className="bg-[#0f172a] text-white relative overflow-hidden shadow-2xl border-b border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center font-display font-black text-slate-900 text-3xl">C</div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold tracking-widest uppercase">Espace Candidat</span>
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic tracking-tighter">Membre #8420</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tighter leading-none">
                Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 italic">Jean Dupont</span>
              </h1>
            </div>
          </div>
          
           <div className="flex items-center gap-6">
              <div className="relative">
                 <button onClick={() => setShowNotifs(!showNotifs)} className="relative w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all">
                    <span className="text-xl">🔔</span>
                    {notifications.filter(n => !n.is_read).length > 0 && (
                       <span className="absolute -top-1 -right-1 w-5 h-5 bg-numeric-orange text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0f172a]">
                          {notifications.filter(n => !n.is_read).length}
                       </span>
                    )}
                 </button>
                 
                 {showNotifs && (
                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fadeIn">
                       <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Notifications</span>
                          <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
                       </div>
                       <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                             <p className="p-8 text-center text-xs text-slate-400 italic">Aucune notification pour le moment.</p>
                          ) : (
                             notifications.map(n => (
                                <div key={n.id} className={`p-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition cursor-pointer ${!n.is_read ? 'bg-blue-50/30' : ''}`}>
                                   <p className="text-xs font-black text-slate-900 mb-1">{n.title}</p>
                                   <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{n.message}</p>
                                   <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase">{new Date(n.created_at).toLocaleDateString()}</p>
                                </div>
                             ))
                          )}
                       </div>
                    </div>
                 )}
              </div>
              <div className="text-right hidden sm:block">
                <p className="font-bold text-sm">Disponibilité : <span className="text-green-400">Immédiate</span></p>
                <Link to="/" className="text-xs text-slate-500 font-bold hover:text-white transition uppercase tracking-widest mt-2 block">Déconnexion</Link>
             </div>
             <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center gap-5 backdrop-blur-xl">
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg">95</div>
                <div>
                   <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Score Matching</p>
                   <p className="text-xs font-bold text-blue-300">Profil Très Qualifié</p>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Tabs Menu */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex gap-10">
          <button onClick={() => setActiveTab('matching')} className={`py-5 font-black text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'matching' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
             🪄 Mes Matchs IA
          </button>
          <button onClick={() => setActiveTab('companies')} className={`py-5 font-black text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'companies' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
             🏢 Explorer les Stands
          </button>
          <button onClick={() => setActiveTab('profile')} className={`py-5 font-black text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'profile' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
             ⚙️ Mon Profil
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-2 space-y-10 animate-fade-in-up">
           
           {/* TAB MATCHING */}
           {activeTab === 'matching' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100">
                   <h2 className="text-3xl font-display font-black text-slate-900 flex items-center gap-4 mb-2">
                      <span className="text-4xl">🪄</span> Opportunités de la semaine
                   </h2>
                   <p className="text-slate-500 font-medium mb-10">L'IA a sélectionné ces sessions basées sur vos compétences en React et Node.js.</p>
                   
                   {isLoading ? (
                      <div className="py-20 text-center animate-pulse text-blue-500">Analyses en cours...</div>
                   ) : events.length === 0 ? (
                      <div className="py-16 text-center italic text-slate-400">Aucun match immédiat. Complétez votre profil pour plus de résultats.</div>
                   ) : (
                      <div className="space-y-6">
                        {events.map((evt) => (
                           <div key={evt.id} className="border border-slate-100 rounded-[2rem] p-8 bg-slate-50/50 hover:bg-white hover:shadow-2xl transition-all group border-l-8 border-l-blue-600">
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                 <div>
                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{evt.titre}</h3>
                                    <div className="flex gap-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                       <span>📅 {new Date(evt.date).toLocaleDateString()}</span>
                                       <span>📍 {evt.region}</span>
                                       <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Match 95%</span>
                                    </div>
                                 </div>
                                 <button onClick={() => fetchSlots(evt.id)} className="px-8 py-3 bg-slate-900 text-white text-xs font-black rounded-xl shadow-xl hover:bg-numeric-blue transition-all uppercase tracking-widest">
                                    Réserver mon Entretien
                                 </button>
                              </div>
                           </div>
                        ))}
                      </div>
                   )}
                </div>

                {/* MODAL SELECTION CRENEAUX */}
                {selectedEvent && (
                  <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
                     <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-2xl relative">
                        <button onClick={() => setSelectedEvent(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 text-2xl font-black">×</button>
                        <h2 className="text-3xl font-display font-black text-slate-900 mb-2 italic">Choisissez votre créneau</h2>
                        <p className="text-slate-500 mb-10 font-medium">Disponibilités en temps réel pour cet événement.</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                           {slots.length === 0 ? (
                              <p className="col-span-full py-10 text-center italic text-slate-400">Aucun créneau disponible pour le moment.</p>
                           ) : (
                              slots.map(s => (
                                 <button key={s.id} onClick={() => handleBookSlot(s.id)} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-numeric-blue hover:text-white transition group text-left">
                                    <p className="text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-100 mb-1">{s.company_name}</p>
                                    <p className="font-bold text-sm">{new Date(s.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                 </button>
                              ))
                           )}
                        </div>
                     </div>
                  </div>
                )}
              </div>
           )}

           {/* TAB COMPANIES (EXPLORATEUR DE STANDS) */}
           {activeTab === 'companies' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
                 {isLoading ? (
                    <div className="col-span-full py-20 text-center">Recherche des exposants...</div>
                 ) : companies.length === 0 ? (
                    <div className="col-span-full py-16 text-center italic text-slate-400">Aucun exposant n'a encore ouvert son stand.</div>
                 ) : (
                    companies.map(comp => (
                       <div key={comp.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition group relative overflow-hidden">
                          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform"></div>
                          <div className="relative z-10">
                             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-xl font-black text-slate-900 mb-6 shadow-sm border border-slate-100">
                                {comp.name.substring(0,2).toUpperCase()}
                             </div>
                             <h3 className="text-xl font-black text-slate-900 mb-2">{comp.name}</h3>
                             <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-4">{comp.industry}</p>
                             <p className="text-xs text-slate-500 line-clamp-3 mb-6 leading-relaxed italic">"{comp.description}"</p>
                             <div className="flex gap-3 pt-6 border-t border-slate-50">
                                <button onClick={() => setSelectedCompany(comp)} className="flex-1 py-3 bg-slate-100 text-slate-900 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-slate-200 transition">Voir le Stand</button>
                                <button onClick={() => handleApplyToOffer(comp.id)} className="flex-1 py-3 bg-blue-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition">Candidater</button>
                             </div>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           )}

            {/* MODAL STAND VIRTUEL */}
            {selectedCompany && (
               <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
                  <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-0 overflow-hidden text-slate-900 text-left">
                     <button onClick={() => setSelectedCompany(null)} className="absolute top-8 right-8 text-white bg-slate-900 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black z-20">×</button>
                     
                     {/* Header Stand */}
                     <div className="h-64 bg-gradient-to-br from-blue-600 to-indigo-900 relative">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute bottom-[-40px] left-12 w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-4xl font-black border-8 border-white">
                           {selectedCompany.name.substring(0,2).toUpperCase()}
                        </div>
                     </div>

                     <div className="p-12 pt-16">
                        <div className="flex justify-between items-start mb-10">
                           <div>
                              <h2 className="text-4xl font-display font-black mb-2 italic">{selectedCompany.name}</h2>
                              <p className="text-blue-600 font-bold uppercase tracking-widest text-xs italic">{selectedCompany.industry} • {selectedCompany.size || 'Grande Entreprise'}</p>
                           </div>
                           <button onClick={() => { handleApplyToOffer(selectedCompany.id); setSelectedCompany(null); }} className="px-10 py-4 bg-numeric-blue text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:scale-105 transition-all text-sm uppercase tracking-widest">
                              Candidature Directe
                           </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                           <div className="lg:col-span-2 space-y-8">
                              <div>
                                 <h3 className="text-lg font-black mb-4 italic">À propos de nous</h3>
                                 <p className="text-slate-600 leading-loose italic">"{selectedCompany.description || "Aucune description fournie par l'exposant."}"</p>
                              </div>
                              {selectedCompany.video_url && (
                                 <div className="rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video flex items-center justify-center text-white italic">
                                    [ Vidéo Corporate : {selectedCompany.video_url} ]
                                 </div>
                              )}
                           </div>
                           <div className="lg:col-span-1 space-y-6">
                              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                 <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Liens Utiles</h4>
                                 <div className="space-y-3">
                                    <a href={selectedCompany.website_url} target="_blank" className="block text-xs font-bold text-blue-600 hover:underline">🌐 Site Web Officiel</a>
                                    <a href={selectedCompany.linkedin_url} target="_blank" className="block text-xs font-bold text-blue-600 hover:underline">💼 Page LinkedIn</a>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

           {/* TAB PROFIL ENRICHI */}
           {activeTab === 'profile' && (
              <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 space-y-12">
                 <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-display font-black text-slate-900">Mon Profil Alumn</h2>
                    <span className="px-4 py-1.5 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full border border-green-200 tracking-widest">En Ligne</span>
                 </div>

                 <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div className="bg-slate-50 rounded-[2rem] p-8 border-2 border-dashed border-slate-200 text-center hover:border-blue-500 transition-colors cursor-pointer">
                          <div className="text-5xl mb-4">📄</div>
                          <p className="text-sm font-black text-slate-900 mb-1 italic">Remplacer mon CV</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">PDF (Dernier : cv_jean_2026.pdf)</p>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Pitch de présentation</label>
                          <textarea rows="4" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium resize-none focus:ring-4 focus:ring-blue-500/10"></textarea>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                          <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs">⏳</span> Expériences
                       </h3>
                       <div className="space-y-6">
                          {profile.timeline.map(exp => (
                             <div key={exp.id} className="relative pl-8 border-l-2 border-slate-100">
                                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white"></div>
                                <p className="text-xs font-black text-slate-900 leading-none mb-1">{exp.title}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">{exp.company} • {exp.date}</p>
                             </div>
                          ))}
                          <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">+ Ajouter une étape</button>
                       </div>
                    </div>

                    <div className="md:col-span-2 pt-10 border-t border-slate-100 flex justify-between items-center">
                       <button type="button" onClick={handleDeleteAccount} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">
                          🗑️ Supprimer mes données (RGPD)
                       </button>
                       <button type="submit" className="px-10 py-4 bg-numeric-blue text-white rounded-2xl font-black shadow-xl shadow-blue-500/30 hover:scale-105 transition-all text-xs uppercase tracking-widest">
                          💾 Sauvegarder mon identité
                       </button>
                    </div>
                 </form>
              </div>
           )}

        </div>

        {/* Sidebar Status (Pure AlumnForce style) */}
        <div className="lg:col-span-1 border-l border-slate-100 lg:pl-10 space-y-8">
           <div className="bg-[#0f172a] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-display font-black mb-8 italic">Votre Progression</h3>
              <div className="space-y-6">
                 <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] shrink-0">✓</div>
                    <div>
                       <p className="text-xs font-black">Identité validée</p>
                       <p className="text-[10px] text-slate-500">Parcours OPCO ATLAS</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] shrink-0">✓</div>
                    <div>
                       <p className="text-xs font-black">Score Employabilité</p>
                       <p className="text-[10px] text-slate-500">Niveau 2 (Confirmé)</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] shrink-0 animate-pulse">!</div>
                    <div>
                       <p className="text-xs font-black text-blue-400 underline italic">Stand Exposants ouverts</p>
                       <p className="text-[10px] text-slate-500">Explorez les opportunités de la région.</p>
                    </div>
                 </div>
              </div>
              <div className="mt-10 pt-10 border-t border-white/5">
                 <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-loose">
                    Opéré par Numeric'Emploi <br/> Plateforme Souveraine v2.0
                 </p>
              </div>
           </div>
           
           <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition cursor-pointer group">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform italic">🎓</div>
              <div>
                 <h4 className="font-black text-slate-900 text-sm italic">Mon Mentorat</h4>
                 <p className="text-[10px] text-slate-500 mt-1 font-bold">Aucun mentor rattaché.</p>
                 <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-4 hover:underline">Faire une demande →</button>
              </div>
           </div>
        </div>
        
      </main>
    </div>
  );
};

export default CandidateDashboard;
