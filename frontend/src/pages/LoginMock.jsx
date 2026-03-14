import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginMock = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-indigo-900">
          Numeric'Emploi
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">Module de Job Matching (Interopérable)</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <p className="text-gray-500 mb-6 text-center text-sm">Choisissez un rôle pour tester le parcours (Prototype Visuel) :</p>
          
          <div className="space-y-4">
            <button onClick={() => navigate('/dashboard/superadmin')} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none">
              💻 Me connecter en Super Admin
            </button>
            
            <button onClick={() => navigate('/dashboard/advisor')} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
              👩‍💼 Me connecter en Conseiller Régional
            </button>

            <button onClick={() => navigate('/dashboard/recruiter')} className="w-full flex justify-center py-3 px-4 border border-indigo-200 rounded-md shadow-sm text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none">
              🏢 Me connecter en Entreprise / Recruteur
            </button>
            
            <button onClick={() => navigate('/dashboard/candidat')} className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
              👤 Me connecter en Candidat (Niv. 1 ou 2)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginMock;
