import React from 'react';

export const LayoutHeader = ({ onTabChange }) => (
  <header className="bg-white shadow-sm border-b border-gray-200">
    <div className="container mx-auto px-4 py-4">
      {/* Header Institucional */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-6 mb-4">
          {/* Logo Secretaría de Seguridad */}
          <div className="flex flex-col items-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_db-project-setup/artifacts/82f7ociq_images%20%281%29.png" 
              alt="Secretaría de Seguridad de Honduras"
              className="w-16 h-16 object-contain"
            />
            <p className="text-xs text-gray-500 mt-1">Secretaría de Seguridad</p>
          </div>
          
          {/* Logo Principal DBS */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-full flex items-center justify-center shadow-xl border-4 border-yellow-400">
              <span className="text-xl font-bold text-white">DBS</span>
            </div>
            <p className="text-sm text-blue-600 font-semibold mt-2">Sistema Oficial</p>
          </div>
          
          {/* Logo Dirección de Bienestar Social */}
          <div className="flex flex-col items-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_db-project-setup/artifacts/1tr9xbrj_images.png" 
              alt="Dirección de Bienestar Social"
              className="w-16 h-16 object-contain"
            />
            <p className="text-xs text-gray-500 mt-1">Dirección de Bienestar</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-4 rounded-xl shadow-lg border border-yellow-400">
          <h1 className="text-2xl font-bold mb-2 text-white">
            POLICÍA NACIONAL DE HONDURAS
          </h1>
          <h2 className="text-lg font-semibold mb-2 text-yellow-300">
            DIRECCIÓN DE BIENESTAR SOCIAL
          </h2>
          <p className="text-blue-100 text-base">
            Sistema Integral de Gestión de Bienestar Policial
          </p>
          <div className="flex justify-center gap-3 mt-3 text-sm text-blue-200">
            <span>📋 Bitácora Médica</span>
            <span>⚕️ Funcionarios Lesionados</span>
            <span>💀 Registro de Fallecidos</span>
            <span>💰 Indemnizaciones</span>
          </div>
        </div>
      </div>
      
      <nav className="flex flex-wrap justify-center md:justify-start space-x-2 md:space-x-4 sticky top-0 bg-white py-2 z-40 border-t border-gray-200">
        <button
          onClick={() => onTabChange('bitacora')}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
        >
          Bitácora de Pacientes
        </button>
        <button
          onClick={() => onTabChange('funcionarios')}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
        >
          Funcionarios Lesionados
        </button>
        <button
          onClick={() => onTabChange('fallecidos')}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
        >
          Información de Fallecidos
        </button>
        <button
          onClick={() => onTabChange('indemnizaciones')}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
        >
          Indemnizaciones
        </button>
      </nav>
    </div>
  </header>
);