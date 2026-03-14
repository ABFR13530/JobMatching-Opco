import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [activeRole, setActiveRole] = useState(null);
  const navigate = useNavigate();

  const roles = [
    { id: 'candidat', title: 'Candidat', icon: '👨‍💻', desc: 'Accéder à mes matchs IA et mon CV', path: '/connexion/candidat', color: 'bg-blue-600' },
    { id: 'recruteur', title: 'Entreprise', icon: '🏢', desc: 'Déposer des offres et recruter', path: '/connexion/recruteur', color: 'bg-orange-600' },
    { id: 'intern', title: 'Conseiller', icon: '👩‍💼', desc: 'Gérer les événements et candidats', path: '/connexion/interne', color: 'bg-indigo-600' }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500/30">
      
      {/* Background avec Gradients Animés (Premium Dark Mode) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/30 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-orange-900/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Header Statif */}
      <header className="relative z-50 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <span className="text-slate-900 font-display font-black text-2xl">N</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-tight leading-none uppercase">Numeric'Emploi</span>
            <span className="text-[10px] text-blue-400 font-bold tracking-[0.2em] uppercase mt-1">Platform Module v2.0</span>
          </div>
        </div>
        <div className="hidden md:flex gap-6 items-center">
            <Link to="/register-candidat" className="text-sm font-semibold text-slate-400 hover:text-white transition">S'inscrire</Link>
            <div className="w-px h-4 bg-white/10"></div>
            <Link to="/connexion/interne" className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all backdrop-blur-md">
                Accès Interne
            </Link>
        </div>
      </header>

      {/* Hero & Role Picker */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Texte Hero */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
               </span>
               SESSION LIVE : JOB MATCHING 2026
            </div>
            <h1 className="text-6xl lg:text-8xl font-display font-black leading-[0.9] mb-8 tracking-tighter">
              L'emploi <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">connecté.</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-md mb-12 font-medium">
              Plateforme intelligente d'intermédiation pour les talents du numérique et les entreprises régionales.
            </p>
            
            {/* Stats rapides */}
            <div className="flex gap-10 border-t border-white/5 pt-10">
               <div>
                  <div className="text-3xl font-display font-bold">1.2k</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Candidats Matchés</div>
               </div>
               <div>
                  <div className="text-3xl font-display font-bold">450+</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Entreprises</div>
               </div>
            </div>
          </div>

          {/* Role Picker (L'authentification optimisée pour la démo) */}
          <div className="relative group">
             <div className="absolute inset-0 bg-blue-600/10 rounded-[2rem] blur-3xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
             <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                   Sélectionnez votre espace <span className="text-blue-500">→</span>
                </h2>
                
                <div className="space-y-4">
                   {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => navigate(role.path)}
                        className="w-full group/btn relative flex items-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 text-left overflow-hidden"
                      >
                         <div className={`w-14 h-14 ${role.color} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover/btn:scale-110 transition-transform duration-500`}>
                            {role.icon}
                         </div>
                         <div className="ml-5">
                            <h3 className="font-bold text-lg leading-none mb-1 group-hover/btn:text-blue-400 transition-colors">{role.title}</h3>
                            <p className="text-xs text-slate-500 font-medium">{role.desc}</p>
                         </div>
                         <div className="ml-auto opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-2 transition-all duration-300">
                            <span className="text-2xl">→</span>
                         </div>
                      </button>
                   ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
                       Opéré par Opco Atlas pour Numeric'Emploi <br/> 
                       Bassin Regional Standalone
                    </p>
                </div>
             </div>
          </div>

        </div>
      </main>

      {/* Footer minimaliste moderne */}
      <footer className="relative z-10 py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="text-slate-500 text-xs font-medium italic">
             "Rapprocher l'humain par la technologie"
           </div>
           <div className="flex gap-8">
              <a href="#" className="text-slate-400 hover:text-white transition text-xs font-bold uppercase tracking-tighter">Mentions Légales</a>
              <a href="#" className="text-slate-400 hover:text-white transition text-xs font-bold uppercase tracking-tighter">Interopérabilité API</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
