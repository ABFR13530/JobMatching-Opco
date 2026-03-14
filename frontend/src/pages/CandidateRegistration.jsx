import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CandidateRegistration = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    region: 'Île-de-France',
    competences: '',
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const competencesArray = formData.competences.split(',').map(c => c.trim()).filter(c => c);
      
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          competences: competencesArray,
          niveau_employabilite: 3,
          source: 'manual'
        }),
      });

      if (!response.ok) throw new Error("Erreur");
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center animate-fade-in-up border border-green-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Bienvenue Abord !</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            Votre profil de candidat a été créé avec succès. Nos conseillers vont l'analyser pour valider votre niveau d'employabilité et vous ouvrir l'accès aux Job Datings.
          </p>
          <Link to="/connexion/candidat" className="block w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
            Accéder à mon Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative flex items-center justify-center p-6">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-slate-900 -z-10 skew-y-[-2deg] origin-top-left"></div>
      
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl shadow-slate-900/10 overflow-hidden animate-fade-in-up">
        {/* Header Form */}
        <div className="bg-slate-900 px-10 py-8 text-white relative">
           <Link to="/" className="absolute top-6 right-6 text-slate-400 hover:text-white transition text-xs font-semibold flex items-center gap-2">
             ✕ Fermer
           </Link>
           <h2 className="text-3xl font-display font-bold">Inscription Candidat</h2>
           <p className="text-blue-300 text-sm mt-1">Rejoignez le programme de Matching Talents</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prénom</label>
              <input required type="text" placeholder="Ex: Jean"
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                onChange={e => setFormData({...formData, prenom: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nom</label>
              <input required type="text" placeholder="Ex: Dupont"
                className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                onChange={e => setFormData({...formData, nom: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Professionnel</label>
            <input required type="email" placeholder="jean.dupont@email.com"
              className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Région de recherche</label>
            <select className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
              value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}>
              <option>Île-de-France</option>
              <option>Nouvelle-Aquitaine</option>
              <option>Auvergne-Rhône-Alpes</option>
              <option>Provence-Alpes-Côte d'Azur</option>
              <option>Hauts-de-France</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Compétences clés</label>
            <input type="text" placeholder="ex: React, Node.js, Design System" 
              className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              onChange={e => setFormData({...formData, competences: e.target.value})} />
            <p className="text-[10px] text-slate-400 mt-2 italic font-medium">Séparez vos expertises par des virgules pour optimiser le matching IA.</p>
          </div>

          {status === 'error' && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100">
               ⚠️ Une erreur est survenue. Vérifiez vos informations ou essayez un autre email.
            </div>
          )}

          <div className="pt-4">
            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-xl shadow-blue-500/20 hover:scale-[1.02] hover:bg-blue-700 transition-all">
              Créer mon profil Candidat
            </button>
            <p className="text-center text-slate-400 text-xs mt-6">
              Déjà inscrit ? <Link to="/connexion/candidat" className="text-blue-600 font-bold hover:underline">Se connecter</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateRegistration;
