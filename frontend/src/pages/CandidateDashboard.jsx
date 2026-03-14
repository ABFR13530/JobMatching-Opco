import React, { useState, useEffect } from 'react';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('matching'); // matching | profile
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // État du profil candidat (pour le formulaire "Compléments d'infos")
  const [profile, setProfile] = useState({
    cvFile: null,
    linkedin: '',
    bio: '',
    experience: '0'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeTab === 'matching') {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/events');
      if (res.ok) setEvents((await res.json()).events || []);
    } catch {
      // Ignorer pour la maquette
    }
    setIsLoading(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulation d'un upload de fichier (Multer) et sauvegarde API
    setTimeout(() => {
      alert("✅ Profil mis à jour avec succès ! Votre CV a bien été uploadé.");
      setIsSaving(false);
    }, 1500);
  };

  const handleFileChange = (e) => {
    setProfile({...profile, cvFile: e.target.files[0]});
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Header Premium Candidat */}
      <header className="bg-gradient-to-r from-brand-900 to-brand-800 text-white relative overflow-hidden shadow-xl border-b border-brand-700">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-500 rounded-full blur-[120px] opacity-20 -z-0"></div>
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="inline-block px-3 py-1 bg-brand-800 text-brand-200 rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-inner ring-1 ring-brand-700">
                Espace Candidat
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold tracking-tight leading-tight">
                Votre carrière,<br/>
                <span className="text-brand-300">accélérée par l'IA.</span>
              </h1>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl flex items-center gap-5 shadow-2xl shadow-brand-900/50">
               <div>
                  <div className="text-brand-100 text-xs font-semibold uppercase tracking-wider mb-1 text-right">Employabilité</div>
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-bold text-white bg-green-500/20 text-green-300 px-2 py-0.5 rounded border border-green-500/30">
                        Niveau 1
                     </span>
                     <span className="text-brand-200 text-sm italic">"Prêt à l'emploi"</span>
                  </div>
               </div>
               <div className="w-14 h-14 bg-gradient-to-tr from-green-400 to-emerald-500 rounded-full flex items-center justify-center font-display font-bold text-white text-xl ring-4 ring-white/10 shadow-lg relative">
                 <div className="absolute inset-0 border-2 border-white/30 rounded-full border-t-white animate-spin"></div>
                 100
               </div>
            </div>
            
          </div>
        </div>
      </header>

      {/* Tabs Menu */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          <button onClick={() => setActiveTab('matching')} className={`py-4 font-medium text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'matching' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
             🪄 Mes Matchs IA
          </button>
          <button onClick={() => setActiveTab('profile')} className={`py-4 font-medium text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'profile' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
             <div className="relative">
                ⚙️ Mon Profil
                {(!profile.cvFile || !profile.linkedin) && <span className="absolute -top-1 -right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
             </div>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Principale Variable (Matching OU Profil) */}
        <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
           
           {activeTab === 'matching' ? (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-40 h-40 bg-accent-50 rounded-bl-full -z-10 blur-2xl"></div>
                
                <h2 className="text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
                   <span className="text-3xl text-brand-500">🪄</span> Vos Matchs
                </h2>
                <p className="text-sm text-slate-500 mt-2 mb-8 max-w-lg">
                   Votre profil validé vous donne un accès exclusif aux offres de recrutement de votre région. Réservez votre créneau d'entretien Jitsi.
                </p>
                
                {isLoading ? (
                   <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin"></div></div>
                ) : events.length === 0 ? (
                   <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                     <div className="text-6xl mb-4">🔮</div>
                     <h3 className="text-lg font-bold text-slate-800">En attente d'offres</h3>
                     <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
                       Aucun événement de Job Matching n'est prévu dans l'immédiat pour votre région.
                     </p>
                   </div>
                ) : (
                   <div className="space-y-4">
                     {events.map((evt, index) => (
                        <div key={evt.id} className="border border-slate-200 rounded-2xl p-6 bg-white hover:shadow-xl hover:-translate-y-1 transition-all group relative">
                           {index === 0 && <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg rotate-12 animate-pulse">NOUVEAU !!</span>}
                           <div className="flex flex-col md:flex-row gap-6">
                              <div className="w-full md:w-48 bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center items-center text-center">
                                 <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl mb-3">
                                    {evt.location_type === 'visio' ? '💻' : '🏢'}
                                 </div>
                                 <p className="font-bold text-slate-900 text-sm">{evt.location_type === 'visio' ? 'Visio Jitsi' : 'Présentiel'}</p>
                                 <p className="text-xs text-slate-500 mt-1">{new Date(evt.event_date).toLocaleDateString()}</p>
                              </div>
                              <div className="flex-1 flex flex-col justify-between">
                                 <div>
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">{evt.title}</h3>
                                    <p className="text-slate-600 text-xs line-clamp-2 md:line-clamp-3 leading-relaxed">{evt.description}</p>
                                 </div>
                                 <button className="mt-4 md:mt-0 w-min whitespace-nowrap px-6 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/30 hover:scale-105 transition-all">
                                    Réserver un créneau
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                   </div>
                )}
              </div>
           ) : (
              /* TAB PROFIL (Import CV & Infos) */
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                 <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Compléter votre Profil 📋</h2>
                 <p className="text-sm text-slate-500 mb-8">Les recruteurs seront 65% plus enclins à vous sélectionner lors des Matchs si votre profil est complet. Déposez votre CV PDF.</p>

                 <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Colonne de Gauche : Import du CV */}
                    <div className="space-y-6">
                       <div className="bg-slate-50 rounded-2xl p-6 border-2 border-brand-200 border-dashed text-center hover:bg-brand-50 transition cursor-pointer relative group">
                          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📄</div>
                          <h4 className="font-bold text-slate-800 text-sm">Déposer mon CV</h4>
                          <p className="text-xs text-slate-500 mt-1">Formats acceptés : PDF, Word (Max 5Mo)</p>
                          {profile.cvFile && (
                             <div className="mt-4 bg-green-100 text-green-800 text-xs font-bold py-2 rounded-lg border border-green-200">
                               ✅ Fichier prêt : {profile.cvFile.name}
                             </div>
                          )}
                       </div>
                       
                       <div>
                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lien Profil LinkedIn</label>
                         <input type="url" value={profile.linkedin} onChange={e => setProfile({...profile, linkedin: e.target.value})} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent transition" placeholder="https://linkedin.com/in/votre-profil" />
                       </div>
                    </div>

                    {/* Colonne de Droite : Bio et Expérience */}
                    <div className="space-y-6 flex flex-col">
                       <div>
                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Années d'Expérience IT</label>
                         <div className="flex bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                           <button type="button" onClick={() => setProfile({...profile, experience: '0-1'})} className={`flex-1 py-2 text-sm font-medium ${profile.experience === '0-1' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Débutant</button>
                           <button type="button" onClick={() => setProfile({...profile, experience: '2-4'})} className={`flex-1 py-2 text-sm font-medium border-l border-slate-200 ${profile.experience === '2-4' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>2 - 4 ans</button>
                           <button type="button" onClick={() => setProfile({...profile, experience: '5+'})} className={`flex-1 py-2 text-sm font-medium border-l border-slate-200 ${profile.experience === '5+' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>5 ans +</button>
                         </div>
                       </div>
                       <div className="flex-1 flex flex-col">
                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Courte introduction (Bio)</label>
                         <textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent transition flex-1 resize-none" placeholder="Ex: Développeur passionné en reconversion, j'ai récemment obtenu mon RNCP Titre V..."></textarea>
                       </div>
                    </div>
                    
                    {/* Bouton de Sauvegarde */}
                    <div className="md:col-span-2 pt-6 border-t border-slate-100 flex justify-end">
                       <button type="submit" disabled={isSaving || (!profile.cvFile && !profile.linkedin && !profile.bio)} className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 hover:-translate-y-0.5 transition-all text-sm flex gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed">
                          {isSaving ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sauvegarde...</>
                          ) : (
                            '💾 Enregistrer mon Profil'
                          )}
                       </button>
                    </div>

                 </form>
              </div>
           )}

        </div>
        
        {/* Colonne Side : Profil / Mentorat */}
        <div className="lg:col-span-1 border-l border-slate-100 lg:pl-8 space-y-6">
           
           <div className="bg-brand-900 rounded-3xl p-8 text-white shadow-xl shadow-brand-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px]"></div>
              <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                 <span className="bg-white/20 p-2 rounded-lg text-lg">🎓</span> Parcours Initial
              </h3>
              
              <ul className="space-y-4">
                 <li className="flex gap-4 opacity-50">
                    <div className="w-6 py-0.5 flex flex-col items-center">
                       <div className="w-3 h-3 rounded-full bg-brand-400"></div>
                       <div className="w-px h-full bg-brand-400 mt-1"></div>
                    </div>
                    <div className="pb-4">
                       <p className="text-sm font-bold">Inscription Plateforme</p>
                       <p className="text-xs text-brand-300">Validé en Février</p>
                    </div>
                 </li>
                 <li className="flex gap-4 opacity-50">
                    <div className="w-6 py-0.5 flex flex-col items-center">
                       <div className="w-3 h-3 rounded-full bg-brand-400"></div>
                       <div className="w-px h-full bg-brand-400 mt-1"></div>
                    </div>
                    <div className="pb-4">
                       <p className="text-sm font-bold">Évaluation du Projet</p>
                       <p className="text-xs text-brand-300">Score de 75/100</p>
                    </div>
                 </li>
                 <li className="flex gap-4 opacity-50">
                    <div className="w-6 py-0.5 flex flex-col items-center">
                       <div className="w-3 h-3 rounded-full bg-brand-400"></div>
                       <div className="w-px h-full bg-brand-400 mt-1"></div>
                    </div>
                    <div className="pb-4">
                       <p className="text-sm font-bold">Analyse Employabilité</p>
                       <p className="text-xs text-brand-300">Classé Niveau 1</p>
                    </div>
                 </li>
                 <li className="flex gap-4">
                    <div className="w-6 py-0.5 flex flex-col items-center">
                       {(!profile.cvFile || !profile.linkedin) ? (
                          <div className="w-4 h-4 rounded-full border-4 border-yellow-500 bg-slate-900 animate-pulse"></div>
                       ) : (
                          <div className="w-4 h-4 rounded-full bg-accent-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]"></div>
                       )}
                    </div>
                    <div>
                       <p className="text-sm font-bold text-accent-400">Job Matching</p>
                       <p className="text-xs text-brand-200 mt-1 leading-relaxed">
                          {(!profile.cvFile || !profile.linkedin) 
                            ? "Action Requise : Allez dans l'onglet 'Mon Profil' en haut pour rattacher votre CV et vous rendre visible des recruteurs."
                            : "Profil complet ! Vos compétences sont désormais analysées pour le matching IA avec les Datings locaux."}
                       </p>
                    </div>
                 </li>
              </ul>
           </div>
           
           <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl shrink-0">✉️</div>
              <div>
                 <h4 className="font-bold text-slate-900 text-sm">Contacter mon conseiller</h4>
                 <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">Questions sur l'import de votre CV ?</p>
                 <a href="mailto:contact@opco-atlas.fr" className="text-xs font-bold text-brand-600 hover:text-brand-800 underline">Envoyer un message</a>
              </div>
           </div>
           
        </div>
        
      </main>
    </div>
  );
};

export default CandidateDashboard;
