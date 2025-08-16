import React from 'react';

export const FuncionariosLesionadosList = ({ patients }) => {
  // Este componente ya no se usará directamente, la lógica de listado estará en FuncionarioLesionadoList
  // Pero lo mantengo para evitar errores si aún se referencia en algún lado.
  // En su lugar, se usará el estado `funcionariosLesionados` directamente.
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Funcionarios Lesionados (Bitácora General)</h2>
      <p className="text-gray-600 text-center py-4">
        Esta sección ahora se gestiona en el apartado "Funcionarios Lesionados" del menú principal.
      </p>
    </div>
  );
};