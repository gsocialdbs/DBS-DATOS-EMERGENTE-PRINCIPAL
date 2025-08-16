import React, { useState } from 'react';

export const IndemnizacionList = ({ indemnizaciones, onDeleteIndemnizacion, onEditIndemnizacion }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipoIncidente, setFilterTipoIncidente] = useState('todos');
  const [selectedIndemnizacion, setSelectedIndemnizacion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const tiposIncidente = [
    "En cumplimiento del deber",
    "En franquicia",
    "Fin de semana",
    "Por enfermedad crónica degenerativa"
  ];

  const filteredIndemnizaciones = indemnizaciones.filter(indemnizacion => {
    // Proteger contra campos undefined/null con valores por defecto
    const funcionarioPolicial = indemnizacion.funcionarioPolicial || indemnizacion.funcionario_policial || '';
    const grado = indemnizacion.grado || '';
    const tipoIncidente = indemnizacion.tipoIncidente || indemnizacion.causa_indemnizacion || '';
    
    const matchesSearch = funcionarioPolicial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          grado.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipoIncidente = filterTipoIncidente === 'todos' || tipoIncidente === filterTipoIncidente;
    return matchesSearch && matchesTipoIncidente;
  });

  const showDetalles = (indemnizacion) => {
    setSelectedIndemnizacion(indemnizacion);
    setEditData({
      funcionarioPolicial: indemnizacion.funcionarioPolicial || indemnizacion.funcionario_policial || '',
      noExpediente: indemnizacion.noExpediente || indemnizacion.no_expediente || '',
      estadoExpediente: indemnizacion.estadoExpediente || indemnizacion.estado_expediente || 'en_proceso',
      sumaPagar: indemnizacion.sumaPagar || indemnizacion.suma_pagar || 0,
      causaIndemnizacion: indemnizacion.causaIndemnizacion || indemnizacion.causa_indemnizacion || '',
      fechaSolicitud: indemnizacion.fechaSolicitud || indemnizacion.fecha_solicitud || '',
      fechaPago: indemnizacion.fechaPago || indemnizacion.fecha_pago || '',
      observaciones: indemnizacion.observaciones || ''
    });
    setEditMode(false);
    setShowModal(true);
  };

  const enableEditMode = () => {
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    // Restaurar datos originales
    setEditData({
      funcionarioPolicial: selectedIndemnizacion.funcionarioPolicial || selectedIndemnizacion.funcionario_policial || '',
      noExpediente: selectedIndemnizacion.noExpediente || selectedIndemnizacion.no_expediente || '',
      estadoExpediente: selectedIndemnizacion.estadoExpediente || selectedIndemnizacion.estado_expediente || 'en_proceso',
      sumaPagar: selectedIndemnizacion.sumaPagar || selectedIndemnizacion.suma_pagar || 0,
      causaIndemnizacion: selectedIndemnizacion.causaIndemnizacion || selectedIndemnizacion.causa_indemnizacion || '',
      fechaSolicitud: selectedIndemnizacion.fechaSolicitud || selectedIndemnizacion.fecha_solicitud || '',
      fechaPago: selectedIndemnizacion.fechaPago || selectedIndemnizacion.fecha_pago || '',
      observaciones: selectedIndemnizacion.observaciones || ''
    });
  };

  const saveChanges = async () => {
    try {
      const updatedData = {
        funcionario_policial: editData.funcionarioPolicial,
        no_expediente: editData.noExpediente,
        estado_expediente: editData.estadoExpediente,
        suma_pagar: parseFloat(editData.sumaPagar) || 0,
        causa_indemnizacion: editData.causaIndemnizacion,
        fecha_solicitud: editData.fechaSolicitud,
        fecha_pago: editData.fechaPago,
        observaciones: editData.observaciones
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/indemnizaciones/${selectedIndemnizacion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        alert('✅ Información actualizada exitosamente');
        setEditMode(false);
        closeModal();
        window.location.reload(); // Refrescar para mostrar cambios
      } else {
        alert('❌ Error al actualizar la información');
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert('❌ Error al guardar los cambios');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedIndemnizacion(null);
    setEditMode(false);
    setEditData({});
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Listado de Indemnizaciones</h2>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar por funcionario o grado..."
          className="input-field flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterTipoIncidente}
          onChange={(e) => setFilterTipoIncidente(e.target.value)}
          className="input-field md:w-auto"
        >
          <option value="todos">Todos los Tipos de Incidente</option>
          {tiposIncidente.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Funcionario</th>
              <th className="table-header">Grado</th>
              <th className="table-header">Causa Indemnización</th>
              <th className="table-header">Miembro Amputado</th>
              <th className="table-header">Suma a Pagar</th>
              <th className="table-header">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredIndemnizaciones.map(indemnizacion => (
              <tr key={indemnizacion.id} className="hover:bg-gray-50 transition-colors">
                <td className="table-cell font-medium text-gray-900">{indemnizacion.funcionarioPolicial || indemnizacion.funcionario_policial || 'N/A'}</td>
                <td className="table-cell text-gray-700">{indemnizacion.grado || 'N/A'}</td>
                <td className="table-cell text-gray-700">{indemnizacion.causaIndemnizacion || indemnizacion.causa_indemnizacion || 'N/A'}</td>
                <td className="table-cell text-gray-700">{indemnizacion.miembroAmputado || indemnizacion.miembro_amputado || 'N/A'}</td>
                <td className="table-cell text-gray-700">L. {(indemnizacion.sumaPagar || indemnizacion.suma_pagar || 0).toFixed(2)}</td>
                <td className="table-cell">
                  <button
                    onClick={() => showDetalles(indemnizacion)}
                    className="text-blue-600 hover:text-blue-800 transition-colors mr-3 font-medium"
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => showDetalles(indemnizacion)}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors mr-3 font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteIndemnizacion(indemnizacion.id)}
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

      {/* Modal de Detalles/Edición */}
      {showModal && selectedIndemnizacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">
                    {editMode ? 'Editar Indemnización' : 'Detalles de la Indemnización'}
                  </h3>
                  <p className="text-green-100 mt-1">
                    {editMode ? 'Modifica la información de la indemnización' : 'Información completa de la indemnización'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {!editMode ? (
                /* Modo Vista */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información del Funcionario */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">👤 Información del Funcionario</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-600">Funcionario Policial:</span> <span className="text-gray-900">{selectedIndemnizacion.funcionarioPolicial || selectedIndemnizacion.funcionario_policial || 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">No. Expediente:</span> <span className="text-gray-900">{selectedIndemnizacion.noExpediente || selectedIndemnizacion.no_expediente || 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">Estado del Expediente:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedIndemnizacion.estadoExpediente === 'pagado' || selectedIndemnizacion.estado_expediente === 'pagado' ? 'bg-green-100 text-green-800' :
                          selectedIndemnizacion.estadoExpediente === 'en_proceso' || selectedIndemnizacion.estado_expediente === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {(selectedIndemnizacion.estadoExpediente || selectedIndemnizacion.estado_expediente || 'en_proceso').replace(/_/g, ' ')}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Información de la Indemnización */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">💰 Información de la Indemnización</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-600">Suma a Pagar:</span> <span className="text-green-600 font-bold text-xl">L. {(selectedIndemnizacion.sumaPagar || selectedIndemnizacion.suma_pagar || 0).toFixed(2)}</span></p>
                      <p><span className="font-medium text-gray-600">Causa de Indemnización:</span> <span className="text-gray-900">{selectedIndemnizacion.causaIndemnizacion || selectedIndemnizacion.causa_indemnizacion || 'N/A'}</span></p>
                    </div>
                  </div>

                  {/* Fechas Importantes */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">📅 Fechas Importantes</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-600">Fecha de Solicitud:</span> <span className="text-gray-900">{selectedIndemnizacion.fechaSolicitud || selectedIndemnizacion.fecha_solicitud || 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">Fecha de Pago:</span> <span className="text-gray-900">{selectedIndemnizacion.fechaPago || selectedIndemnizacion.fecha_pago || 'Pendiente'}</span></p>
                    </div>
                  </div>

                  {/* Información del Sistema */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">🔧 Información del Sistema</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-600">ID del Registro:</span> <span className="text-gray-900 font-mono text-sm">{selectedIndemnizacion.id}</span></p>
                      <p><span className="font-medium text-gray-600">Fecha de Creación:</span> <span className="text-gray-900">{selectedIndemnizacion.created_at ? new Date(selectedIndemnizacion.created_at).toLocaleString() : 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">Última Actualización:</span> <span className="text-gray-900">{selectedIndemnizacion.updated_at ? new Date(selectedIndemnizacion.updated_at).toLocaleString() : 'N/A'}</span></p>
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div className="bg-yellow-50 p-4 rounded-lg col-span-1 md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">📝 Observaciones</h4>
                    <div className="text-gray-900">
                      {selectedIndemnizacion.observaciones || 'Sin observaciones registradas'}
                    </div>
                  </div>
                </div>
              ) : (
                /* Modo Edición */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Formulario de Edición - Información del Funcionario */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">👤 Editar Información del Funcionario</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Funcionario Policial:</label>
                        <input
                          type="text"
                          value={editData.funcionarioPolicial}
                          onChange={(e) => setEditData({...editData, funcionarioPolicial: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">No. Expediente:</label>
                        <input
                          type="text"
                          value={editData.noExpediente}
                          onChange={(e) => setEditData({...editData, noExpediente: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado del Expediente:</label>
                        <select
                          value={editData.estadoExpediente}
                          onChange={(e) => setEditData({...editData, estadoExpediente: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="en_proceso">En Proceso</option>
                          <option value="aprobado">Aprobado</option>
                          <option value="rechazado">Rechazado</option>
                          <option value="pagado">Pagado</option>
                          <option value="pendiente_documentacion">Pendiente Documentación</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Formulario de Edición - Información Financiera */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">💰 Editar Información Financiera</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Suma a Pagar (L.):</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editData.sumaPagar}
                          onChange={(e) => setEditData({...editData, sumaPagar: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                        <div className="mt-2 bg-white p-3 rounded-md border">
                          <p className="text-sm text-gray-600">Monto formateado:</p>
                          <p className="text-xl font-bold text-green-600">L. {parseFloat(editData.sumaPagar || 0).toFixed(2)}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Causa de Indemnización:</label>
                        <select
                          value={editData.causaIndemnizacion}
                          onChange={(e) => setEditData({...editData, causaIndemnizacion: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar causa</option>
                          <option value="En cumplimiento del deber">En cumplimiento del deber</option>
                          <option value="En franquicia">En franquicia</option>
                          <option value="Fin de semana">Fin de semana</option>
                          <option value="Por enfermedad crónica degenerativa">Por enfermedad crónica degenerativa</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Formulario de Edición - Fechas */}
                  <div className="bg-blue-50 p-4 rounded-lg col-span-1 md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">📅 Editar Fechas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Solicitud:</label>
                        <input
                          type="date"
                          value={editData.fechaSolicitud}
                          onChange={(e) => setEditData({...editData, fechaSolicitud: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Pago:</label>
                        <input
                          type="date"
                          value={editData.fechaPago}
                          onChange={(e) => setEditData({...editData, fechaPago: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Formulario de Edición - Observaciones */}
                  <div className="bg-yellow-50 p-4 rounded-lg col-span-1 md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">📝 Editar Observaciones</h4>
                    <textarea
                      value={editData.observaciones}
                      onChange={(e) => setEditData({...editData, observaciones: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Observaciones, notas adicionales, comentarios..."
                    />
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                {!editMode ? (
                  <>
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={() => {
                        const dataStr = JSON.stringify(selectedIndemnizacion, null, 2);
                        const dataBlob = new Blob([dataStr], {type:'application/json'});
                        const url = URL.createObjectURL(dataBlob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `indemnizacion_${selectedIndemnizacion.id}.json`;
                        link.click();
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Descargar Datos
                    </button>
                    <button
                      onClick={enableEditMode}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      ✏️ Editar Información
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={cancelEdit}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={saveChanges}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      💾 Guardar Cambios
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};