import React, { useState } from 'react';

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
      // Transformation des compétences en tableau (séparées par des virgules)
      const competencesArray = formData.competences.split(',').map(c => c.trim()).filter(c => c);
      
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          competences: competencesArray,
          niveau_employabilite: 3, // Par défaut: 3 (Non évalué/A accompagner) jusqu'à validation Conseiller/IA
          source: 'manual'
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'inscription");
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-green-50 border border-green-200 rounded-lg shadow">
        <h2 className="text-xl font-bold text-green-700">Inscription réussie !</h2>
        <p className="mt-2 text-green-600">
          Votre profil a bien été créé. Nos conseillers Numeric'Emploi vont l'étudier avant de vous ouvrir l'accès aux événements de Job Matching.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Espace Candidat : Inscription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              onChange={e => setFormData({...formData, prenom: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={e => setFormData({...formData, nom: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email professionnel</label>
          <input required type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Région</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}>
            <option>Île-de-France</option>
            <option>Nouvelle-Aquitaine</option>
            <option>Auvergne-Rhône-Alpes</option>
            {/* Autres régions... */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Vos Compétences (séparées par une virgule)</label>
          <input type="text" placeholder="ex: React, Node.js, Python" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            onChange={e => setFormData({...formData, competences: e.target.value})} />
          <p className="text-xs text-gray-500 mt-1">Ces mots-clés aideront les recruteurs à vous trouver.</p>
        </div>

        {status === 'error' && <p className="text-red-500 text-sm">Une erreur est survenue. Cet email est peut-être déjà utilisé.</p>}

        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Créer mon profil Candidat
        </button>
      </form>
    </div>
  );
};

export default CandidateRegistration;
