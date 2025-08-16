import React from 'react';

export const FallecidosList = ({ patients }) => {
  const fallecidos = patients.filter(p => p.status === 'fallecido');

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Información de Fallecidos (Pacientes)</h2>
      {fallecidos.length === 0 ? (
        <p className="text-gray-600 text-center py-4">No hay pacientes registrados como fallecidos en la bitácora general.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fallecidos.map(patient => (
            <div key={patient.id} className="bg-red-50 p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <h3 className="font-semibold text-red-800 text-lg mb-2">{patient.nombre}</h3>
              <p className="text-sm text-gray-700"><strong>DNI:</strong> {patient.dni}</p>
              <p className="text-sm text-gray-700"><strong>Diagnóstico:</strong> {patient.diagnostico}</p>
              <p className="text-sm text-gray-700"><strong>Fecha Ingreso:</strong> {patient.fechaIngreso}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};