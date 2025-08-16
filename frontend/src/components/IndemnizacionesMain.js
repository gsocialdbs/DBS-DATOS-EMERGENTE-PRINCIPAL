import React, { useState } from 'react';
import { IndemnizacionForm } from './IndemnizacionForm';
import { IndemnizacionList } from './IndemnizacionList';
import { IndemnizacionReportes } from './IndemnizacionReportes';

export const IndemnizacionesMain = ({ indemnizaciones, onAddIndemnizacion, onDeleteIndemnizacion, onUpdateIndemnizacion }) => {
  const [indemnizacionesTab, setIndemnizacionesTab] = useState('listado'); // 'listado', 'ingreso', 'reportes'
  const [indemnizacionToEdit, setIndemnizacionToEdit] = useState(null);

  const handleEditIndemnizacion = (indemnizacion) => {
    setIndemnizacionToEdit(indemnizacion);
    setIndemnizacionesTab('ingreso');
  };

  const handleUpdateIndemnizacion = (updatedIndemnizacion) => {
    onUpdateIndemnizacion(updatedIndemnizacion);
    setIndemnizacionToEdit(null);
    setIndemnizacionesTab('listado');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Indemnizaciones por Pérdida de Extremidad</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => { setIndemnizacionesTab('listado'); setIndemnizacionToEdit(null); }}
          className={`px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 ${
            indemnizacionesTab === 'listado' ? 'bg-yellow-600 text-white' : 'bg-white text-yellow-700 hover:bg-yellow-50 border border-yellow-600'
          }`}
        >
          Listado de Indemnizaciones
        </button>
        <button
          onClick={() => { setIndemnizacionesTab('ingreso'); setIndemnizacionToEdit(null); }}
          className={`px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 ${
            indemnizacionesTab === 'ingreso' ? 'bg-yellow-600 text-white' : 'bg-white text-yellow-700 hover:bg-yellow-50 border border-yellow-600'
          }`}
        >
          Ingreso de Indemnización
        </button>
        <button
          onClick={() => { setIndemnizacionesTab('reportes'); setIndemnizacionToEdit(null); }}
          className={`px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 ${
            indemnizacionesTab === 'reportes' ? 'bg-yellow-600 text-white' : 'bg-white text-yellow-700 hover:bg-yellow-50 border border-yellow-600'
          }`}
        >
          Reportes de Indemnizaciones
        </button>
      </div>

      {indemnizacionesTab === 'listado' && (
        <IndemnizacionList
          indemnizaciones={indemnizaciones}
          onDeleteIndemnizacion={onDeleteIndemnizacion}
          onEditIndemnizacion={handleEditIndemnizacion}
        />
      )}
      {indemnizacionesTab === 'ingreso' && (
        <IndemnizacionForm
          onAddIndemnizacion={onAddIndemnizacion}
          indemnizacionToEdit={indemnizacionToEdit}
          onUpdateIndemnizacion={handleUpdateIndemnizacion}
        />
      )}
      {indemnizacionesTab === 'reportes' && <IndemnizacionReportes indemnizaciones={indemnizaciones} />}
    </div>
  );
};