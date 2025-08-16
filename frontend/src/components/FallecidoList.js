import React, { useState } from 'react';

export const FallecidoList = ({ fallecidos, onDeleteFallecido }) => {
  const [filterStatus, setFilterStatus] = useState('todos'); // 'todos', 'enviado_aseguradora', 'falta_documentacion', 'problemas_legales'
  const [filterCausaMuerte, setFilterCausaMuerte] = useState('todos');
  const [filterYear, setFilterYear] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFallecido, setSelectedFallecido] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const causasMuerte = [
    "HOMICIDIO (Cumplimiento del deber)", "HOMICIDIO (Fin de semana)", "HOMICIDIO (Franquicia)",
    "ACCIDENTE DE TRANSITO EN MOTOCICLETA. (Cumplimiento del deber)", "ACCIDENTE DE TRANSITO EN MOTOCICLETA. (Fin de semana)",
    "CAIDA DE VEHICULO (Cumplimiento del deber)", "ACCIDENTE EN VEHICULO (Fin de semana)",
    "MUERTE POR SUMERSION (Cumplimento del deber)", "SUICIDIO", "MUERTE NATURAL", "MUERTE COVID",
    "ACCIDENTE TIPO ATROPELLO (FIN DE SEMANA)", "PROCESO DE INVESTIGACIÓN"
  ];

  const availableYears = [...new Set(fallecidos.map(f => {
    const fechaMuerte = f.fechaMuerte || f.fecha_muerte || '';
    return fechaMuerte ? new Date(fechaMuerte).getFullYear() : new Date().getFullYear();
  }))].sort((a, b) => b - a);

  const filteredFallecidos = fallecidos.filter(fallecido => {
    // Proteger contra campos undefined/null con valores por defecto
    const estadoExpediente = fallecido.estadoExpediente || fallecido.estado_expediente || '';
    const causaMuerte = fallecido.causaMuerte || fallecido.causa_muerte || '';
    const fechaMuerte = fallecido.fechaMuerte || fallecido.fecha_muerte || '';
    const policiaFallecido = fallecido.policiaFallecido || fallecido.policia_fallecido || '';
    const noExpediente = fallecido.noExpediente || fallecido.no_expediente || '';
    
    const matchesStatus = filterStatus === 'todos' || estadoExpediente === filterStatus;
    const matchesCausaMuerte = filterCausaMuerte === 'todos' || causaMuerte === filterCausaMuerte;
    const matchesYear = filterYear === 'todos' || (fechaMuerte ? new Date(fechaMuerte).getFullYear().toString() : '') === filterYear;
    const matchesSearch = policiaFallecido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          noExpediente.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCausaMuerte && matchesYear && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'falta_documentacion': return 'bg-red-100 text-red-800';
      case 'problemas_legales': return 'bg-yellow-100 text-yellow-800';
      case 'enviado_aseguradora': return 'bg-blue-100 text-blue-800';
      case 'pagado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const showDetalles = (fallecido) => {
    setSelectedFallecido(fallecido);
    setEditData({
      policiaFallecido: fallecido.policiaFallecido || fallecido.policia_fallecido || '',
      noExpediente: fallecido.noExpediente || fallecido.no_expediente || '',
      causaMuerte: fallecido.causaMuerte || fallecido.causa_muerte || '',
      fechaMuerte: fallecido.fechaMuerte || fallecido.fecha_muerte || '',
      lugarMuerte: fallecido.lugarMuerte || fallecido.lugar_muerte || '',
      beneficiarios: fallecido.beneficiarios || '',
      estadoExpediente: fallecido.estadoExpediente || fallecido.estado_expediente || 'pendiente'
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
      policiaFallecido: selectedFallecido.policiaFallecido || selectedFallecido.policia_fallecido || '',
      noExpediente: selectedFallecido.noExpediente || selectedFallecido.no_expediente || '',
      causaMuerte: selectedFallecido.causaMuerte || selectedFallecido.causa_muerte || '',
      fechaMuerte: selectedFallecido.fechaMuerte || selectedFallecido.fecha_muerte || '',
      lugarMuerte: selectedFallecido.lugarMuerte || selectedFallecido.lugar_muerte || '',
      beneficiarios: selectedFallecido.beneficiarios || '',
      estadoExpediente: selectedFallecido.estadoExpediente || selectedFallecido.estado_expediente || 'pendiente'
    });
  };

  const saveChanges = async () => {
    try {
      const updatedData = {
        policia_fallecido: editData.policiaFallecido,
        no_expediente: editData.noExpediente,
        causa_muerte: editData.causaMuerte,
        fecha_muerte: editData.fechaMuerte,
        lugar_muerte: editData.lugarMuerte,
        beneficiarios: editData.beneficiarios,
        estado_expediente: editData.estadoExpediente
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/fallecidos/${selectedFallecido.id}`, {
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
    setSelectedFallecido(null);
    setEditMode(false);
    setEditData({});
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Listado de Siniestros (Fallecidos)</h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar por nombre o No. Expediente..."
          className="input-field"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field"
        >
          <option value="todos">Todos los Estados</option>
          <option value="enviado_aseguradora">Enviado para Aseguradora</option>
          <option value="falta_documentacion">Pendientes de Documentación</option>
          <option value="problemas_legales">Con Problemas Legales</option>
          <option value="pagado">Pagados</option>
        </select>
        <select
          value={filterCausaMuerte}
          onChange={(e) => setFilterCausaMuerte(e.target.value)}
          className="input-field"
        >
          <option value="todos">Todas las Causas de Muerte</option>
          {causasMuerte.map(causa => (
            <option key={causa} value={causa}>{causa}</option>
          ))}
        </select>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="input-field"
        >
          <option value="todos">Todos los Años</option>
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">No. Expediente</th>
              <th className="table-header">Policía Fallecido</th>
              <th className="table-header">Causa de Muerte</th>
              <th className="table-header">Aseguradora</th>
              <th className="table-header">Estado</th>
              <th className="table-header">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFallecidos.map(fallecido => (
              <tr key={fallecido.id} className="hover:bg-gray-50 transition-colors">
                <td className="table-cell font-medium text-gray-900">{fallecido.noExpediente || fallecido.no_expediente || 'N/A'}</td>
                <td className="table-cell text-gray-700">{fallecido.policiaFallecido || fallecido.policia_fallecido || 'N/A'}</td>
                <td className="table-cell text-gray-700">{fallecido.causaMuerte || fallecido.causa_muerte || 'N/A'}</td>
                <td className="table-cell text-gray-700">{fallecido.nombreAseguradora || fallecido.lugar_muerte || 'N/A'}</td>
                <td className="table-cell">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(fallecido.estadoExpediente || fallecido.estado_expediente)}`}>
                    {(fallecido.estadoExpediente || fallecido.estado_expediente || 'pendiente').replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="table-cell">
                  <button
                    onClick={() => showDetalles(fallecido)}
                    className="text-blue-600 hover:text-blue-800 transition-colors mr-3 font-medium"
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => onDeleteFallecido(fallecido.id)}
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
      {showModal && selectedFallecido && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">
                    {editMode ? 'Editar Información de Fallecido' : 'Detalles del Fallecido'}
                  </h3>
                  <p className="text-red-100 mt-1">
                    {editMode ? 'Modifica la información del registro' : 'Información completa del fallecido'}
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
                  {/* Información del Fallecido */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">👤 Información del Fallecido</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-600">Policía Fallecido:</span> <span className="text-gray-900">{selectedFallecido.policiaFallecido || selectedFallecido.policia_fallecido || 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">No. Expediente:</span> <span className="text-gray-900">{selectedFallecido.noExpediente || selectedFallecido.no_expediente || 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">Fecha de Muerte:</span> <span className="text-gray-900">{selectedFallecido.fechaMuerte || selectedFallecido.fecha_muerte || 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">Lugar de Muerte:</span> <span className="text-gray-900">{selectedFallecido.lugarMuerte || selectedFallecido.lugar_muerte || 'N/A'}</span></p>
                    </div>
                  </div>

                  {/* Información del Incidente */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">💀 Información del Incidente</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-600">Causa de Muerte:</span> <span className="text-gray-900">{selectedFallecido.causaMuerte || selectedFallecido.causa_muerte || 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">Estado del Expediente:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedFallecido.estadoExpediente || selectedFallecido.estado_expediente)}`}>
                          {(selectedFallecido.estadoExpediente || selectedFallecido.estado_expediente || 'pendiente').replace(/_/g, ' ')}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Información de Beneficiarios */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">👥 Beneficiarios</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-600">Beneficiarios:</span> <span className="text-gray-900">{selectedFallecido.beneficiarios || 'No especificados'}</span></p>
                    </div>
                  </div>

                  {/* Información del Sistema */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">📅 Información del Sistema</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-600">ID del Registro:</span> <span className="text-gray-900 font-mono text-sm">{selectedFallecido.id}</span></p>
                      <p><span className="font-medium text-gray-600">Fecha de Creación:</span> <span className="text-gray-900">{selectedFallecido.created_at ? new Date(selectedFallecido.created_at).toLocaleString() : 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">Última Actualización:</span> <span className="text-gray-900">{selectedFallecido.updated_at ? new Date(selectedFallecido.updated_at).toLocaleString() : 'N/A'}</span></p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Modo Edición */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Formulario de Edición - Información del Fallecido */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">👤 Editar Información del Fallecido</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Policía Fallecido:</label>
                        <input
                          type="text"
                          value={editData.policiaFallecido}
                          onChange={(e) => setEditData({...editData, policiaFallecido: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">No. Expediente:</label>
                        <input
                          type="text"
                          value={editData.noExpediente}
                          onChange={(e) => setEditData({...editData, noExpediente: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Muerte:</label>
                        <input
                          type="date"
                          value={editData.fechaMuerte}
                          onChange={(e) => setEditData({...editData, fechaMuerte: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lugar de Muerte:</label>
                        <input
                          type="text"
                          value={editData.lugarMuerte}
                          onChange={(e) => setEditData({...editData, lugarMuerte: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Hospital, ciudad, etc."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Formulario de Edición - Información del Incidente */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">💀 Editar Información del Incidente</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Causa de Muerte:</label>
                        <select
                          value={editData.causaMuerte}
                          onChange={(e) => setEditData({...editData, causaMuerte: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar causa de muerte</option>
                          <option value="HOMICIDIO (Cumplimiento del deber)">HOMICIDIO (Cumplimiento del deber)</option>
                          <option value="HOMICIDIO (Fin de semana)">HOMICIDIO (Fin de semana)</option>
                          <option value="HOMICIDIO (Franquicia)">HOMICIDIO (Franquicia)</option>
                          <option value="ACCIDENTE DE TRANSITO EN MOTOCICLETA. (Cumplimiento del deber)">ACCIDENTE DE TRANSITO EN MOTOCICLETA. (Cumplimiento del deber)</option>
                          <option value="ACCIDENTE DE TRANSITO EN MOTOCICLETA. (Fin de semana)">ACCIDENTE DE TRANSITO EN MOTOCICLETA. (Fin de semana)</option>
                          <option value="CAIDA DE VEHICULO (Cumplimiento del deber)">CAIDA DE VEHICULO (Cumplimiento del deber)</option>
                          <option value="ACCIDENTE EN VEHICULO (Fin de semana)">ACCIDENTE EN VEHICULO (Fin de semana)</option>
                          <option value="MUERTE POR SUMERSION (Cumplimento del deber)">MUERTE POR SUMERSION (Cumplimento del deber)</option>
                          <option value="SUICIDIO">SUICIDIO</option>
                          <option value="MUERTE NATURAL">MUERTE NATURAL</option>
                          <option value="MUERTE COVID">MUERTE COVID</option>
                          <option value="ACCIDENTE TIPO ATROPELLO (FIN DE SEMANA)">ACCIDENTE TIPO ATROPELLO (FIN DE SEMANA)</option>
                          <option value="PROCESO DE INVESTIGACIÓN">PROCESO DE INVESTIGACIÓN</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado del Expediente:</label>
                        <select
                          value={editData.estadoExpediente}
                          onChange={(e) => setEditData({...editData, estadoExpediente: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="enviado_aseguradora">Enviado para Aseguradora</option>
                          <option value="falta_documentacion">Pendientes de Documentación</option>
                          <option value="problemas_legales">Con Problemas Legales</option>
                          <option value="pagado">Pagados</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Formulario de Edición - Beneficiarios */}
                  <div className="bg-blue-50 p-4 rounded-lg col-span-1 md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">👥 Editar Beneficiarios</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiarios:</label>
                      <textarea
                        value={editData.beneficiarios}
                        onChange={(e) => setEditData({...editData, beneficiarios: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Lista de beneficiarios (esposa, hijos, padres, etc.)"
                      />
                    </div>
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
                        const dataStr = JSON.stringify(selectedFallecido, null, 2);
                        const dataBlob = new Blob([dataStr], {type:'application/json'});
                        const url = URL.createObjectURL(dataBlob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `fallecido_${selectedFallecido.id}.json`;
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