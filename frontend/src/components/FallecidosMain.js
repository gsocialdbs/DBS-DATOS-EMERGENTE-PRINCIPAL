import React, { useState } from 'react';
import { FallecidoForm } from './FallecidoForm';
import { FallecidoList } from './FallecidoList';
import { FallecidoReportes } from './FallecidoReportes';

export const FallecidosMain = ({ fallecidos, onAddFallecido, onDeleteFallecido }) => {
  const [fallecidosTab, setFallecidosTab] = useState('registro'); // 'registro', 'listado', 'reportes'

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Información de Fallecidos</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setFallecidosTab('registro')}
          className={`px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 ${
            fallecidosTab === 'registro' ? 'bg-red-600 text-white' : 'bg-white text-red-700 hover:bg-red-50 border border-red-600'
          }`}
        >
          Registro de Siniestro
        </button>
        <button
          onClick={() => setFallecidosTab('listado')}
          className={`px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 ${
            fallecidosTab === 'listado' ? 'bg-red-600 text-white' : 'bg-white text-red-700 hover:bg-red-50 border border-red-600'
          }`}
        >
          Listado de Expedientes
        </button>
        <button
          onClick={() => setFallecidosTab('reportes')}
          className={`px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 ${
            fallecidosTab === 'reportes' ? 'bg-red-600 text-white' : 'bg-white text-red-700 hover:bg-red-50 border border-red-600'
          }`}
        >
          Reportes de Fallecidos
        </button>
      </div>

      {fallecidosTab === 'registro' && <FallecidoForm onAddFallecido={onAddFallecido} />}
      {fallecidosTab === 'listado' && <FallecidoList fallecidos={fallecidos} onDeleteFallecido={onDeleteFallecido} />}
      {fallecidosTab === 'reportes' && <FallecidoReportes fallecidos={fallecidos} />}
    </div>
  );
};