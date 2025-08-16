import React, { useState } from 'react';

export const FuncionarioLesionadoList = ({ funcionariosLesionados, onDeleteFuncionarioLesionado }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSexo, setFilterSexo] = useState('todos');
  const [filterGrado, setFilterGrado] = useState('todos');
  const [filterTipoIncidente, setFilterTipoIncidente] = useState('todos');
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const availableGrados = [...new Set(funcionariosLesionados.map(f => f.grado || f.funcionario_policial || '').filter(g => g))].sort();

  const showDetalles = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setEditData({
      nombre: funcionario.nombre || funcionario.funcionario_nombre || '',
      dni: funcionario.dni || funcionario.no_expediente || '',
      grado: funcionario.grado || funcionario.funcionario_policial || '',
      sexo: funcionario.sexo || '',
      tipoIncidente: funcionario.tipoIncidente || funcionario.miembro_amputado || '',
      hospitalTraslado: funcionario.hospitalTraslado || funcionario.hospital_traslado || '',
      diagnostico: funcionario.diagnostico || '',
      totalGastos: funcionario.totalGastos || funcionario.total_gastos || 0
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
      nombre: selectedFuncionario.nombre || selectedFuncionario.funcionario_nombre || '',
      dni: selectedFuncionario.dni || selectedFuncionario.no_expediente || '',
      grado: selectedFuncionario.grado || selectedFuncionario.funcionario_policial || '',
      sexo: selectedFuncionario.sexo || '',
      tipoIncidente: selectedFuncionario.tipoIncidente || selectedFuncionario.miembro_amputado || '',
      hospitalTraslado: selectedFuncionario.hospitalTraslado || selectedFuncionario.hospital_traslado || '',
      diagnostico: selectedFuncionario.diagnostico || '',
      totalGastos: selectedFuncionario.totalGastos || selectedFuncionario.total_gastos || 0
    });
  };

  const saveChanges = async () => {
    try {
      // Aquí llamarías a tu API para actualizar el funcionario
      const updatedData = {
        funcionario_nombre: editData.nombre,
        no_expediente: editData.dni,
        funcionario_policial: editData.grado,
        sexo: editData.sexo,
        miembro_amputado: editData.tipoIncidente,
        hospital_traslado: editData.hospitalTraslado,
        diagnostico: editData.diagnostico,
        total_gastos: parseFloat(editData.totalGastos) || 0
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/funcionarios-lesionados/${selectedFuncionario.id}`, {
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
        // Aquí podrías llamar a una función para refrescar la lista
        window.location.reload(); // Solución simple para refrescar
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
    setSelectedFuncionario(null);
    setEditMode(false);
    setEditData({});
  };
  const tiposIncidente = [
    "HERIDO POR ARMA DE FUEGO (C/D)",
    "HERIDO POR ARMA DE FUEGO (F/D)",
    "ACCIDENTE DE TRANSITO EN MOTOCICLETA Y VEHÍCULO (C/D)",
    "ACCIDENTE DE TRANSITO EN MOTOCICLETA Y VEHÍCULO (F/S)",
    "ATROPELLO (C/D)",
    "HERIDO POR ARMA BLANCA Y OTROS OBJETOS (C/D)",
    "HERIDO POR ARMA BLANCA Y OTROS OBJETOS (F/S)"
  ];

  const filteredFuncionarios = funcionariosLesionados.filter(funcionario => {
    // Proteger contra campos undefined/null con valores por defecto
    const nombre = funcionario.nombre || funcionario.funcionario_nombre || '';
    const dni = funcionario.dni || funcionario.no_expediente || '';
    const sexo = funcionario.sexo || '';
    const grado = funcionario.grado || funcionario.funcionario_policial || '';
    const tipoIncidente = funcionario.tipoIncidente || funcionario.miembro_amputado || '';
    
    const matchesSearch = nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dni.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSexo = filterSexo === 'todos' || sexo === filterSexo;
    const matchesGrado = filterGrado === 'todos' || grado === filterGrado;
    const matchesTipoIncidente = filterTipoIncidente === 'todos' || tipoIncidente === filterTipoIncidente;
    
    return matchesSearch && matchesSexo && matchesGrado && matchesTipoIncidente;
  });

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Listado de Funcionarios Lesionados</h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          className="input-field"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterSexo}
          onChange={(e) => setFilterSexo(e.target.value)}
          className="input-field"
        >
          <option value="todos">Todos los Sexos</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>
        <select
          value={filterGrado}
          onChange={(e) => setFilterGrado(e.target.value)}
          className="input-field"
        >
          <option value="todos">Todos los Grados</option>
          {availableGrados.map(grado => (
            <option key={grado} value={grado}>{grado}</option>
          ))}
        </select>
        <select
          value={filterTipoIncidente}
          onChange={(e) => setFilterTipoIncidente(e.target.value)}
          className="input-field"
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
              <th className="table-header">DNI</th>
              <th className="table-header">Nombre</th>
              <th className="table-header">Grado</th>
              <th className="table-header">Tipo Incidente</th>
              <th className="table-header">Hospital</th>
              <th className="table-header">Total Gastos</th>
              <th className="table-header">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFuncionarios.map(funcionario => (
              <tr key={funcionario.id} className="hover:bg-gray-50 transition-colors">
                <td className="table-cell font-medium text-gray-900">{funcionario.dni || funcionario.no_expediente || 'N/A'}</td>
                <td className="table-cell text-gray-700">{funcionario.nombre || funcionario.funcionario_nombre || 'N/A'}</td>
                <td className="table-cell text-gray-700">{funcionario.grado || funcionario.funcionario_policial || 'N/A'}</td>
                <td className="table-cell text-gray-700">{funcionario.tipoIncidente || funcionario.miembro_amputado || 'N/A'}</td>
                <td className="table-cell text-gray-700">{funcionario.hospitalTraslado || funcionario.hospital_traslado || 'N/A'}</td>
                <td className="table-cell text-gray-700">L. {(funcionario.totalGastos || funcionario.total_gastos || 0).toFixed(2)}</td>
                <td className="table-cell">
                  <button
                    onClick={() => showDetalles(funcionario)}
                    className="text-blue-600 hover:text-blue-800 transition-colors mr-3 font-medium"
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => onDeleteFuncionarioLesionado(funcionario.id)}
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
      {showModal && selectedFuncionario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">
                    {editMode ? 'Editar Funcionario Lesionado' : 'Detalles del Funcionario Lesionado'}
                  </h3>
                  <p className="text-blue-100 mt-1">
                    {editMode ? 'Modifica la información del funcionario' : 'Información completa del registro'}
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
                  {/* Información Personal */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">👤 Información Personal</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-600">Nombre:</span> <span className="text-gray-900">{selectedFuncionario.nombre || selectedFuncionario.funcionario_nombre || 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">DNI:</span> <span className="text-gray-900">{selectedFuncionario.dni || selectedFuncionario.no_expediente || 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">Grado:</span> <span className="text-gray-900">{selectedFuncionario.grado || selectedFuncionario.funcionario_policial || 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">Sexo:</span> <span className="text-gray-900">{selectedFuncionario.sexo || 'No especificado'}</span></p>
                    </div>
                  </div>

                  {/* Información del Incidente */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">🚨 Información del Incidente</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-600">Tipo de Incidente:</span> <span className="text-gray-900">{selectedFuncionario.tipoIncidente || selectedFuncionario.miembro_amputado || 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">Hospital de Traslado:</span> <span className="text-gray-900">{selectedFuncionario.hospitalTraslado || selectedFuncionario.hospital_traslado || 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">Diagnóstico:</span> <span className="text-gray-900">{selectedFuncionario.diagnostico || 'No especificado'}</span></p>
                    </div>
                  </div>

                  {/* Información Financiera */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">💰 Información Financiera</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-600">Total Gastos:</span> <span className="text-green-600 font-bold text-lg">L. {(selectedFuncionario.totalGastos || selectedFuncionario.total_gastos || 0).toFixed(2)}</span></p>
                      <p><span className="font-medium text-gray-600">Gastos Detallados:</span></p>
                      {selectedFuncionario.gastos && typeof selectedFuncionario.gastos === 'object' ? (
                        <div className="ml-4 text-sm text-gray-700">
                          {Object.entries(selectedFuncionario.gastos).map(([key, value]) => (
                            <p key={key}>• {key}: L. {value}</p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No hay gastos detallados registrados</p>
                      )}
                    </div>
                  </div>

                  {/* Fechas y Sistema */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">📅 Información del Sistema</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium text-gray-600">ID del Registro:</span> <span className="text-gray-900 font-mono text-sm">{selectedFuncionario.id}</span></p>
                      <p><span className="font-medium text-gray-600">Fecha de Creación:</span> <span className="text-gray-900">{selectedFuncionario.created_at ? new Date(selectedFuncionario.created_at).toLocaleString() : 'N/A'}</span></p>
                      <p><span className="font-medium text-gray-600">Última Actualización:</span> <span className="text-gray-900">{selectedFuncionario.updated_at ? new Date(selectedFuncionario.updated_at).toLocaleString() : 'N/A'}</span></p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Modo Edición */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Formulario de Edición - Información Personal */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">👤 Editar Información Personal</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo:</label>
                        <input
                          type="text"
                          value={editData.nombre}
                          onChange={(e) => setEditData({...editData, nombre: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">DNI/No. Expediente:</label>
                        <input
                          type="text"
                          value={editData.dni}
                          onChange={(e) => setEditData({...editData, dni: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grado:</label>
                        <input
                          type="text"
                          value={editData.grado}
                          onChange={(e) => setEditData({...editData, grado: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sexo:</label>
                        <select
                          value={editData.sexo}
                          onChange={(e) => setEditData({...editData, sexo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Femenino">Femenino</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Formulario de Edición - Información del Incidente */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">🚨 Editar Información del Incidente</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidente:</label>
                        <select
                          value={editData.tipoIncidente}
                          onChange={(e) => setEditData({...editData, tipoIncidente: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar tipo de incidente</option>
                          <option value="HERIDO POR ARMA DE FUEGO (C/D)">HERIDO POR ARMA DE FUEGO (C/D)</option>
                          <option value="HERIDO POR ARMA BLANCA (C/D)">HERIDO POR ARMA BLANCA (C/D)</option>
                          <option value="ACCIDENTE DE TRANSITO EN MOTOCICLETA Y VEHICULO (C/D)">ACCIDENTE DE TRANSITO EN MOTOCICLETA Y VEHICULO (C/D)</option>
                          <option value="ACCIDENTE DE TRANSITO EN MOTOCICLETA (FIN DE SEMANA)">ACCIDENTE DE TRANSITO EN MOTOCICLETA (FIN DE SEMANA)</option>
                          <option value="CAIDA DE VEHICULO (C/D)">CAIDA DE VEHICULO (C/D)</option>
                          <option value="ACCIDENTE EN VEHICULO (FIN DE SEMANA)">ACCIDENTE EN VEHICULO (FIN DE SEMANA)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hospital de Traslado:</label>
                        <select
                          value={editData.hospitalTraslado}
                          onChange={(e) => setEditData({...editData, hospitalTraslado: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar hospital</option>
                          <option value="HOSPITAL MILITAR">HOSPITAL MILITAR</option>
                          <option value="HOSPITAL SHENALU">HOSPITAL SHENALU</option>
                          <option value="HOSPITAL NENA DIAZ">HOSPITAL NENA DIAZ</option>
                          <option value="HOSPITAL REGIONAL DEL NORTE">HOSPITAL REGIONAL DEL NORTE</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico:</label>
                        <textarea
                          value={editData.diagnostico}
                          onChange={(e) => setEditData({...editData, diagnostico: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe el diagnóstico médico..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Formulario de Edición - Información Financiera */}
                  <div className="bg-green-50 p-4 rounded-lg col-span-1 md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">💰 Editar Información Financiera</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total de Gastos (L.):</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editData.totalGastos}
                          onChange={(e) => setEditData({...editData, totalGastos: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="bg-white p-3 rounded-md border">
                          <p className="text-sm text-gray-600">Monto actual:</p>
                          <p className="text-lg font-bold text-green-600">L. {parseFloat(editData.totalGastos || 0).toFixed(2)}</p>
                        </div>
                      </div>
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
                        const dataStr = JSON.stringify(selectedFuncionario, null, 2);
                        const dataBlob = new Blob([dataStr], {type:'application/json'});
                        const url = URL.createObjectURL(dataBlob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `funcionario_${selectedFuncionario.id}.json`;
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