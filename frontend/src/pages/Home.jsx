import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [activeEvents, setActiveEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setActiveEvents(data.events || []);
        }
      } catch (e) { console.error(e); }
      setIsLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Navbar Floating Premium */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-900 shadow-2xl">N</div>
             <span className="font-display font-black text-xl italic tracking-tighter">Numeric'Emploi <span className="text-blue-500">SaaS</span></span>
          </div>
          <div className="hidden md:flex gap-8 items-center bg-white/5 backdrop-blur-md px-8 py-3 rounded-full border border-white/10 shadow-xl">
             <a href="#events" className="text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition">Événements</a>
             <a href="#solutions" className="text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition">Solutions</a>
             <button onClick={() => navigate('/connexion/interne')} className="bg-blue-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">Accès Interne</button>
          </div>
        </div>
      </nav>

      {/* Hero Section - AlumnForce Style */}
      <main className="relative pt-40 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-full blur-[160px] -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 animate-fade-in">
             <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Plateforme Souveraine pour l'OPCO ATLAS</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter leading-[0.85] italic mb-10 max-w-5xl mx-auto animate-fade-in-up">
            Connectez vos <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Jeunes Talents.</span>
          </h1>
          
          <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed mb-16 animate-fade-in-up delay-100">
            La solution hybride de Job Matching pour organiser vos forums entreprises, gérer vos CVthèques et piloter le mentorat en toute conformité RGPD.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up delay-200">
             <Link to="/connexion/candidat" className="px-12 py-5 bg-white text-slate-900 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl">
                Espace Candidat <span className="opacity-30">→</span>
             </Link>
             <Link to="/connexion/recruteur" className="px-12 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all">
                Espace Entreprise <span className="opacity-30">🏢</span>
             </Link>
          </div>
        </div>
      </main>

      {/* Featured Events Section */}
      <section id="events" className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
         <div className="flex justify-between items-end mb-16 px-4">
            <div className="max-w-xl">
               <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 italic">Calendrier National</h2>
               <h3 className="text-4xl md:text-5xl font-display font-black tracking-tighter italic">Événements en direct</h3>
            </div>
            <p className="text-slate-500 text-sm font-bold italic hidden md:block">Accédez aux sessions de recrutement régionales en un clic.</p>
         </div>

         {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 opacity-50 animate-pulse">
               {[1,2,3].map(i => <div key={i} className="h-64 bg-white/5 rounded-[2.5rem] border border-white/10"></div>)}
            </div>
         ) : activeEvents.length === 0 ? (
            <div className="bg-white/5 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-white/5">
                <p className="text-slate-500 font-bold italic">Aucun forum n'est ouvert actuellement. Revenez bientôt !</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
               {activeEvents.map(evt => (
                  <div key={evt.id} className="group bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 hover:border-blue-500/30 transition-all hover:translate-y-[-10px] relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 rounded-bl-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="flex justify-between items-center mb-10">
                        <span className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">🗓️</span>
                        <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">Live</span>
                     </div>
                     <h4 className="text-2xl font-black mb-2 italic group-hover:text-blue-400 transition-colors uppercase">{evt.titre}</h4>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">📍 {evt.region} • {new Date(evt.date).toLocaleDateString()}</p>
                     <Link to="/connexion/candidat" className="w-full py-4 bg-white/5 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white hover:text-slate-900 transition-all">Consulter l'événement</Link>
                  </div>
               ))}
            </div>
         )}
      </section>

      {/* Footer Souverain */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
         <div className="text-center md:text-left">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Produit par Numeric'Emploi</p>
            <p className="text-xs text-slate-500 italic max-w-xs">Hébergement 100% Souverain sur infrastructure Française conforme RGPD.</p>
         </div>
         <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <a href="#" className="hover:text-white transition">CGU</a>
            <a href="#" className="hover:text-white transition">RGPD</a>
            <a href="#" className="hover:text-white transition">Contact</a>
         </div>
         <div className="w-32 h-10 grayscale opacity-20 filter invert brightness-200 contrast-150">
            {/* Logo Opco Atlas (Placeholder text) */}
            <span className="font-black italic text-xl">OPCO ATLAS</span>
         </div>
      </footer>

    </div>
  );
};

export default Home;
