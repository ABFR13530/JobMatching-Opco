import React, { useState } from 'react';

const RecruiterRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    entreprise_nom: '',
    siret: '',
    recruteur_nom: '',
    recruteur_email: '',
    // Partie Offre
    offre_titre: '',
    offre_description: '',
    offre_type_contrat: 'CDI',
    region: 'Île-de-France',
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dans un contexte complet, on lierait ceci à deux endpoints :
      // 1. POST /api/companies (Création entreprise + recruteur en attente)
      // 2. POST /api/offers (Création de l'offre d'emploi déposée initialement)
      
      const response = await fetch('/api/companies/register-with-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, statut: 'en_attente' }), // Le conseiller devra valider
      });

      if (!response.ok) throw new Error("Erreur lors de la création");
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow">
        <h2 className="text-xl font-bold text-blue-800">Demande d'inscription envoyée !</h2>
        <p className="mt-2 text-blue-700">
          Votre compte Entreprise et votre première offre d'emploi sont en cours de validation par l'équipe Numeric'Emploi. Vous recevrez un email dès que votre espace sera ouvert.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Espace Entreprise</h2>
        <span className="text-sm font-medium text-gray-500">Étape {step} sur 2</span>
      </div>

      <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
        
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">1. L'Entreprise et le Recruteur</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={e => setFormData({...formData, entreprise_nom: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">SIRET</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={e => setFormData({...formData, siret: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Votre Nom</label>
                <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={e => setFormData({...formData, recruteur_nom: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email professionnel</label>
                <input required type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={e => setFormData({...formData, recruteur_email: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="w-full mt-4 py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700">Continuer vers le dépôt d'offre</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">2. Votre première Offre de Job Matching</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Titre du poste</label>
              <input required type="text" placeholder="ex: Développeur Fullstack React/Node" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={e => setFormData({...formData, offre_titre: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type de contrat</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.offre_type_contrat} onChange={e => setFormData({...formData, offre_type_contrat: e.target.value})}>
                  <option>CDI</option>
                  <option>CDD</option>
                  <option>Alternance</option>
                  <option>Freelance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Région du poste</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}>
                  <option>Île-de-France</option>
                  <option>Nouvelle-Aquitaine</option>
                  <option>Auvergne-Rhône-Alpes</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description succincte (Missions, Stack)</label>
              <textarea required rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onChange={e => setFormData({...formData, offre_description: e.target.value})} />
            </div>

            <div className="flex space-x-3 pt-4">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Retour</button>
              <button type="submit" className="w-2/3 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Soumettre ma candidature</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RecruiterRegistration;
