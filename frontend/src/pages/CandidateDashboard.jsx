import React, { useState } from 'react';

const CandidateDashboard = () => {
  // --- Mock Data simulée provenant de l'API ---
  const currentCandidate = {
    prenom: 'Alice',
    region: 'Île-de-France',
    niveau_employabilite: 1, // Le conseiller a validé son accès
  };

  const [activeEvent, setActiveEvent] = useState(null);

  // Événements publiés dans la région du candidat
  const availableEvents = [
    { 
      id: 1, 
      titre: 'Job Dating IDF - Tech & Data', 
      date: '2026-04-10', 
      region: 'Île-de-France',
      recruteurs: [
        { id: 101, entreprise: 'Tech Solutions', offre: 'Développeur Fullstack React', slotsDispo: 3 },
        { id: 102, entreprise: 'DataCorp SA', offre: 'Ingénieur Data Junior', slotsDispo: 0 }
      ]
    }
  ];

  // Réservations déjà effectuées par le candidat
  const [myBookings, setMyBookings] = useState([
    // Le lien Jitsi est généré dynamiquement par le backend (event_bookings.jitsi_link)
    { id: 201, event: 'Job Dating IDF - Tech & Data', entreprise: 'Tech Solutions', date: '2026-04-10', time: '14:30', jitsi_link: 'https://meet.jit.si/numericEmploi_1_78A_xyz99e' }
  ]);

  // --- Handlers ---
  const handleBookSlot = (recruteurId, entreprise) => {
    // Vérification côté Front : 1 seul recruteur par événement (L'API re-vérifiera via SQL UNIQUE)
    const alreadyBooked = myBookings.find(b => b.entreprise === entreprise);
    if (alreadyBooked) {
      alert("Vous avez déjà réservé un créneau avec cette entreprise pour cet événement.");
      return;
    }

    // Requête réelle: POST /api/events/book { slot_id, candidate_id }
    alert(`Créneau de 30min réservé avec ${entreprise} ! Le lien Jitsi vient d'être généré.`);
    
    // Simulation d'ajout dans le dashboard
    setMyBookings([...myBookings, {
      id: Date.now(), 
      event: activeEvent.titre, 
      entreprise, 
      date: activeEvent.date, 
      time: '15:00', // Mock time
      jitsi_link: `https://meet.jit.si/numericEmploi_mock_${Date.now()}`
    }]);
    
    setActiveEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      
      {/* Header personnalisé du candidat */}
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-indigo-600 rounded-lg shadow-lg p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Bonjour, {currentCandidate.prenom} !</h1>
            <p className="mt-1 text-indigo-100">Votre profil est Actif (Employabilité Niv. {currentCandidate.niveau_employabilite}). Vous avez accès aux sessions de Job Matching exclusives de votre région ({currentCandidate.region}).</p>
          </div>
          <div className="hidden sm:block">
            <span className="inline-flex items-center justify-center px-3 py-1 bg-green-400 text-green-900 text-sm font-bold rounded-full">
              Profil Qualifié
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section 1 : Mes Entretiens programmés (Jitsi) */}
        {myBookings.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Mes prochains entretiens (Visioconférence)
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {myBookings.map((b) => (
                <div key={b.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{b.entreprise}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold">{b.date} à {b.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-4">{b.event}</p>
                  
                  {/* Bouton pour lancer la Visioconférence */}
                  <a href={b.jitsi_link} target="_blank" rel="noopener noreferrer" 
                     className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    Rejoindre l'entretien vidéo (Jitsi)
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 2 : Événements Job Matching Disponibles */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Événements dans votre région ({currentCandidate.region})</h2>
          
          {activeEvent ? (
            // Interface de sélection d'une entreprise/créneau pour l'événement sélectionné
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fadeIn">
              <button onClick={() => setActiveEvent(null)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-4 flex items-center">
                <span>&larr; Retour aux événements</span>
              </button>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{activeEvent.titre}</h3>
              <p className="text-sm text-gray-500 mb-6">Sélectionnez un recruteur pour réserver votre créneau de 30 minutes.</p>

              <div className="space-y-3">
                {activeEvent.recruteurs.map(rec => (
                  <div key={rec.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div className="mb-3 sm:mb-0">
                      <div className="font-bold text-gray-800">{rec.entreprise}</div>
                      <div className="text-sm text-indigo-600">{rec.offre}</div>
                    </div>
                    <div>
                      {rec.slotsDispo > 0 ? (
                        <button 
                          onClick={() => handleBookSlot(rec.id, rec.entreprise)}
                          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white text-sm font-medium border border-transparent rounded hover:bg-indigo-700">
                          Réserver un créneau (Reste {rec.slotsDispo})
                        </button>
                      ) : (
                        <button disabled className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-500 text-sm font-medium rounded cursor-not-allowed">
                          Complet
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Liste des événements
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y">
              {availableEvents.length === 0 ? (
                <div className="p-6 text-center text-gray-500">Aucun événement n'est programmé dans votre région pour le moment.</div>
              ) : (
                availableEvents.map(ev => (
                  <div key={ev.id} className="p-6 flex flex-col sm:flex-row justify-between items-center hover:bg-gray-50">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-lg font-bold text-gray-900">{ev.titre}</h3>
                      <p className="text-sm text-gray-500 mt-1">🗓️ Le {ev.date} — {ev.recruteurs.length} recruteurs présents</p>
                    </div>
                    <button 
                      onClick={() => setActiveEvent(ev)}
                      className="w-full sm:w-auto px-5 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Voir les offres & Réserver
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default CandidateDashboard;
