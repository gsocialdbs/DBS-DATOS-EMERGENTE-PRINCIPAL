import React, { useState } from 'react';

export const PatientList = ({ patients, onDeletePatient, onUpdatePatientStatus, onEditPatient, onDischargePatient }) => {
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.dni.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedPatientId(expandedPatientId === id ? null : id);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Listado General de Pacientes</h2>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          className="input-field flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold shadow-md">
          Buscar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Nombre</th>
              <th className="table-header">DNI</th>
              <th className="table-header">Diagnóstico</th>
              <th className="table-header">Estado</th>
              <th className="table-header">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map(patient => (
              <React.Fragment key={patient.id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="table-cell font-medium text-gray-900">{patient.nombre}</td>
                  <td className="table-cell text-gray-700">{patient.dni}</td>
                  <td className="table-cell text-gray-700">{patient.diagnostico}</td>
                  <td className="table-cell">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.status === 'interno' ? 'bg-blue-100 text-blue-800' :
                      patient.status === 'alta' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => toggleExpand(patient.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors mr-3 font-medium"
                    >
                      {expandedPatientId === patient.id ? 'Ver menos' : 'Ver más'}
                    </button>
                    <button
                      onClick={() => onEditPatient(patient)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors mr-3 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDeletePatient(patient.id)}
                      className="text-red-600 hover:text-red-800 transition-colors mr-3 font-medium"
                    >
                      Borrar
                    </button>
                    {patient.status === 'interno' && (
                      <button
                        onClick={() => onDischargePatient(patient.id)}
                        className="text-green-600 hover:text-green-800 transition-colors font-medium"
                      >
                        Dar Alta
                      </button>
                    )}
                  </td>
                </tr>
                {expandedPatientId === patient.id && (
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td colSpan="5" className="px-6 py-4 text-sm text-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                        <p><strong>Grado:</strong> {patient.grado}</p>
                        <p><strong>Edad:</strong> {patient.edad}</p>
                        <p><strong>Sexo:</strong> {patient.sexo}</p>
                        <p><strong>Promoción:</strong> {patient.promocion}</p>
                        <p><strong>Año Ingreso:</strong> {patient.anioIngreso}</p>
                        <p><strong>Tiempo Institución:</strong> {patient.tiempoInstitucion}</p>
                        <p><strong>Dirección Pertenece:</strong> {patient.direccionPerteneces}</p>
                        <p><strong>Asignación:</strong> {patient.asignacion}</p>
                        <p><strong>Lugar Asignación:</strong> {patient.lugarAsignacion}</p>
                        <p><strong>Donde Vive:</strong> {patient.dondeVive}</p>
                        <p><strong>Celular:</strong> {patient.celular}</p>
                        <p><strong>Fecha Ingreso:</strong> {patient.fechaIngreso}</p>
                        <p><strong>Motivo Ingreso:</strong> {patient.motivoIngreso}</p>
                        <p><strong>Detalles Accidente:</strong> {patient.accidenteDetalles}</p>
                        <p><strong>Quién Trasladó:</strong> {patient.quienTraslado}</p>
                        <p><strong>Hospital:</strong> {patient.hospital}</p>
                        <p><strong>Sala:</strong> {patient.sala}</p>
                        <p><strong>Cama:</strong> {patient.cama}</p>
                        <p><strong>Familiar:</strong> {patient.familiarNombre} ({patient.familiarParentesco}) - {patient.familiarCelular}</p>
                        {patient.status === 'alta' && (
                          <>
                            <p><strong>Fecha Alta:</strong> {patient.fechaAlta}</p>
                            <p><strong>Observaciones Alta:</strong> {patient.observacionesAlta}</p>
                            <p><strong>Días Incapacidad:</strong> {patient.diasIncapacidad}</p>
                          </>
                        )}
                        <div className="col-span-full">
                          <h4 className="font-semibold mt-2 mb-1">Historial de Visitas:</h4>
                          {patient.visitas && patient.visitas.length > 0 ? (
                            patient.visitas.map((visita, idx) => (
                              <div key={visita.id || idx} className="bg-gray-100 p-3 rounded-md mb-2 border border-gray-200">
                                <p><strong>Fecha:</strong> {visita.fechaVisita}</p>
                                <p><strong>Visitante:</strong> {visita.visitaNombre} ({visita.visitaGrado})</p>
                                <p><strong>Acompañantes:</strong> {visita.acompanantes}</p>
                                <p><strong>Notas:</strong> {visita.notas}</p>
                                {visita.imagenesVisita && visita.imagenesVisita.length > 0 && (
                                  <div className="mt-2 grid grid-cols-2 gap-2">
                                    {visita.imagenesVisita.map((img, imgIdx) => (
                                      <img key={imgIdx} src={URL.createObjectURL(img)} alt={`Visita ${idx + 1} - Imagen ${imgIdx + 1}`} className="w-full h-24 object-cover rounded-md" />
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <p>No hay visitas registradas.</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};