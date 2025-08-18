import React, { useState } from 'react';

export const PatientForm = ({ onAddPatient, patientToEdit, onUpdatePatient }) => {
  const initialPatientState = {
    nombre: '', dni: '', grado: '', edad: '', sexo: '', promocion: '', anioIngreso: '', tiempoInstitucion: '',
    direccionPerteneces: '', asignacion: '', lugarAsignacion: '', dondeVive: '', celular: '',
    diagnostico: '', fechaIngreso: '', motivoIngreso: '', accidenteDetalles: '',
    quienTraslado: '', hospital: '', sala: '', cama: '',
    familiarNombre: '', familiarParentesco: '', familiarCelular: '',
    visitas: [], // Array para almacenar múltiples visitas
    status: 'interno',
    fechaAlta: '', observacionesAlta: '', diasIncapacidad: ''
  };

  const [patient, setPatient] = useState(patientToEdit || initialPatientState);
  const [newVisita, setNewVisita] = useState({
    visitaNombre: '', visitaGrado: '', visitaDireccion: '', acompanantes: '', fechaVisita: '', notas: '', imagenesVisita: []
  });

  React.useEffect(() => {
    setPatient(patientToEdit || initialPatientState);
  }, [patientToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleVisitaChange = (e) => {
    const { name, value } = e.target;
    setNewVisita(prev => ({ ...prev, [name]: value }));
  };

  const handleVisitaImageChange = (e) => {
    setNewVisita(prev => ({ 
      ...prev, 
      imagenesVisita: [...(prev.imagenesVisita || []), ...Array.from(e.target.files)] 
    }));
  };

  const addVisita = () => {
    if (newVisita.visitaNombre && newVisita.fechaVisita) {
      setPatient(prev => ({
        ...prev,
        visitas: [...(prev.visitas || []), { ...newVisita, id: Date.now() }]
      }));
      setNewVisita({
        visitaNombre: '', visitaGrado: '', visitaDireccion: '', acompanantes: '', fechaVisita: '', notas: '', imagenesVisita: []
      });
    } else {
      alert('Por favor, completa al menos el nombre y la fecha de la visita.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Preparar datos del paciente con las visitas incluidas
    const pacientData = {
      ...patient,
      visitas: patient.visitas || []
    };
    
    if (patientToEdit) {
      onUpdatePatient(pacientData);
    } else {
      onAddPatient({ ...pacientData, id: Date.now() });
    }
    setPatient(initialPatientState); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-4">
        {patientToEdit ? 'Editar Paciente' : 'Registro de Nuevo Paciente'}
      </h2>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos Generales del Paciente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" name="nombre" value={patient.nombre} onChange={handleChange} placeholder="Nombre Completo" className="input-field" required />
          <input type="text" name="dni" value={patient.dni} onChange={handleChange} placeholder="DNI" className="input-field" required />
          <input type="text" name="grado" value={patient.grado} onChange={handleChange} placeholder="Grado" className="input-field" />
          <input type="number" name="edad" value={patient.edad} onChange={handleChange} placeholder="Edad" className="input-field" />
          <select name="sexo" value={patient.sexo} onChange={handleChange} className="input-field">
            <option value="">Seleccionar Sexo</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
          <input type="text" name="promocion" value={patient.promocion} onChange={handleChange} placeholder="Promoción" className="input-field" />
          <input type="number" name="anioIngreso" value={patient.anioIngreso} onChange={handleChange} placeholder="Año de Ingreso" className="input-field" />
          <input type="text" name="tiempoInstitucion" value={patient.tiempoInstitucion} onChange={handleChange} placeholder="Tiempo en la Institución" className="input-field" />
          <input type="text" name="direccionPerteneces" value={patient.direccionPerteneces} onChange={handleChange} placeholder="Dirección a la que pertenece" className="input-field" />
          <input type="text" name="asignacion" value={patient.asignacion} onChange={handleChange} placeholder="Asignación" className="input-field" />
          <input type="text" name="lugarAsignacion" value={patient.lugarAsignacion} onChange={handleChange} placeholder="Lugar de Asignación" className="input-field" />
          <input type="text" name="dondeVive" value={patient.dondeVive} onChange={handleChange} placeholder="Lugar donde vive" className="input-field" />
          <input type="text" name="celular" value={patient.celular} onChange={handleChange} placeholder="Celular" className="input-field" />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Médica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" name="diagnostico" value={patient.diagnostico} onChange={handleChange} placeholder="Diagnóstico" className="input-field" />
          <input type="date" name="fechaIngreso" value={patient.fechaIngreso} onChange={handleChange} placeholder="Fecha de Ingreso" className="input-field" />
          <select name="motivoIngreso" value={patient.motivoIngreso} onChange={handleChange} className="input-field">
            <option value="">Motivo de Ingreso</option>
            <option value="enfermedad_natural">Enfermedad Natural</option>
            <option value="accidente_transito">Accidente de Tránsito</option>
            <option value="accidente_laboral">Accidente Laboral</option>
            <option value="otro_incidente">Otro Incidente</option>
          </select>
          <textarea name="accidenteDetalles" value={patient.accidenteDetalles} onChange={handleChange} placeholder="Detalles del accidente/incidente" className="input-field col-span-full resize-y min-h-[80px]"></textarea>
          <input type="text" name="quienTraslado" value={patient.quienTraslado} onChange={handleChange} placeholder="Quién lo trasladó al centro asistencial" className="input-field" />
          <input type="text" name="hospital" value={patient.hospital} onChange={handleChange} placeholder="Nombre del Hospital" className="input-field" />
          <input type="text" name="sala" value={patient.sala} onChange={handleChange} placeholder="Sala" className="input-field" />
          <input type="text" name="cama" value={patient.cama} onChange={handleChange} placeholder="Cama" className="input-field" />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Familiar</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="familiarNombre" value={patient.familiarNombre} onChange={handleChange} placeholder="Nombre Familiar" className="input-field" />
          <input type="text" name="familiarParentesco" value={patient.familiarParentesco} onChange={handleChange} placeholder="Parentesco" className="input-field" />
          <input type="text" name="familiarCelular" value={patient.familiarCelular} onChange={handleChange} placeholder="Celular Familiar" className="input-field" />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado y Información de Alta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select name="status" value={patient.status} onChange={handleChange} className="input-field">
            <option value="interno">Interno (Hospitalizado)</option>
            <option value="alta">Dado de Alta</option>
            <option value="transferido">Transferido</option>
            <option value="referido">Referido</option>
          </select>
          
          {patient.status === 'alta' && (
            <>
              <input 
                type="date" 
                name="fechaAlta" 
                value={patient.fechaAlta} 
                onChange={handleChange} 
                placeholder="Fecha de Alta" 
                className="input-field" 
              />
              <input 
                type="number" 
                name="diasIncapacidad" 
                value={patient.diasIncapacidad} 
                onChange={handleChange} 
                placeholder="Días de Incapacidad" 
                className="input-field" 
              />
              <textarea 
                name="observacionesAlta" 
                value={patient.observacionesAlta} 
                onChange={handleChange} 
                placeholder="Observaciones del Alta" 
                className="input-field col-span-full" 
                rows="2"
              />
            </>
          )}
        </div>
        
        {patient.status === 'alta' && (patient.fechaAlta || patient.observacionesAlta || patient.diasIncapacidad) && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-md font-semibold text-green-800 mb-2">📋 Información de Alta Registrada</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {patient.fechaAlta && (
                <div>
                  <span className="font-medium text-green-700">Fecha de Alta:</span>
                  <p className="text-green-900">{new Date(patient.fechaAlta).toLocaleDateString()}</p>
                </div>
              )}
              {patient.diasIncapacidad && (
                <div>
                  <span className="font-medium text-green-700">Días de Incapacidad:</span>
                  <p className="text-green-900">{patient.diasIncapacidad} días</p>
                </div>
              )}
              {patient.observacionesAlta && (
                <div className="md:col-span-3">
                  <span className="font-medium text-green-700">Observaciones:</span>
                  <p className="text-green-900">{patient.observacionesAlta}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Registro de Visitas</h3>
        <div className="space-y-4 mb-4">
          {(patient.visitas || []).map((visita, index) => (
            <div key={visita.id || index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="font-medium">Visita #{index + 1} - {visita.fechaVisita}</p>
              <p className="text-sm text-gray-700">Visitante: {visita.visitaNombre} ({visita.visitaGrado})</p>
              <p className="text-sm text-gray-700">Acompañantes: {visita.acompanantes}</p>
              <p className="text-sm text-gray-700">Notas: {visita.notas}</p>
              {visita.imagenesVisita && visita.imagenesVisita.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {visita.imagenesVisita.map((img, imgIdx) => (
                    <img key={imgIdx} src={URL.createObjectURL(img)} alt={`Visita ${index + 1} - Imagen ${imgIdx + 1}`} className="w-full h-24 object-cover rounded-md" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" name="visitaNombre" value={newVisita.visitaNombre} onChange={handleVisitaChange} placeholder="Nombre de quien visita" className="input-field" />
          <input type="text" name="visitaGrado" value={newVisita.visitaGrado} onChange={handleVisitaChange} placeholder="Grado de quien visita" className="input-field" />
          <input type="text" name="visitaDireccion" value={newVisita.visitaDireccion} onChange={handleVisitaChange} placeholder="Dirección de quien visita" className="input-field" />
          <input type="text" name="acompanantes" value={newVisita.acompanantes} onChange={handleVisitaChange} placeholder="Nombres de acompañantes" className="input-field" />
          <input type="date" name="fechaVisita" value={newVisita.fechaVisita} onChange={handleVisitaChange} placeholder="Fecha de la visita" className="input-field" />
          <textarea name="notas" value={newVisita.notas} onChange={handleVisitaChange} placeholder="Notas de la visita" className="input-field col-span-full resize-y min-h-[80px]"></textarea>
          <div className="col-span-full">
            <label htmlFor="imagenesVisita" className="block text-sm font-medium text-gray-700 mb-1">Adjuntar Imágenes de Visita</label>
            <input type="file" name="imagenesVisita" id="imagenesVisita" onChange={handleVisitaImageChange} multiple className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
        </div>
        <button type="button" onClick={addVisita} className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold shadow-md">
          Agregar Nueva Visita
        </button>
      </section>

      <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg shadow-md">
        {patientToEdit ? 'Actualizar Paciente' : 'Registrar Paciente'}
      </button>
    </form>
  );
};