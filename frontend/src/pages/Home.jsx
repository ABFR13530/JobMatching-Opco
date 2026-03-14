import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans relative">
      
      {/* Background moderne avec glow USANT DES COULEURS STANDARDS POUR ÉVITER LES BUGS */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden -z-10 bg-slate-900 skew-y-[-2deg] origin-top-left shadow-2xl">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[140px] opacity-40 mix-blend-overlay"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500 rounded-full blur-[120px] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Navigation (Header) */}
      <header className="absolute top-0 w-full z-10 px-6 sm:px-12 py-6 flex justify-between items-center text-white">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-white rounded flex justify-center items-center shadow-lg font-display text-slate-900 font-bold text-xl">
             N
          </div>
          <span className="font-display font-semibold tracking-wide text-xl">Numeric'Emploi</span>
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-blue-100 items-center">
          <Link to="/connexion/candidat" className="hover:text-white transition">Candidats</Link>
          <Link to="/connexion/recruteur" className="hover:text-white transition">Recruteurs</Link>
          <Link to="/connexion/interne" className="px-4 py-2 border border-blue-500/50 bg-slate-800/50 hover:bg-slate-700/80 rounded-full backdrop-blur transition-all">
            Espace Conseillers
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-32 lg:pt-48 pb-20 z-10">
        
        <div className="text-center md:text-left max-w-3xl animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800 text-blue-100 font-medium text-xs tracking-wider mb-6 border border-slate-700 uppercase">
             🌟 Lancement : Module de Job Matching
          </span>
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-white tracking-tight leading-tight mb-6">
            L'emploi de demain,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">matché aujourd'hui.</span>
          </h1>
          <p className="text-lg lg:text-xl text-blue-100 leading-relaxed max-w-2xl font-light mb-10">
            Une plateforme de mise en relation ciblée entre les talents du numérique et les entreprises recruteuses de votre région. Un service gratuit opéré par Opco Atlas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <div className="flex flex-col gap-2">
              <Link to="/connexion/candidat" className="px-8 py-4 rounded-xl bg-white text-slate-900 font-bold shadow-xl shadow-slate-900/20 hover:scale-105 hover:shadow-2xl transition-all duration-300 text-center">
                Je suis Candidat(e)
              </Link>
              <Link to="/register-candidat" className="text-center text-xs text-blue-200 hover:text-white font-medium">S'inscrire gratuitement</Link>
            </div>
            <div className="flex flex-col gap-2">
              <Link to="/connexion/recruteur" className="px-8 py-4 rounded-xl bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/20 hover:scale-105 hover:bg-orange-600 transition-all duration-300 text-center">
                Je suis Recruteur
              </Link>
              <Link to="/register-recruteur" className="text-center text-xs text-blue-200 hover:text-white font-medium">Devenir partenaire</Link>
            </div>
          </div>
        </div>

      </main>

      {/* Cartes d'explications (Glassmorphism) */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 -mt-10 lg:-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
           <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition hover:-translate-y-2 duration-300">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-6">🎯</div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-3">Matching Intelligent</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Notre technologie croise instantanément vos compétences (certifiées niveau 1 ou 2) avec les offres d'emploi des entreprises de votre bassin.
              </p>
           </div>
           
           <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition hover:-translate-y-2 duration-300">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-6">📹</div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-3">Entretiens en Visioconférence</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connectés à l'API Jitsi, les créneaux d'entretiens sont générés automatiquement. Ne perdez plus de temps en trajets physiques superflus.
              </p>
           </div>
           
           <Link to="/connexion/interne" className="block bg-white/80 backdrop-blur-xl border border-slate-200 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition hover:-translate-y-2 duration-300 cursor-pointer text-left">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">👩‍💼</div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-3">Espace Conseillers</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Accès réservé aux collaborateurs Opco Atlas pour la création d'événements "Job Dating", imports CSV et pilotage des KPIs locaux.
              </p>
           </Link>
        </div>
      </section>

      {/* Footer minimaliste moderne */}
      <footer className="mt-32 pb-8 border-t border-slate-200 text-center px-6">
        <div className="pt-8 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Numeric'Emploi par Opco Atlas. Module Interopérable & Autonome.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
