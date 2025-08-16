import React, { useState } from 'react';

export const IndemnizacionList = ({ indemnizaciones, onDeleteIndemnizacion, onEditIndemnizacion }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipoIncidente, setFilterTipoIncidente] = useState('todos');

  const tiposIncidente = [
    "En cumplimiento del deber",
    "En franquicia",
    "Fin de semana",
    "Por enfermedad crónica degenerativa"
  ];

  const filteredIndemnizaciones = indemnizaciones.filter(indemnizacion => {
    const matchesSearch = indemnizacion.funcionarioPolicial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          indemnizacion.grado.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipoIncidente = filterTipoIncidente === 'todos' || indemnizacion.tipoIncidente === filterTipoIncidente;
    return matchesSearch && matchesTipoIncidente;
  });

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Listado de Indemnizaciones</h2>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar por funcionario o grado..."
          className="input-field flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterTipoIncidente}
          onChange={(e) => setFilterTipoIncidente(e.target.value)}
          className="input-field md:w-auto"
        >
          <option value="todos">Todos los Tipos de Incidente</option>
          {tiposIncidente.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Funcionario</th>
              <th className="table-header">Grado</th>
              <th className="table-header">Causa Indemnización</th>
              <th className="table-header">Miembro Amputado</th>
              <th className="table-header">Suma a Pagar</th>
              <th className="table-header">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredIndemnizaciones.map(indemnizacion => (
              <tr key={indemnizacion.id} className="hover:bg-gray-50 transition-colors">
                <td className="table-cell font-medium text-gray-900">{indemnizacion.funcionarioPolicial}</td>
                <td className="table-cell text-gray-700">{indemnizacion.grado}</td>
                <td className="table-cell text-gray-700">{indemnizacion.causaIndemnizacion}</td>
                <td className="table-cell text-gray-700">{indemnizacion.miembroAmputado || 'N/A'}</td>
                <td className="table-cell text-gray-700">L. {indemnizacion.sumaPagar}</td>
                <td className="table-cell">
                  <button
                    onClick={() => alert(JSON.stringify(indemnizacion, null, 2))} // Mostrar detalles completos
                    className="text-blue-600 hover:text-blue-800 transition-colors mr-3 font-medium"
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => onEditIndemnizacion(indemnizacion)}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors mr-3 font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteIndemnizacion(indemnizacion.id)}
                    className="text-red-600 hover:text-red-800 transition-colors font-medium"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};