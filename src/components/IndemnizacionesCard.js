import React from 'react';

export const IndemnizacionesCard = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">Indemnizaciones</h2>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Paciente</span>
            <span className="font-medium">Juan Pérez</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Extremidad</span>
            <span className="font-medium">Brazo derecho</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Monto</span>
            <span className="font-medium text-green-600">$15,000</span>
          </div>
        </div>
      </div>
    </div>
  );
};