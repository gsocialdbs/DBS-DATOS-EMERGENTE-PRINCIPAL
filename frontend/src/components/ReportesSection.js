import React from 'react';
import { generateReport, printContent, downloadExcel } from '../utils/helpers';

export const ReportesSection = ({ patients }) => {
  const internos = patients.filter(p => p.status === 'interno');
  const dadosDeAlta = patients.filter(p => p.status === 'alta');
  const fallecidos = patients.filter(p => p.status === 'fallecido');

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Reportes de Pacientes</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="report-card bg-blue-50 border-blue-500">
          <h3 className="font-semibold text-blue-800 text-lg">Total de Pacientes</h3>
          <p className="text-4xl font-extrabold text-blue-900">{patients.length}</p>
          <button
            onClick={() => alert(generateReport(patients, 'total'))} // Puedes ajustar generateReport para total
            className="report-button bg-blue-600 hover:bg-blue-700 shadow-md"
          >
            Ver Reporte
          </button>
        </div>
        <div className="report-card bg-green-50 border-green-500">
          <h3 className="font-semibold text-green-800 text-lg">Altas Médicas</h3>
          <p className="text-4xl font-extrabold text-green-900">{dadosDeAlta.length}</p>
          <button
            onClick={() => alert(generateReport(patients, 'alta'))}
            className="report-button bg-green-600 hover:bg-green-700 shadow-md"
          >
            Ver Reporte
          </button>
        </div>
        <div className="report-card bg-red-50 border-red-500">
          <h3 className="font-semibold text-red-800 text-lg">Pacientes Internos</h3>
          <p className="text-4xl font-extrabold text-red-900">{internos.length}</p>
          <button
            onClick={() => alert(generateReport(patients, 'interno'))}
            className="report-button bg-red-600 hover:bg-red-700 shadow-md"
          >
            Ver Reporte
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => downloadExcel(patients, 'bitacora_pacientes')}
          className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors font-semibold text-lg shadow-md"
        >
          Descargar en Excel
        </button>
        <button
          onClick={() => printContent('patient-list-to-print')}
          className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg shadow-md"
        >
          Imprimir Listado General
        </button>
        <div id="patient-list-to-print" className="hidden p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Bitácora de Pacientes - Dirección de Bienestar Social</h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Listado General de Pacientes</h3>
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="table-header py-3">Nombre</th>
                <th className="table-header py-3">DNI</th>
                <th className="table-header py-3">Diagnóstico</th>
                <th className="table-header py-3">Estado</th>
                <th className="table-header py-3">Fecha Ingreso</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td className="table-cell py-2">{patient.nombre}</td>
                  <td className="table-cell py-2">{patient.dni}</td>
                  <td className="table-cell py-2">{patient.diagnostico}</td>
                  <td className="table-cell py-2">{patient.status}</td>
                  <td className="table-cell py-2">{patient.fechaIngreso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};