import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState('events'); // events | offers
  
  // États de données
  const [events, setEvents] = useState([]);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Formulaire d'offre
  const [newOffer, setNewOffer] = useState({ title: '', description: '', contract_type: 'CDI', location: 'Paris', salary_range: '', is_remote: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'events') {
        const res = await fetch('/api/events');
        if (res.ok) setEvents((await res.json()).events || []);
      } else {
        const res = await fetch('/api/offers');
        if (res.ok) setOffers((await res.json()).offers || []);
      }
    } catch {
      // Ignorer pour la maquette
    }
    setIsLoading(false);
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOffer)
      });
      if(res.ok) {
        alert("✅ Offre publiée avec succès ! Elle est maintenant visible par les candidats qualifiés.");
        setNewOffer({ title: '', description: '', contract_type: 'CDI', location: 'Paris', salary_range: '', is_remote: false });
        fetchData();
      } else {
        const err = await res.json();
        alert("❌ Erreur lors de la publication : " + (err.error || "Problème serveur"));
      }
    } catch (e) {
      alert("⚠️ Erreur réseau : impossible de joindre le serveur.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Header Corporate / Entreprise */}
      <header className="bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
        <div className="absolute left-0 top-0 w-full h-[600px] bg-gradient-to-r from-blue-600/20 to-slate-900/10 blur-[80px] -z-0"></div>
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex items-center gap-6">
              <Link to="/" className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center font-display font-bold text-slate-900 text-2xl hover:scale-105 transition">ENT</Link>
              <div>
                <span className="inline-block px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border border-slate-700">
                  Espace Entreprise
                </span>
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-tight">
                  Trouvez vos futurs talents
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700 backdrop-blur">
              <div className="text-right">
                <p className="font-semibold text-sm">Capgemini France</p>
                <Link to="/" className="text-xs text-orange-400 font-bold hover:underline">Se déconnecter</Link>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">CF</div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Menu */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          <button onClick={() => setActiveTab('events')} className={`py-4 font-medium text-sm transition-all border-b-2 ${activeTab === 'events' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
             🗓️ Vos Job Dating
          </button>
          <button onClick={() => setActiveTab('offers')} className={`py-4 font-medium text-sm transition-all border-b-2 ${activeTab === 'offers' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
             📝 Dépôt d'Offres d'Emplois
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        
        {/* TAB EVENTS */}
        {activeTab === 'events' && (
           <section className="animate-fade-in-up">
              {/* KPIs Job Dating ... */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 text-brand-600 rounded-2xl flex justify-center items-center text-2xl shadow-inner">🤝</div>
                    <div>
                      <div className="text-3xl font-display font-bold text-slate-900">12</div>
                      <div className="text-sm font-medium text-slate-500">Entretiens Réalisés</div>
                    </div>
                 </div>
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-6">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex justify-center items-center text-2xl shadow-inner">⭐</div>
                    <div>
                      <div className="text-3xl font-display font-bold text-slate-900">4</div>
                      <div className="text-sm font-medium text-slate-500">Talents Shortlistés</div>
                    </div>
                 </div>
                 <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 shadow-lg shadow-brand-900/20 text-white flex items-center gap-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="text-3xl font-display font-bold">100%</div>
                      <div className="text-sm font-medium text-brand-100">Employabilité validée</div>
                    </div>
                 </div>
              </div>

              {/* Event List */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                   <h2 className="text-2xl font-display font-bold text-slate-900">Vos prochains Job Dating</h2>
                   <p className="text-sm text-slate-500 mt-1">Rencontrez des candidats pré-sélectionnés (Niveau 1 & 2).</p>
                </div>
                <div className="p-8">
                  {isLoading ? (
                     <div className="py-20 text-center animate-pulse text-brand-500 font-medium">Récupération API...</div>
                  ) : events.length === 0 ? (
                     <div className="py-16 text-center">
                       <h3 className="text-lg font-bold text-slate-800">Aucune session programmée</h3>
                       <p className="text-slate-500 text-sm mt-2">Votre conseiller n'a pas encore ouvert de nouveaux créneaux.</p>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {events.map(evt => (
                          <div key={evt.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-brand-300 transition-all bg-white">
                             <div className="flex justify-between items-start mb-4">
                               <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg border border-brand-100">Job Matching</span>
                               <span className="text-slate-500 text-sm font-semibold">📍 {evt.region}</span>
                             </div>
                             <h3 className="text-xl font-bold text-slate-900 mb-2">{evt.title}</h3>
                             <p className="text-slate-500 text-sm mb-6 line-clamp-2">{evt.description}</p>
                             <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors text-sm">
                               Accéder aux CV filtrés
                             </button>
                          </div>
                        ))}
                     </div>
                  )}
                </div>
              </div>
           </section>
        )}

        {/* TAB OFFERS (Dépôt d'Offres) */}
        {activeTab === 'offers' && (
           <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
             
             {/* Colonne Gauche : Formulaire de Dépôt */}
             <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 sticky top-24">
                  <h2 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-3">
                     <span className="text-3xl text-accent-500">📝</span> Publier une Offre
                  </h2>
                  <p className="text-sm text-slate-500 mb-6">Attirez les profils de niveau 1 & 2 en formatant votre offre de poste au sein de l'écosystème Numeric'Emploi.</p>
                  
                  <form onSubmit={handleCreateOffer} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Titre du Poste</label>
                      <input type="text" required value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 transition" placeholder="Ex: Développeur Full-Stack React" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Type de contrat</label>
                      <select required value={newOffer.contract_type} onChange={e => setNewOffer({...newOffer, contract_type: e.target.value})} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 transition">
                        <option value="CDI">CDI</option>
                        <option value="CDD">CDD</option>
                        <option value="Alternance">Alternance</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description / Missions</label>
                      <textarea required rows="4" value={newOffer.description} onChange={e => setNewOffer({...newOffer, description: e.target.value})} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 transition" placeholder="Détaillez les missions du candidat..."></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lieu</label>
                         <input type="text" required value={newOffer.location} onChange={e => setNewOffer({...newOffer, location: e.target.value})} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm" placeholder="Ville" />
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Télétravail</label>
                         <div className="flex items-center h-12">
                           <input type="checkbox" checked={newOffer.is_remote} onChange={e => setNewOffer({...newOffer, is_remote: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                           <span className="ml-2 text-sm text-slate-600">Possible</span>
                         </div>
                       </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 hover:scale-105 transition-all text-sm mt-4">
                      {isSubmitting ? 'Publication en cours...' : 'Publier l\'Offre'}
                    </button>
                  </form>
                </div>
             </div>

             {/* Colonne Droite : Liste de mes Offres Actives */}
             <div className="lg:col-span-2">
                <div className="flex justify-between items-end mb-8">
                   <div>
                     <h2 className="text-2xl font-display font-bold text-slate-900">Vos offres diffusées</h2>
                     <p className="text-sm text-slate-500 mt-1">Gérez le listing de tous vos recrutements actifs en ligne.</p>
                   </div>
                   <span className="px-4 py-1.5 bg-white shadow-sm border border-slate-200 text-brand-600 font-bold rounded-full text-sm">
                      {offers.length} Actives
                   </span>
                </div>

                {isLoading ? (
                   <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin"></div></div>
                ) : offers.length === 0 ? (
                   <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-16 text-center">
                      <div className="text-6xl mb-4 text-slate-300">📋</div>
                      <h3 className="text-lg font-bold text-slate-800">Aucune offre publiée.</h3>
                      <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">Commencez par utiliser le formulaire de gauche pour déposer votre première offre d'emploi.</p>
                   </div>
                ) : (
                   <div className="space-y-4">
                      {offers.map(off => (
                        <div key={off.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
                           <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold text-slate-900">{off.title}</h3>
                              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">En cours</span>
                           </div>
                           <div className="flex items-center gap-3 text-sm font-medium text-slate-500 mb-4">
                             <span className="bg-slate-100 px-2 py-1 rounded">{off.contract_type}</span>
                             <span>•</span>
                             <span>📍 {off.location} {off.is_remote ? '(Télétravail)' : ''}</span>
                             <span>•</span>
                             <span>📅 Ajoutée le {new Date(off.created_at).toLocaleDateString()}</span>
                           </div>
                           <p className="text-slate-600 text-sm line-clamp-2">{off.description}</p>
                           <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                              <button className="text-slate-500 hover:text-slate-800 text-sm font-semibold transition">Désactiver</button>
                              <button className="text-brand-600 hover:text-brand-800 text-sm font-semibold transition">Voir les Matchs IA</button>
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
