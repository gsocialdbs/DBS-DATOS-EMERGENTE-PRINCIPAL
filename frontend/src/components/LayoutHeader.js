import React from 'react';

export const LayoutHeader = ({ onTabChange }) => (
  <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
    <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900 text-center md:text-left mb-2 md:mb-0">
        Dirección de Bienestar Social
      </h1>
      <nav className="flex flex-wrap justify-center md:justify-start space-x-2 md:space-x-4">
        <button
          onClick={() => onTabChange('bitacora')}
          className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
        >
          Bitácora de Pacientes
        </button>
        <button
          onClick={() => onTabChange('funcionarios')}
          className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors text-sm font-medium shadow-md"
        >
          Funcionarios Lesionados
        </button>
        <button
          onClick={() => onTabChange('fallecidos')}
          className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium shadow-md"
        >
          Información de Fallecidos
        </button>
        <button
          onClick={() => onTabChange('indemnizaciones')}
          className="px-4 py-2 rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 transition-colors text-sm font-medium shadow-md"
        >
          Indemnizaciones
        </button>
      </nav>
    </div>
  </header>
);