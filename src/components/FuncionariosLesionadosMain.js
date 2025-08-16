import React, { useState, useEffect } from 'react';
import { FuncionarioLesionadoForm } from './FuncionarioLesionadoForm';
import { FuncionarioLesionadoList } from './FuncionarioLesionadoList';
import { FuncionarioLesionadoReportes } from './FuncionarioLesionadoReportes';

export const FuncionariosLesionadosMain = ({ patients, funcionariosLesionados, onAddFuncionarioLesionado, onDeleteFuncionarioLesionado }) => {
  const [funcionariosTab, setFuncionariosTab] = useState('registro'); // 'registro', 'listado', 'reportes'

  // Migrar pacientes de la bitácora general que son funcionarios lesionados
  useEffect(() => {
    const newLesionados = patients.filter(
      p => p.motivoIngreso === 'accidente_laboral' && p.grado && 
           !funcionariosLesionados.some(fl => fl.dni === p.dni) // Evitar duplicados
    );
    newLesionados.forEach(fl => {
      onAddFuncionarioLesionado({
        dni: fl.dni,
        nombre: fl.nombre,
        grado: fl.grado,
        edad: fl.edad,
        sexo: fl.sexo,
        promocion: fl.promocion,
        anioIngreso: fl.anioIngreso,
        tiempoInstitucion: fl.tiempoInstitucion,
        direccionPerteneces: fl.direccionPerteneces,
        asignacion: fl.asignacion,
        lugarAsignacion: fl.lugarAsignacion,
        dondeVive: fl.dondeVive,
        celular: fl.celular,
        tipoIncidente: fl.accidenteDetalles, // Usamos accidenteDetalles como tipoIncidente si viene de bitácora
        diagnostico: fl.diagnostico,
        fechaIngreso: fl.fechaIngreso,
        hospitalTraslado: fl.hospital,
        observacionesLesion: fl.accidenteDetalles,
        gastos: [], // Inicialmente sin gastos
        totalGastos: 0,
        migradoDeBitacora: true, // Para identificar que viene de la bitácora
        id: Date.now() + Math.random() // Generar un ID único
      });
    });
  }, [patients]); // Solo se ejecuta cuando cambia la lista de pacientes

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Funcionarios Lesionados</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setFuncionariosTab('registro')}
          className={`px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 ${
            funcionariosTab === 'registro' ? 'bg-green-600 text-white' : 'bg-white text-green-700 hover:bg-green-50 border border-green-600'
          }`}
        >
          Registro de Lesionado
        </button>
        <button
          onClick={() => setFuncionariosTab('listado')}
          className={`px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 ${
            funcionariosTab === 'listado' ? 'bg-green-600 text-white' : 'bg-white text-green-700 hover:bg-green-50 border border-green-600'
          }`}
        >
          Listado de Lesionados
        </button>
        <button
          onClick={() => setFuncionariosTab('reportes')}
          className={`px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 ${
            funcionariosTab === 'reportes' ? 'bg-green-600 text-white' : 'bg-white text-green-700 hover:bg-green-50 border border-green-600'
          }`}
        >
          Reportes de Lesionados
        </button>
      </div>

      {funcionariosTab === 'registro' && <FuncionarioLesionadoForm onAddFuncionarioLesionado={onAddFuncionarioLesionado} />}
      {funcionariosTab === 'listado' && <FuncionarioLesionadoList funcionariosLesionados={funcionariosLesionados} onDeleteFuncionarioLesionado={onDeleteFuncionarioLesionado} />}
      {funcionariosTab === 'reportes' && <FuncionarioLesionadoReportes funcionariosLesionados={funcionariosLesionados} />}
    </div>
  );
};