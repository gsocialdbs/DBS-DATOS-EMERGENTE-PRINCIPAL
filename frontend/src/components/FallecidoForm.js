import React, { useState } from 'react';

export const FallecidoForm = ({ onAddFallecido }) => {
  const initialFallecidoState = {
    noExpediente: '', grado: '', policiaFallecido: '', causaMuerte: '', fechaMuerte: '',
    asignacion: '', sumaPagar: '', nombreAseguradora: '', fechaEnvioExpediente: '',
    observaciones: '', contacto: '', parentesco: '', telefono: '',
    beneficiarios: '', estadoExpediente: 'falta_documentacion'
  };
  const [fallecido, setFallecido] = useState(initialFallecidoState);

  const causasMuerte = [
    "HOMICIDIO (Cumplimiento del deber)",
    "HOMICIDIO (Fin de semana)",
    "HOMICIDIO (Franquicia)",
    "ACCIDENTE DE TRANSITO EN MOTOCICLETA. (Cumplimiento del deber)",
    "ACCIDENTE DE TRANSITO EN MOTOCICLETA. (Fin de semana)",
    "CAIDA DE VEHICULO (Cumplimiento del deber)",
    "ACCIDENTE EN VEHICULO (Fin de semana)",
    "MUERTE POR SUMERSION (Cumplimento del deber)",
    "SUICIDIO",
    "MUERTE NATURAL",
    "MUERTE COVID",
    "ACCIDENTE TIPO ATROPELLO (FIN DE SEMANA)",
    "PROCESO DE INVESTIGACIÓN"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFallecido(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddFallecido({ ...fallecido, id: Date.now() });
    setFallecido(initialFallecidoState); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-4">Registro de Siniestro (Fallecido)</h2>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos del Fallecido y Siniestro</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" name="noExpediente" value={fallecido.noExpediente} onChange={handleChange} placeholder="No. Expediente" className="input-field" required />
          <input type="text" name="grado" value={fallecido.grado} onChange={handleChange} placeholder="Grado" className="input-field" />
          <input type="text" name="policiaFallecido" value={fallecido.policiaFallecido} onChange={handleChange} placeholder="Policía Fallecido" className="input-field" required />
          
          <select name="causaMuerte" value={fallecido.causaMuerte} onChange={handleChange} className="input-field">
            <option value="">Seleccionar Causa de Muerte</option>
            {causasMuerte.map(causa => (
              <option key={causa} value={causa}>{causa}</option>
            ))}
          </select>

          <input type="date" name="fechaMuerte" value={fallecido.fechaMuerte} onChange={handleChange} placeholder="Fecha de Muerte" className="input-field" />
          <input type="text" name="asignacion" value={fallecido.asignacion} onChange={handleChange} placeholder="Asignación" className="input-field" />
          <input type="number" name="sumaPagar" value={fallecido.sumaPagar} onChange={handleChange} placeholder="Suma a Pagar" className="input-field" />
          <input type="text" name="nombreAseguradora" value={fallecido.nombreAseguradora} onChange={handleChange} placeholder="Nombre de la Aseguradora" className="input-field" />
          <input type="date" name="fechaEnvioExpediente" value={fallecido.fechaEnvioExpediente} onChange={handleChange} placeholder="Fecha Envío Expediente a Aseguradora" className="input-field" />
          <textarea name="observaciones" value={fallecido.observaciones} onChange={handleChange} placeholder="Observaciones" className="input-field col-span-full resize-y min-h-[80px]"></textarea>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de Contacto y Beneficiarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" name="contacto" value={fallecido.contacto} onChange={handleChange} placeholder="Contacto" className="input-field" />
          <input type="text" name="parentesco" value={fallecido.parentesco} onChange={handleChange} placeholder="Parentesco" className="input-field" />
          <input type="text" name="telefono" value={fallecido.telefono} onChange={handleChange} placeholder="Teléfono" className="input-field" />
          <textarea name="beneficiarios" value={fallecido.beneficiarios} onChange={handleChange} placeholder="Beneficiarios de la Póliza de Seguro" className="input-field col-span-full resize-y min-h-[80px]"></textarea>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado del Expediente</h3>
        <select name="estadoExpediente" value={fallecido.estadoExpediente} onChange={handleChange} className="input-field">
          <option value="falta_documentacion">Falta Documentación</option>
          <option value="problemas_legales">Problemas Legales</option>
          <option value="enviado_aseguradora">Enviado para Aseguradora</option>
          <option value="pagado">Pagado</option>
        </select>
      </section>

      <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg shadow-md">
        Registrar Fallecido
      </button>
    </form>
  );
};