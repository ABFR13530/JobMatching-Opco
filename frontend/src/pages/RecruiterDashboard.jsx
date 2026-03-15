import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('events'); // events | offers | stand
  
  // États de données
  const [events, setEvents] = useState([]);
  const [offers, setOffers] = useState([]);
  const [company, setCompany] = useState({
    id: 1, // Fixé à 1 pour la démo "Fast Login" Capgemini
    name: 'Capgemini France',
    description: '',
    website_url: '',
    linkedin_url: '',
    video_url: '',
    industry: 'Services Numériques',
    size: 'Grande Entreprise'
  });
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]); // RDV confirmés
  const [showSlotGen, setShowSlotGen] = useState(false);
  const [slotFormData, setSlotFormData] = useState({ event_id: '', count: 10, start_time: '2026-06-15T09:00', duration: 20 });
  const [showNotifs, setShowNotifs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Formulaire d'offre
  const [newOffer, setNewOffer] = useState({ title: '', description: '', contract_type: 'CDI', location: 'Paris', salary_range: '', is_remote: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
    fetchNotifications();
  }, [activeTab]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?role=recruiter&userId=${company.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {}
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'events') {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } else if (activeTab === 'offers') {
        const res = await fetch('/api/offers');
        if (res.ok) {
          const data = await res.json();
          setOffers(data.offers || []);
        }
      } else if (activeTab === 'stand') {
        const res = await fetch(`/api/companies/${company.id}`);
        if (res.ok) {
          const data = await res.json();
          setCompany(data.company);
        }
      }
    } catch (e) { console.error(e); }
    setIsLoading(false);
  };

  const handleUpdateStand = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/companies/${company.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company)
      });
      if (res.ok) {
        alert("✅ Stand mis à jour avec succès ! Vos modifications sont visibles par les candidats.");
      }
    } catch (e) { alert("Erreur réseau"); }
    setIsSubmitting(false);
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newOffer, company_id: company.id })
      });
      if(res.ok) {
        alert("✅ Offre publiée avec succès !");
        setNewOffer({ title: '', description: '', contract_type: 'CDI', location: 'Paris', salary_range: '', is_remote: false });
        fetchData();
      }
    } catch (e) { alert("Erreur réseau"); }
    setIsSubmitting(false);
  };

  const handleGenerateSlots = async (e) => {
     e.preventDefault();
     setIsSubmitting(true);
     try {
        const res = await fetch(`/api/events/${slotFormData.event_id}/slots`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
              recruiter_id: company.id,
              start_time: slotFormData.start_time,
              count: parseInt(slotFormData.count),
              duration: parseInt(slotFormData.duration)
           })
        });
        if (res.ok) {
           alert("✅ Votre agenda a été généré ! Les candidats peuvent désormais réserver ces créneaux.");
           setShowSlotGen(false);
           fetchData();
        }
     } catch { alert("Erreur réseau"); }
     setIsSubmitting(false);
  };

  const handleDeleteOffer = async (offerId) => {
    if (window.confirm("Supprimer cette offre d'emploi ?")) {
       try {
          const res = await fetch(`/api/offers/${offerId}`, { method: 'DELETE' });
          if (res.ok) {
             alert("✅ Offre supprimée.");
             fetchData();
          }
       } catch { alert("Erreur réseau"); }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("⚠️ RGPD : Supprimer votre compte entreprise supprimera également toutes vos offres et votre stand virtuel définitivement. Confirmer ?")) {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: company.id, role: 'recruiter' })
        });
        if (res.ok) {
          alert("✅ Compte entreprise et données effacés.");
          localStorage.clear();
          window.location.href = '/';
        }
      } catch (e) { alert("Erreur réseau"); }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Header Corporate Ultra-Premium */}
      <header className="bg-[#0f172a] text-white relative overflow-hidden border-b border-white/5">
        <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8">
              <Link to="/" className="w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center font-display font-black text-slate-900 text-3xl hover:scale-105 transition-transform duration-500">
                {company.name.substring(0,2).toUpperCase()}
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold tracking-widest uppercase">Espace Exposant</span>
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">En Ligne</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tighter leading-none">
                  Bonjour, {company.name}
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
                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fadeIn text-slate-900 text-left">
                       <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center text-slate-900">
                          <span className="text-[10px] font-black uppercase tracking-widest ">Notifications Business</span>
                          <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
                       </div>
                       <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                             <p className="p-8 text-center text-xs text-slate-400 italic">Aucune alerte pour votre établissement.</p>
                          ) : (
                             notifications.map(n => (
                                <div key={n.id} className={`p-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition cursor-pointer ${!n.is_read ? 'bg-blue-50/30' : ''}`}>
                                   <p className="text-xs font-black  mb-1 uppercase">{n.title}</p>
                                   <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">"{n.message}"</p>
                                   <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase">{new Date(n.created_at).toLocaleDateString()}</p>
                                </div>
                             ))
                          )}
                       </div>
                    </div>
                 )}
              </div>
              
              <div className="flex gap-4">
              <button 
                onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold transition-all backdrop-blur-md"
              >
                Déconnexion
              </button>
            </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs (Style AlumnForce) */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex gap-10">
          <button onClick={() => setActiveTab('events')} className={`py-5 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'events' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
             🗓️ Job Dating
          </button>
          <button onClick={() => setActiveTab('offers')} className={`py-5 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'offers' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
             📝 Offres
          </button>
          <button onClick={() => setActiveTab('stand')} className={`py-5 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'stand' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
             🏢 Mon Stand Virtuel
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-12 animate-fade-in-up">
        
        {/* TAB EVENTS */}
        {activeTab === 'events' && (
           <section className="space-y-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-10 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                 <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 <div className="relative z-10 text-center md:text-left">
                    <h2 className="text-3xl font-display font-black mb-2 italic">Prochain Rendez-vous !</h2>
                    <p className="text-blue-100 font-medium">Job Matching Régional - Paris 2026</p>
                    <div className="mt-6 flex gap-4 justify-center md:justify-start">
                       <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                          <span className="block text-2xl font-black">{events.length}</span>
                          <span className="text-[10px] uppercase font-bold text-blue-200">Foras</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => window.open('https://meet.jit.si/numericEmploi_recruiter_general', '_blank')} className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black shadow-xl hover:scale-105 transition-all text-sm uppercase tracking-widest">
                    Ouvrir mon stand Visio
                 </button>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                   <h2 className="text-2xl font-display font-bold text-slate-900">Vos sessions de Job Dating</h2>
                   <button onClick={() => setShowSlotGen(true)} className="px-6 py-3 bg-numeric-orange text-white rounded-xl text-[10px] font-black uppercase tracking-widest">+ Publier Disponibilités</button>
                </div>
                <div className="p-8">
                  {isLoading ? (
                     <div className="py-20 text-center animate-pulse text-blue-500 font-bold">CHARGEMENT...</div>
                  ) : events.length === 0 ? (
                     <div className="py-16 text-center italic text-slate-400">Aucun événement n'est encore rattaché à votre compte.</div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {events.map(evt => (
                          <div key={evt.id} className="group border border-slate-200 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-300 transition-all bg-white relative">
                             <h3 className="text-xl font-bold text-slate-900 mb-2">{evt.titre}</h3>
                             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">📍 {evt.region} • 📅 {new Date(evt.date).toLocaleDateString()}</p>
                             <button onClick={() => { setSlotFormData({...slotFormData, event_id: evt.id}); setShowSlotGen(true); }} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-numeric-blue transition-colors text-xs uppercase tracking-widest">
                               Gérer les créneaux
                             </button>
                          </div>
                        ))}
                     </div>
                  )}
                </div>
              </div>

              {/* MODAL GENERATION SLOTS */}
              {showSlotGen && (
                 <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
                    <div className="bg-white rounded-[3rem] p-12 max-w-xl w-full shadow-2xl relative text-slate-900">
                       <button onClick={() => setShowSlotGen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 text-2xl font-black">×</button>
                       <h2 className="text-3xl font-display font-black mb-8 italic">Générer mon Agenda</h2>
                       <form onSubmit={handleGenerateSlots} className="space-y-6">
                          <div>
                             <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Début de disponibilité</label>
                             <input type="datetime-local" className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium" value={slotFormData.start_time} onChange={e => setSlotFormData({...slotFormData, start_time: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nombre d'entretiens</label>
                                <input type="number" className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium" value={slotFormData.count} onChange={e => setSlotFormData({...slotFormData, count: e.target.value})} />
                             </div>
                             <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Durée (min)</label>
                                <input type="number" className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium" value={slotFormData.duration} onChange={e => setSlotFormData({...slotFormData, duration: e.target.value})} />
                             </div>
                          </div>
                          <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-numeric-blue text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:scale-105 transition-all text-[10px] uppercase tracking-widest">
                             {isSubmitting ? 'Génération...' : 'Publier mes Slots'}
                          </button>
                       </form>
                    </div>
                 </div>
              )}
           </section>
        )}

        {/* TAB STAND (NOUVEAUTÉ ALUMNFORCE) */}
        {activeTab === 'stand' && (
           <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                 <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-10">
                    <h2 className="text-3xl font-display font-black text-slate-900 mb-8 flex items-center gap-4">
                       <span className="text-4xl">🏢</span> Identité du Stand
                    </h2>
                    <form onSubmit={handleUpdateStand} className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Nom affiché</label>
                            <input type="text" value={company.name} onChange={e => setCompany({...company, name: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Secteur d'activité</label>
                            <input type="text" value={company.industry} onChange={e => setCompany({...company, industry: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium" />
                          </div>
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Présentation de l'entreprise (Marketing)</label>
                          <textarea rows="6" value={company.description} onChange={e => setCompany({...company, description: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium resize-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" placeholder="Décrivez votre culture d'entreprise, vos valeurs..."></textarea>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Site Web</label>
                            <input type="text" value={company.website_url} onChange={e => setCompany({...company, website_url: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm" placeholder="https://..." />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">LinkedIn</label>
                            <input type="text" value={company.linkedin_url} onChange={e => setCompany({...company, linkedin_url: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm" placeholder="https://linkedin.com/company/..." />
                          </div>
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Vidéo de présentation (Lien YouTube/Vimeo)</label>
                          <input type="text" value={company.video_url} onChange={e => setCompany({...company, video_url: e.target.value})} className="w-full rounded-2xl border-slate-200 bg-slate-50 px-5 py-4 text-sm" placeholder="https://youtube.com/watch?v=..." />
                       </div>
                       <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                          <button type="button" onClick={handleDeleteAccount} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">
                             🗑️ Supprimer le compte et le stand
                          </button>
                          <button type="submit" disabled={isSubmitting} className="px-10 py-4 bg-numeric-blue text-white rounded-2xl font-black shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest">
                             {isSubmitting ? 'Mise à jour...' : 'Enregistrer le Stand'}
                          </button>
                       </div>
                    </form>
                 </div>
              </div>
              
              <div className="lg:col-span-1 space-y-6">
                 <div className="bg-[#0f172a] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
                    <h3 className="text-xl font-display font-black mb-6 flex items-center gap-3 italic">
                       👀 Aperçu Stand
                    </h3>
                    <div className="space-y-4 text-sm">
                       <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Visibilité</p>
                          <p className="font-bold flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-green-500"></span> Public sur le Forum
                          </p>
                       </div>
                       <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Score Complétude</p>
                          <div className="w-full bg-white/10 h-2 rounded-full mt-2">
                             <div className="bg-blue-500 h-full rounded-full" style={{width: '85%'}}></div>
                          </div>
                       </div>
                    </div>
                    <button className="w-full mt-8 py-4 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition">
                       Voir mon stand public
                    </button>
                 </div>
              </div>
           </section>
        )}

        {/* TAB OFFERS */}
        {activeTab === 'offers' && (
           <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in-up">
              <div className="lg:col-span-1">
                 <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 sticky top-32">
                    <h2 className="text-xl font-display font-black text-slate-900 mb-6 flex items-center gap-3">
                       <span className="text-3xl">📝</span> Publier une Offre
                    </h2>
                    <form onSubmit={handleCreateOffer} className="space-y-4">
                       <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Titre du poste</label>
                          <input type="text" required value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10" placeholder="Ex: Lead Developer React" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Type</label>
                            <select value={newOffer.contract_type} onChange={e => setNewOffer({...newOffer, contract_type: e.target.value})} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                               <option>CDI</option><option>CDD</option><option>Alternance</option><option>Stage</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Lieu</label>
                            <input type="text" required value={newOffer.location} onChange={e => setNewOffer({...newOffer, location: e.target.value})} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
                          </div>
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                          <textarea rows="4" required value={newOffer.description} onChange={e => setNewOffer({...newOffer, description: e.target.value})} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm resize-none"></textarea>
                       </div>
                       <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all text-[10px] uppercase tracking-widest">
                          {isSubmitting ? 'Envoi...' : 'Diffuser l\'offre'}
                       </button>
                    </form>
                 </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                 <h2 className="text-2xl font-display font-black text-slate-900 mb-8 italic flex items-center gap-3">
                   📋 Activité du Job Board
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full not-italic tracking-normal">{offers.length} Offres actives</span>
                 </h2>
                 {offers.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
                       <p className="text-slate-400 font-bold italic">Aucune offre n'est actuellement diffusée pour votre stand.</p>
                    </div>
                 ) : (
                    <div className="space-y-4">
                       {offers.map(off => (
                          <div key={off.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition flex justify-between items-center">
                             <div>
                                <h3 className="font-bold text-slate-900">{off.title}</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">📍 {off.location} • {off.contract_type}</p>
                             </div>
                             <div className="flex gap-2 text-[10px] font-black uppercase">
                                <span className="text-blue-600 px-4 py-2 bg-blue-50 rounded-lg tracking-widest">8 Candidats</span>
                                <button onClick={() => handleDeleteOffer(off.id)} className="text-slate-400 hover:text-red-500 px-2 py-2">🗑️</button>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </section>
        )}

      </main>
    </div>
  );
};

export default RecruiterDashboard;
