import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RecruiterRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    entreprise_nom: '',
    siret: '',
    recruteur_nom: '',
    recruteur_email: '',
    offre_titre: '',
    offre_description: '',
    offre_type_contrat: 'CDI',
    region: 'Île-de-France',
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/webhooks/numeric-emploi', { // Utilisation d'un endpoint existant ou simulé
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'recruiter_registration' }),
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
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center animate-fade-in-up border border-blue-100">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🏢</div>
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Dépôt Enregistré !</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            Votre demande d'inscription Entreprise et votre première offre d'emploi sont en cours de validation par votre conseiller régional.
          </p>
          <Link to="/connexion/recruteur" className="block w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all">
            Accéder à l'Espace Recruteur
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative flex items-center justify-center p-6">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-slate-900 -z-10 skew-y-[-2deg] origin-top-left"></div>
      
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header Form */}
        <div className="bg-slate-900 px-10 py-8 text-white relative">
           <Link to="/" className="absolute top-6 right-6 text-slate-400 hover:text-white transition text-xs font-semibold">✕ Fermer</Link>
           <div className="flex justify-between items-end">
             <div>
               <h2 className="text-3xl font-display font-bold">Espace Entreprise</h2>
               <p className="text-orange-400 text-sm mt-1 font-medium tracking-wide border-b border-orange-400/30 inline-block pb-0.5">
                 {step === 1 ? '1. Identification Structure' : '2. Votre première Offre'}
               </p>
             </div>
             <div className="flex gap-1.5 pb-1">
                <div className={`w-10 h-1.5 rounded-full ${step >= 1 ? 'bg-orange-500' : 'bg-slate-700'}`}></div>
                <div className={`w-10 h-1.5 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-slate-700'}`}></div>
             </div>
           </div>
        </div>

        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); setStep(2); }} className="p-10 space-y-6">
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nom de l'entreprise</label>
                  <input required type="text" placeholder="Ex: Capgemini" 
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition"
                    onChange={e => setFormData({...formData, entreprise_nom: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">SIRET</label>
                  <input required type="text" placeholder="14 chiffres"
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition"
                    onChange={e => setFormData({...formData, siret: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nom du contact RH</label>
                  <input required type="text" placeholder="Mme. Martin"
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition"
                    onChange={e => setFormData({...formData, recruteur_nom: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Pro</label>
                  <input required type="email" placeholder="rh@entreprise.fr"
                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition"
                    onChange={e => setFormData({...formData, recruteur_email: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Continuer vers le dépôt d'offre <span>→</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Inutilé du poste à pourvoir</label>
                <input required type="text" placeholder="ex: Développeur Fullstack React"
                  className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 transition"
                  onChange={e => setFormData({...formData, offre_titre: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contrat</label>
                  <select className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 transition"
                    value={formData.offre_type_contrat} onChange={e => setFormData({...formData, offre_type_contrat: e.target.value})}>
                    <option>CDI</option><option>CDD</option><option>Alternance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Lieu</label>
                  <input type="text" placeholder="Ville" className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Missions du candidat</label>
                <textarea required rows="4" className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 transition"
                  onChange={e => setFormData({...formData, offre_description: e.target.value})} />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-4 border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition">Retour</button>
                <button type="submit" className="flex-1 py-4 bg-orange-500 text-white rounded-xl font-bold shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all">
                  Soumettre l'Entreprise et l'Offre
                </button>
              </div>
            </div>
          )}

          {status === 'error' && <p className="text-red-500 text-xs font-bold text-center italic">⚠️ Erreur lors de l'envoi de la demande.</p>}

          <p className="text-center text-slate-400 text-xs mt-6">
            Déjà partenaire ? <Link to="/connexion/recruteur" className="text-slate-900 font-bold hover:underline">Accès Dashboard</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RecruiterRegistration;
