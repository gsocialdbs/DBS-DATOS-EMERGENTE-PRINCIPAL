import React, { useState } from 'react';
import { PatientForm } from './PatientForm';
import { PatientList } from './PatientList';
import { ReportesSection } from './ReportesSection';
import { DischargeModal } from './DischargeModal';

export const BitacoraMain = ({ patients, onAddPatient, onDeletePatient, onUpdatePatientStatus, onUpdatePatient }) => {
  const [bitacoraTab, setBitacoraTab] = useState('lista'); // 'lista', 'ingreso', 'reportes'
  const [patientToEdit, setPatientToEdit] = useState(null);
  const [patientToDischarge, setPatientToDischarge] = useState(null);

  const handleEditPatient = (patient) => {
    setPatientToEdit(patient);
    setBitacoraTab('ingreso');
  };

  const handleUpdatePatient = (updatedPatient) => {
    onUpdatePatient(updatedPatient);
    setPatientToEdit(null);
    setBitacoraTab('lista');
  };

  const handleDischargePatient = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setPatientToDischarge(patient);
    }
  };

  const confirmDischarge = (patientId, dischargeInfo) => {
    onUpdatePatientStatus(patientId, 'alta', dischargeInfo);
    setPatientToDischarge(null);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Bitácora de Pacientes</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => { setBitacoraTab('lista'); setPatientToEdit(null); }}
          className={`px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 ${
            bitacoraTab === 'lista' ? 'bg-teal-600 text-white' : 'bg-white text-teal-700 hover:bg-teal-50 border border-teal-600'
          }`}
        >
          Listado de Pacientes
        </button>
        <button
          onClick={() => { setBitacoraTab('ingreso'); setPatientToEdit(null); }}
          className={`px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 ${
            bitacoraTab === 'ingreso' ? 'bg-teal-600 text-white' : 'bg-white text-teal-700 hover:bg-teal-50 border border-teal-600'
          }`}
        >
          Ingreso de Paciente Nuevo
        </button>
        <button
          onClick={() => { setBitacoraTab('reportes'); setPatientToEdit(null); }}
          className={`px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300 ${
            bitacoraTab === 'reportes' ? 'bg-teal-600 text-white' : 'bg-white text-teal-700 hover:bg-teal-50 border border-teal-600'
          }`}
        >
          Reportes
        </button>
      </div>

      {bitacoraTab === 'lista' && (
        <PatientList
          patients={patients}
          onDeletePatient={onDeletePatient}
          onUpdatePatientStatus={onUpdatePatientStatus}
          onEditPatient={handleEditPatient}
          onDischargePatient={handleDischargePatient}
        />
      )}
      {bitacoraTab === 'ingreso' && (
        <PatientForm
          onAddPatient={onAddPatient}
          patientToEdit={patientToEdit}
          onUpdatePatient={handleUpdatePatient}
        />
      )}
      {bitacoraTab === 'reportes' && <ReportesSection patients={patients} />}

      {patientToDischarge && (
        <DischargeModal
          patient={patientToDischarge}
          onClose={() => setPatientToDischarge(null)}
          onConfirmDischarge={confirmDischarge}
        />
      )}
    </div>
  );
};