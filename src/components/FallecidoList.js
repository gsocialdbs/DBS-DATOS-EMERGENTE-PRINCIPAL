import React, { useState } from 'react';

export const FallecidoList = ({ fallecidos, onDeleteFallecido }) => {
  const [filterStatus, setFilterStatus] = useState('todos'); // 'todos', 'enviado_aseguradora', 'falta_documentacion', 'problemas_legales'
  const [filterCausaMuerte, setFilterCausaMuerte] = useState('todos');
  const [filterYear, setFilterYear] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const causasMuerte = [
    "HOMICIDIO (Cumplimiento del deber)", "HOMICIDIO (Fin de semana)", "HOMICIDIO (Franquicia)",
    "ACCIDENTE DE TRANSITO EN MOTOCICLETA. (Cumplimiento del deber)", "ACCIDENTE DE TRANSITO EN MOTOCICLETA. (Fin de semana)",
    "CAIDA DE VEHICULO (Cumplimiento del deber)", "ACCIDENTE EN VEHICULO (Fin de semana)",
    "MUERTE POR SUMERSION (Cumplimento del deber)", "SUICIDIO", "MUERTE NATURAL", "MUERTE COVID",
    "ACCIDENTE TIPO ATROPELLO (FIN DE SEMANA)", "PROCESO DE INVESTIGACIÓN"
  ];

  const availableYears = [...new Set(fallecidos.map(f => new Date(f.fechaMuerte).getFullYear()))].sort((a, b) => b - a);

  const filteredFallecidos = fallecidos.filter(fallecido => {
    const matchesStatus = filterStatus === 'todos' || fallecido.estadoExpediente === filterStatus;
    const matchesCausaMuerte = filterCausaMuerte === 'todos' || fallecido.causaMuerte === filterCausaMuerte;
    const matchesYear = filterYear === 'todos' || new Date(fallecido.fechaMuerte).getFullYear().toString() === filterYear;
    const matchesSearch = fallecido.policiaFallecido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fallecido.noExpediente.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCausaMuerte && matchesYear && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'falta_documentacion': return 'bg-red-100 text-red-800';
      case 'problemas_legales': return 'bg-yellow-100 text-yellow-800';
      case 'enviado_aseguradora': return 'bg-blue-100 text-blue-800';
      case 'pagado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Listado de Siniestros (Fallecidos)</h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar por nombre o No. Expediente..."
          className="input-field"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field"
        >
          <option value="todos">Todos los Estados</option>
          <option value="enviado_aseguradora">Enviado para Aseguradora</option>
          <option value="falta_documentacion">Pendientes de Documentación</option>
          <option value="problemas_legales">Con Problemas Legales</option>
          <option value="pagado">Pagados</option>
        </select>
        <select
          value={filterCausaMuerte}
          onChange={(e) => setFilterCausaMuerte(e.target.value)}
          className="input-field"
        >
          <option value="todos">Todas las Causas de Muerte</option>
          {causasMuerte.map(causa => (
            <option key={causa} value={causa}>{causa}</option>
          ))}
        </select>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="input-field"
        >
          <option value="todos">Todos los Años</option>
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">No. Expediente</th>
              <th className="table-header">Policía Fallecido</th>
              <th className="table-header">Causa de Muerte</th>
              <th className="table-header">Aseguradora</th>
              <th className="table-header">Estado</th>
              <th className="table-header">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFallecidos.map(fallecido => (
              <tr key={fallecido.id} className="hover:bg-gray-50 transition-colors">
                <td className="table-cell font-medium text-gray-900">{fallecido.noExpediente}</td>
                <td className="table-cell text-gray-700">{fallecido.policiaFallecido}</td>
                <td className="table-cell text-gray-700">{fallecido.causaMuerte}</td>
                <td className="table-cell text-gray-700">{fallecido.nombreAseguradora}</td>
                <td className="table-cell">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(fallecido.estadoExpediente)}`}>
                    {fallecido.estadoExpediente.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="table-cell">
                  <button
                    onClick={() => alert(JSON.stringify(fallecido, null, 2))} // Mostrar detalles completos
                    className="text-blue-600 hover:text-blue-800 transition-colors mr-3 font-medium"
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => onDeleteFallecido(fallecido.id)}
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