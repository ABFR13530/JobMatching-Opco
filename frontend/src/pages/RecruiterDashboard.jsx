import React, { useState } from 'react';

const RecruiterDashboard = () => {
  // --- Données Mockées du Recruteur ---
  const currentRecruiter = { nom: 'Marc Blanc', entreprise: 'Tech Solutions' };
  const authorizedEvent = { id: 1, titre: 'Job Dating IDF - Tech & Data', date: '2026-04-10' };

  // --- Gestion de l'état (Slots de temps) ---
  const [slots, setSlots] = useState([
    { id: 1, time: '09:00 - 09:30', is_booked: false, candidate: null },
    { id: 2, time: '09:30 - 10:00', is_booked: true, candidate: { prenom: 'Alice', nom: 'D.', employabilite: 1, competences: 'React, Node', jitsi_link: 'https://meet.jit.si/numericEmploi_1_78A_xyz99e' } },
    { id: 3, time: '10:00 - 10:30', is_booked: false, candidate: null },
  ]);

  // --- Modal Feedback Post-Entretien ---
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [feedback, setFeedback] = useState('');

  // --- Handlers UI ---
  const handleAddSlot = () => {
    // Logique basique pour créer le créneau suivant (ex: 10:30 - 11:00)
    alert("Création dynamique d'un nouveau créneau de 30 minutes. API (POST /api/slots) appelée.");
    const lastSlot = slots[slots.length - 1];
    setSlots([...slots, { id: Date.now(), time: 'Nouveau créneau 30min', is_booked: false, candidate: null }]);
  };

  const handleRemoveSlot = (id) => {
    // Un créneau déjà réservé ne peut être supprimé par le recruteur (ou alors avec processus d'annulation lourd)
    setSlots(slots.filter(s => s.id !== id));
  };

  const handleSaveFeedback = (e) => {
    e.preventDefault();
    alert(`Feedback enregistré pour le candidat : "${feedback}". \nCette donnée remontera dans l'export CSV du Conseiller !`);
    
    // Fermeture de la modale
    setSelectedCandidate(null);
    setFeedback('');
    
    // Requête réelle: PUT /api/events/bookings/:id { feedback_recruiter: feedback, attended: true }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 text-gray-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Entreprise */}
        <div className="bg-white rounded-lg shadow-sm border p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-indigo-500 pl-3">
              Espace Recruteur — {currentRecruiter.entreprise}
            </h1>
            <p className="mt-2 text-sm text-gray-500 pl-4">{currentRecruiter.nom} | Accès restreint Candidats Qualifiés</p>
          </div>
          <div className="text-right">
             <div className="text-sm font-semibold text-gray-700">Prochain Événement</div>
             <div className="text-lg text-indigo-700 font-bold">{authorizedEvent.titre}</div>
             <div className="text-xs text-gray-500">{authorizedEvent.date}</div>
          </div>
        </div>

        {/* Section Principale : Gestion des Créneaux ("Slots") */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-lg font-bold">Mes RDV Visioconférence ({authorizedEvent.date})</h2>
            <button 
              onClick={handleAddSlot}
              className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-md hover:bg-indigo-100 transition text-sm font-medium">
              + Ouvrir un créneau (30 min)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot) => (
              <div key={slot.id} className={`border rounded-xl p-5 shadow-sm transition-all ${slot.is_booked ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                
                {/* Header du Slot (Heure) */}
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-gray-700">{slot.time}</span>
                  {!slot.is_booked && (
                    <button onClick={() => handleRemoveSlot(slot.id)} className="text-red-400 hover:text-red-600 text-xs font-semibold">Fermer</button>
                  )}
                  {slot.is_booked && (
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded font-bold">Réservé</span>
                  )}
                </div>

                {/* Contenu du Slot (Vide ou CV) */}
                {!slot.is_booked ? (
                  <div className="text-center py-6 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    Créneau Libre
                    <div className="text-xs mt-1">Visible des candidats</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Profil Qualifié Simplifié (RGPD) */}
                    <div>
                       <div className="text-lg font-bold text-gray-900">{slot.candidate.prenom} {slot.candidate.nom}</div>
                       <div className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1">
                         Employabilité validée (Niveau {slot.candidate.employabilite})
                       </div>
                       <div className="text-sm text-gray-600 mt-2 font-mono break-words">{slot.candidate.competences}</div>
                    </div>

                    {/* Actions de l'Entretien */}
                    <div className="pt-3 border-t border-indigo-200 flex flex-col gap-2">
                      <a href={slot.candidate.jitsi_link} target="_blank" rel="noopener noreferrer"
                         className="w-full bg-indigo-600 text-white text-sm font-medium py-2 rounded text-center hover:bg-indigo-700">
                         Démarrer la Visio (Jitsi)
                      </a>
                      <button onClick={() => setSelectedCandidate(slot.candidate)}
                         className="w-full bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded text-center hover:bg-gray-50 flex justify-center items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                         Saisir mon Feedback Retour
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- Overlay Modale de Feedback --- */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-lg font-bold mb-2">Feedback : {selectedCandidate.prenom} {selectedCandidate.nom}</h3>
            <p className="text-sm text-gray-500 mb-4">Ces notes sont privées et seront transmises au conseiller / logiciel lors de l'export des résultats du Job Matching.</p>
            
            <form onSubmit={handleSaveFeedback}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Le profil correspondait-il au poste ?</label>
                <div className="flex gap-4 mb-4">
                  <label className="inline-flex items-center"><input type="radio" name="presence" className="form-radio text-indigo-600" required value="oui"/> <span className="ml-2 text-sm">Oui</span></label>
                  <label className="inline-flex items-center"><input type="radio" name="presence" className="form-radio text-indigo-600" required value="non"/> <span className="ml-2 text-sm">Non</span></label>
                  <label className="inline-flex items-center"><input type="radio" name="presence" className="form-radio text-red-600" required value="absent"/> <span className="ml-2 text-sm italic">Candidat Absent</span></label>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1">Commentaires de l'entretien (Synthèse)</label>
                <textarea 
                  required
                  rows="4" 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Ex: Bonnes compétences techniques, profil intéressant. Nous allons vers une phase 2 d'entretien."
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 text-sm">
                <button type="button" onClick={() => setSelectedCandidate(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">Fermer</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 shadow-sm">Enregistrer le retour</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecruiterDashboard;
