import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans pb-20">
      <nav className="p-8">
        <Link to="/" className="text-numeric-orange font-black tracking-tighter hover:text-white transition">← RETOUR ACCUEIL</Link>
      </nav>
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-display font-black italic tracking-tighter mb-4 text-white">Politique de <span className="text-numeric-orange">Confidentialité</span></h1>
        <div className="inline-block px-4 py-2 bg-numeric-orange/10 border border-numeric-orange/20 rounded-full mb-12">
           <span className="text-[10px] font-black uppercase text-numeric-orange tracking-widest">Conformité RGPD / Souveraineté des données</span>
        </div>

        <div className="space-y-12 text-slate-300 leading-relaxed italic">
          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">1. Données collectées</h2>
            <p>Nous collectons les données strictement nécessaires au matching : Nom, Prénom, Email, Région, et CV (pour les candidats). Pour les entreprises : Raison sociale, SIRET, et informations de contact.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">2. Finalité du traitement</h2>
            <p>Vos données sont utilisées uniquement pour permettre la rencontre entre talents et entreprises au sein du dispositif Numeric'emploi. Aucune donnée n'est revendue à des tiers ou utilisée à des fins publicitaires.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">3. Isolation et Sécurité</h2>
            <p>Conformément aux exigences de souveraineté, les données sont stockées sur des serveurs sécurisés en France. Chaque organisation bénéficie d'une isolation logique de ses données.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">4. Vos droits (Droit à l'oubli)</h2>
            <p>En vertu du RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez supprimer votre compte à tout moment depuis votre tableau de bord, ce qui entraînera l'effacement définitif de toutes vos données personnelles dans un délai de 24h.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
