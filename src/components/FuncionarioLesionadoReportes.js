import React from 'react';
import { generateReport, printContent, downloadExcel } from '../utils/helpers';

export const FuncionarioLesionadoReportes = ({ funcionariosLesionados }) => {
  const totalFuncionarios = funcionariosLesionados.length;
  const totalGastosGlobal = funcionariosLesionados.reduce((sum, f) => sum + f.totalGastos, 0);

  const gastosPorHospital = funcionariosLesionados.reduce((acc, curr) => {
    acc[curr.hospitalTraslado] = (acc[curr.hospitalTraslado] || 0) + curr.totalGastos;
    return acc;
  }, {});

  const generateChart = () => {
    const labels = Object.keys(gastosPorHospital);
    const data = Object.values(gastosPorHospital);
    
    let chartString = "Gráfica de Gastos por Hospital:\n\n";
    labels.forEach((label, index) => {
      chartString += `${label}: L. ${data[index].toFixed(2)} (${'█'.repeat(Math.floor(data[index] / Math.max(...data) * 20))})\n`;
    });
    alert(chartString);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Reportes de Funcionarios Lesionados</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="report-card bg-green-50 border-green-500">
          <h3 className="font-semibold text-green-800 text-lg">Total de Funcionarios Lesionados</h3>
          <p className="text-4xl font-extrabold text-green-900">{totalFuncionarios}</p>
          <button
            onClick={() => alert(generateReport(funcionariosLesionados, 'Funcionarios Lesionados'))}
            className="report-button bg-green-600 hover:bg-green-700 shadow-md"
          >
            Ver Reporte
          </button>
        </div>
        <div className="report-card bg-yellow-50 border-yellow-500">
          <h3 className="font-semibold text-yellow-800 text-lg">Total de Gastos Médicos</h3>
          <p className="text-4xl font-extrabold text-yellow-900">L. {totalGastosGlobal.toFixed(2)}</p>
          <button
            onClick={() => alert(`Total de Gastos Médicos: L. ${totalGastosGlobal.toFixed(2)}`)}
            className="report-button bg-yellow-600 hover:bg-yellow-700 shadow-md"
          >
            Ver Detalle
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Gastos Médicos por Hospital</h3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="table-header py-3">Hospital</th>
                <th className="table-header py-3">Total Gastos (L.)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(gastosPorHospital).map(([hospital, total]) => (
                <tr key={hospital}>
                  <td className="table-cell py-2">{hospital}</td>
                  <td className="table-cell py-2">L. {total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => printContent('gastos-por-hospital-print')}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
        >
          Imprimir Reporte por Hospital
        </button>
        <div id="gastos-por-hospital-print" className="hidden p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Reporte de Gastos Médicos por Hospital</h2>
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="table-header py-3">Hospital</th>
                <th className="table-header py-3">Total Gastos (L.)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(gastosPorHospital).map(([hospital, total]) => (
                <tr key={hospital}>
                  <td className="table-cell py-2">{hospital}</td>
                  <td className="table-cell py-2">L. {total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4 justify-center">
        <button
          onClick={generateChart}
          className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg shadow-md"
        >
          Generar Gráfica de Gastos por Hospital
        </button>
        <button
          onClick={() => downloadExcel(funcionariosLesionados, 'reporte_funcionarios_lesionados')}
          className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-lg shadow-md"
        >
          Descargar en Excel
        </button>
        <button
          onClick={() => printContent('funcionarios-lesionados-list-to-print')}
          className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg shadow-md"
        >
          Imprimir Listado General
        </button>
        <div id="funcionarios-lesionados-list-to-print" className="hidden p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Reporte de Funcionarios Lesionados</h2>
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="table-header py-3">DNI</th>
                <th className="table-header py-3">Nombre</th>
                <th className="table-header py-3">Grado</th>
                <th className="table-header py-3">Diagnóstico</th>
                <th className="table-header py-3">Hospital</th>
                <th className="table-header py-3">Total Gastos</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {funcionariosLesionados.map(f => (
                <tr key={f.id}>
                  <td className="table-cell py-2">{f.dni}</td>
                  <td className="table-cell py-2">{f.nombre}</td>
                  <td className="table-cell py-2">{f.grado}</td>
                  <td className="table-cell py-2">{f.diagnostico}</td>
                  <td className="table-cell py-2">{f.hospitalTraslado}</td>
                  <td className="table-cell py-2">L. {f.totalGastos.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};