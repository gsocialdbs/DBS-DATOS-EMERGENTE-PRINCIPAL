import React from 'react';
import { generateReport, printContent, downloadExcel } from '../utils/helpers';

export const IndemnizacionReportes = ({ indemnizaciones }) => {
  const totalIndemnizaciones = indemnizaciones.length;
  const sumaTotalPagar = indemnizaciones.reduce((sum, curr) => sum + parseFloat(curr.sumaPagar || 0), 0);

  const porTipoIncidente = indemnizaciones.reduce((acc, curr) => {
    acc[curr.tipoIncidente] = (acc[curr.tipoIncidente] || 0) + 1;
    return acc;
  }, {});

  const generateChart = () => {
    const labels = Object.keys(porTipoIncidente);
    const data = Object.values(porTipoIncidente);
    
    let chartString = "Gráfica de Indemnizaciones por Tipo de Incidente:\n\n";
    labels.forEach((label, index) => {
      chartString += `${label}: ${data[index]} (${'█'.repeat(Math.floor(data[index] / Math.max(...data) * 20))})\n`;
    });
    alert(chartString);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Reportes de Indemnizaciones</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="report-card bg-yellow-50 border-yellow-500">
          <h3 className="font-semibold text-yellow-800 text-lg">Total de Indemnizaciones Registradas</h3>
          <p className="text-4xl font-extrabold text-yellow-900">{totalIndemnizaciones}</p>
          <button
            onClick={() => alert(generateReport(indemnizaciones, 'Indemnizaciones Registradas'))}
            className="report-button bg-yellow-600 hover:bg-yellow-700 shadow-md"
          >
            Ver Reporte
          </button>
        </div>
        <div className="report-card bg-blue-50 border-blue-500">
          <h3 className="font-semibold text-blue-800 text-lg">Suma Total a Pagar</h3>
          <p className="text-4xl font-extrabold text-blue-900">L. {sumaTotalPagar.toFixed(2)}</p>
          <button
            onClick={() => alert(`Suma Total a Pagar: L. ${sumaTotalPagar.toFixed(2)}`)}
            className="report-button bg-blue-600 hover:bg-blue-700 shadow-md"
          >
            Ver Detalle
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4 justify-center">
        <button
          onClick={generateChart}
          className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg shadow-md"
        >
          Generar Gráfica por Tipo de Incidente
        </button>
        <button
          onClick={() => downloadExcel(indemnizaciones, 'reporte_indemnizaciones')}
          className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-lg shadow-md"
        >
          Descargar en Excel
        </button>
        <button
          onClick={() => printContent('indemnizaciones-list-to-print')}
          className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg shadow-md"
        >
          Imprimir Listado
        </button>
        <div id="indemnizaciones-list-to-print" className="hidden p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Reporte de Indemnizaciones</h2>
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="table-header py-3">Funcionario</th>
                <th className="table-header py-3">Grado</th>
                <th className="table-header py-3">Causa</th>
                <th className="table-header py-3">Miembro</th>
                <th className="table-header py-3">Suma a Pagar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {indemnizaciones.map(i => (
                <tr key={i.id}>
                  <td className="table-cell py-2">{i.funcionarioPolicial}</td>
                  <td className="table-cell py-2">{i.grado}</td>
                  <td className="table-cell py-2">{i.causaIndemnizacion}</td>
                  <td className="table-cell py-2">{i.miembroAmputado || 'N/A'}</td>
                  <td className="table-cell py-2">L. {i.sumaPagar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};