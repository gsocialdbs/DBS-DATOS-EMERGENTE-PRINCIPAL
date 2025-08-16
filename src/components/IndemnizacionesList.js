import React from 'react';

export const IndemnizacionesList = ({ patients }) => {
  // Este componente ya no se usará directamente, la lógica de listado estará en IndemnizacionList
  // Pero lo mantengo para evitar errores si aún se referencia en algún lado.
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Indemnizaciones (Bitácora General)</h2>
      <p className="text-gray-600 text-center py-4">
        Esta sección ahora se gestiona en el apartado "Indemnizaciones" del menú principal.
      </p>
    </div>
  );
};