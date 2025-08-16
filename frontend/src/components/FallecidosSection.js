import React from 'react';

export const FallecidosSection = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Registro de Fallecidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tarjetas de fallecidos */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="font-medium">Nombre del Paciente</h3>
          <p className="text-sm text-gray-600">Fecha: 01/01/2023</p>
          <p className="text-sm text-gray-600">Causa: Cardiovascular</p>
        </div>
      </div>
    </section>
  );
};