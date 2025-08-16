import React from 'react';
import { generateReport, printContent, downloadExcel } from '../utils/helpers';

export const FallecidoReportes = ({ fallecidos }) => {
  const totalFallecidos = fallecidos.length;
  const porEstado = fallecidos.reduce((acc, curr) => {
    acc[curr.estadoExpediente] = (acc[curr.estadoExpediente] || 0) + 1;
    return acc;
  }, {});

  const causasMuerteData = fallecidos.reduce((acc, curr) => {
    acc[curr.causaMuerte] = (acc[curr.causaMuerte] || 0) + 1;
    return acc;
  }, {});

  const generateChart = () => {
    const labels = Object.keys(causasMuerteData);
    const data = Object.values(causasMuerteData);
    
    // Simulación de una gráfica simple en texto
    let chartString = "Gráfica de Causas de Muerte:\n\n";
    labels.forEach((label, index) => {
      chartString += `${label}: ${data[index]} (${'█'.repeat(Math.floor(data[index] / Math.max(...data) * 20))})\n`; // Escala a 20 caracteres
    });
    alert(chartString);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Reportes de Fallecidos</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="report-card bg-blue-50 border-blue-500">
          <h3 className="font-semibold text-blue-800 text-lg">Total de Fallecidos Registrados</h3>
          <p className="text-4xl font-extrabold text-blue-900">{totalFallecidos}</p>
          <button
            onClick={() => alert(generateReport(fallecidos, 'Fallecidos Registrados'))}
            className="report-button bg-blue-600 hover:bg-blue-700 shadow-md"
          >
            Ver Reporte
          </button>
        </div>
        {Object.entries(porEstado).map(([estado, count]) => (
          <div key={estado} className="report-card bg-gray-50 border-gray-500">
            <h3 className="font-semibold text-gray-800 text-lg">{estado.replace(/_/g, ' ')}</h3>
            <p className="text-4xl font-extrabold text-gray-900">{count}</p>
            <button
              onClick={() => alert(generateReport(fallecidos.filter(f => f.estadoExpediente === estado), estado.replace(/_/g, ' ')))}
              className="report-button bg-gray-600 hover:bg-gray-700 shadow-md"
            >
              Ver Reporte
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4 justify-center">
        <button
          onClick={generateChart}
          className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg shadow-md"
        >
          Generar Gráfica de Causas
        </button>
        <button
          onClick={() => downloadExcel(fallecidos, 'reporte_fallecidos')}
          className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-lg shadow-md"
        >
          Descargar en Excel
        </button>
        <button
          onClick={() => printContent('fallecidos-list-to-print')}
          className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg shadow-md"
        >
          Imprimir Listado
        </button>
        <div id="fallecidos-list-to-print" className="hidden p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Reporte de Fallecidos</h2>
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="table-header py-3">No. Expediente</th>
                <th className="table-header py-3">Policía Fallecido</th>
                <th className="table-header py-3">Causa de Muerte</th>
                <th className="table-header py-3">Aseguradora</th>
                <th className="table-header py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fallecidos.map(fallecido => (
                <tr key={fallecido.id}>
                  <td className="table-cell py-2">{fallecido.noExpediente}</td>
                  <td className="table-cell py-2">{fallecido.policiaFallecido}</td>
                  <td className="table-cell py-2">{fallecido.causaMuerte}</td>
                  <td className="table-cell py-2">{fallecido.nombreAseguradora}</td>
                  <td className="table-cell py-2">{fallecido.estadoExpediente.replace(/_/g, ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};