import React, { useState } from 'react';

export const IndemnizacionForm = ({ onAddIndemnizacion, indemnizacionToEdit, onUpdateIndemnizacion }) => {
  const initialIndemnizacionState = {
    grado: '', funcionarioPolicial: '', causaIndemnizacion: '', miembroAmputado: '',
    tipoIncidente: '', // Este es el campo de lista desplegable
    fechaAccidente: '', asignacion: '', unidad: '', sumaPagar: '',
    aseguradora: '', observaciones: '', contacto: '', parentesco: '',
    telefono: '', fechaExpedienteCobro: '', fotografia: null // Para la foto
  };

  const [indemnizacion, setIndemnizacion] = useState(indemnizacionToEdit || initialIndemnizacionState);

  const tiposIncidente = [
    "En cumplimiento del deber",
    "En franquicia",
    "Fin de semana",
    "Por enfermedad crónica degenerativa"
  ];

  React.useEffect(() => {
    setIndemnizacion(indemnizacionToEdit || initialIndemnizacionState);
  }, [indemnizacionToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIndemnizacion(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setIndemnizacion(prev => ({ ...prev, fotografia: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (indemnizacionToEdit) {
      onUpdateIndemnizacion(indemnizacion);
    } else {
      onAddIndemnizacion({ ...indemnizacion, id: Date.now() });
    }
    setIndemnizacion(initialIndemnizacionState); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-4">
        {indemnizacionToEdit ? 'Editar Información de Indemnización' : 'Ingreso de Información de Indemnización'}
      </h2>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos del Funcionario y la Indemnización</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" name="grado" value={indemnizacion.grado} onChange={handleChange} placeholder="Grado" className="input-field" />
          <input type="text" name="funcionarioPolicial" value={indemnizacion.funcionarioPolicial} onChange={handleChange} placeholder="Nombre del Funcionario Policial" className="input-field" required />
          <input type="text" name="causaIndemnizacion" value={indemnizacion.causaIndemnizacion} onChange={handleChange} placeholder="Causa de la Indemnización" className="input-field" />
          <input type="text" name="miembroAmputado" value={indemnizacion.miembroAmputado} onChange={handleChange} placeholder="Miembro Amputado (si aplica)" className="input-field" />
          
          <select name="tipoIncidente" value={indemnizacion.tipoIncidente} onChange={handleChange} className="input-field">
            <option value="">Seleccionar Tipo de Incidente</option>
            {tiposIncidente.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>

          <input type="date" name="fechaAccidente" value={indemnizacion.fechaAccidente} onChange={handleChange} placeholder="Fecha del Accidente" className="input-field" />
          <input type="text" name="asignacion" value={indemnizacion.asignacion} onChange={handleChange} placeholder="Asignación" className="input-field" />
          <input type="text" name="unidad" value={indemnizacion.unidad} onChange={handleChange} placeholder="Unidad" className="input-field" />
          <input type="number" name="sumaPagar" value={indemnizacion.sumaPagar} onChange={handleChange} placeholder="Suma a Pagar" className="input-field" />
          <input type="text" name="aseguradora" value={indemnizacion.aseguradora} onChange={handleChange} placeholder="Aseguradora" className="input-field" />
          <textarea name="observaciones" value={indemnizacion.observaciones} onChange={handleChange} placeholder="Observaciones" className="input-field col-span-full resize-y min-h-[80px]"></textarea>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de Contacto y Cobro</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" name="contacto" value={indemnizacion.contacto} onChange={handleChange} placeholder="Contacto" className="input-field" />
          <input type="text" name="parentesco" value={indemnizacion.parentesco} onChange={handleChange} placeholder="Parentesco" className="input-field" />
          <input type="text" name="telefono" value={indemnizacion.telefono} onChange={handleChange} placeholder="Teléfono" className="input-field" />
          <input type="date" name="fechaExpedienteCobro" value={indemnizacion.fechaExpedienteCobro} onChange={handleChange} placeholder="Fecha Expediente a Cobro" className="input-field" />
          <div className="col-span-full">
            <label htmlFor="fotografia" className="block text-sm font-medium text-gray-700 mb-1">Adjuntar Fotografía</label>
            <input type="file" name="fotografia" id="fotografia" onChange={handleFileChange} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            {indemnizacion.fotografia && <p className="text-sm text-gray-500 mt-2">Archivo seleccionado: {indemnizacion.fotografia.name}</p>}
          </div>
        </div>
      </section>

      <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg shadow-md">
        {indemnizacionToEdit ? 'Actualizar Indemnización' : 'Registrar Indemnización'}
      </button>
    </form>
  );
};