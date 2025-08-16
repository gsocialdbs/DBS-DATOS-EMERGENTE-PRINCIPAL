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
    </div>
  );
};