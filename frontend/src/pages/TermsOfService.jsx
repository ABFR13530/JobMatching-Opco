import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans pb-20">
      <nav className="p-8">
        <Link to="/" className="text-numeric-blue font-black tracking-tighter hover:text-white transition">← RETOUR ACCUEIL</Link>
      </nav>
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-display font-black italic tracking-tighter mb-4">Conditions Générales <span className="text-numeric-blue">d'Utilisation</span></h1>
        <p className="text-slate-400 mb-12 font-medium">Dernière mise à jour : 15 mars 2026</p>

        <div className="space-y-12 text-slate-300 leading-relaxed italic">
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">1. Objet du service</h2>
            <p>La plateforme Numeric'emploi/Job matching est un service de mise en relation entre des candidats et des entreprises dans le secteur du numérique. Elle permet l'organisation de forums virtuels, le dépôt d'offres d'emploi et la prise de rendez-vous pour des entretiens (Job Dating).</p>
          </section>section

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">2. Engagements de l'utilisateur</h2>
            <p>En utilisant ce service, vous vous engagez à fournir des informations exactes et sincères. Les recruteurs s'engagent à respecter la législation sur le travail et la non-discrimination. Les candidats s'engagent à honorer les rendez-vous pris lors des événements.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">3. Accès au service</h2>
            <p>L'accès est gratuit pour les candidats. Pour les entreprises, l'accès est soumis à validation par l'administrateur de la plateforme ou les conseillers régionaux.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">4. Responsabilité</h2>
            <p>Numeric'emploi agit en tant que simple intermédiaire. Nous ne garantissons pas l'aboutissement des recrutements ni la véracité des CV déposés. La responsabilité de la plateforme ne saurait être engagée en cas de litige entre un candidat et une entreprise.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
