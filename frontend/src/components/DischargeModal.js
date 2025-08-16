import React, { useState } from 'react';

export const DischargeModal = ({ patient, onClose, onConfirmDischarge }) => {
  const [fechaAlta, setFechaAlta] = useState('');
  const [observacionesAlta, setObservacionesAlta] = useState('');
  const [diasIncapacidad, setDiasIncapacidad] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fechaAlta) {
      alert('La fecha de alta es obligatoria.');
      return;
    }
    onConfirmDischarge(patient.id, { fechaAlta, observacionesAlta, diasIncapacidad });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Dar Alta a {patient.nombre}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fechaAlta" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Alta</label>
            <input
              type="date"
              id="fechaAlta"
              value={fechaAlta}
              onChange={(e) => setFechaAlta(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label htmlFor="observacionesAlta" className="block text-sm font-medium text-gray-700 mb-1">Observaciones del Estado del Paciente</label>
            <textarea
              id="observacionesAlta"
              value={observacionesAlta}
              onChange={(e) => setObservacionesAlta(e.target.value)}
              className="input-field resize-y min-h-[80px]"
            ></textarea>
          </div>
          <div>
            <label htmlFor="diasIncapacidad" className="block text-sm font-medium text-gray-700 mb-1">Días de Incapacidad</label>
            <input
              type="number"
              id="diasIncapacidad"
              value={diasIncapacidad}
              onChange={(e) => setDiasIncapacidad(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
            >
              Confirmar Alta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};