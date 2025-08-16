import React, { useState } from 'react';

export const FuncionarioLesionadoForm = ({ onAddFuncionarioLesionado, initialData = {} }) => {
  const [funcionario, setFuncionario] = useState({
    dni: initialData.dni || '',
    nombre: initialData.nombre || '',
    grado: initialData.grado || '',
    edad: initialData.edad || '',
    sexo: initialData.sexo || '',
    promocion: initialData.promocion || '',
    anioIngreso: initialData.anioIngreso || '',
    tiempoInstitucion: initialData.tiempoInstitucion || '',
    direccionPerteneces: initialData.direccionPerteneces || '',
    asignacion: initialData.asignacion || '',
    lugarAsignacion: initialData.lugarAsignacion || '',
    dondeVive: initialData.dondeVive || '',
    celular: initialData.celular || '',
    tipoIncidente: initialData.tipoIncidente || '', // Nuevo campo
    diagnostico: initialData.diagnostico || '',
    fechaIngreso: initialData.fechaIngreso || '',
    hospitalTraslado: initialData.hospitalTraslado || '', // Usamos el nuevo campo
    observacionesLesion: initialData.observacionesLesion || '',
    gastos: [],
    totalGastos: 0,
    ...initialData
  });

  const [newGasto, setNewGasto] = useState({
    fecha: '', concepto: '', monto: ''
  });

  const tiposIncidente = [
    "HERIDO POR ARMA DE FUEGO (C/D)",
    "HERIDO POR ARMA DE FUEGO (F/D)",
    "ACCIDENTE DE TRANSITO EN MOTOCICLETA Y VEHÍCULO (C/D)",
    "ACCIDENTE DE TRANSITO EN MOTOCICLETA Y VEHÍCULO (F/S)",
    "ATROPELLO (C/D)",
    "HERIDO POR ARMA BLANCA Y OTROS OBJETOS (C/D)",
    "HERIDO POR ARMA BLANCA Y OTROS OBJETOS (F/S)"
  ];

  const hospitalesAutorizados = [
    "HOSPITAL Y CLINICA SAN JORGE",
    "HOSPITAL MILITAR",
    "CENTRO MEDICO HONDUREÑO",
    "HOSPITAL POLICLINICA",
    "CENTRO MÉDICO SANTA ROSA",
    "HOSPITAL CEMESA",
    "HOSPITAL Y CLINICA SAN JORGE EL HATO",
    "HOSPITAL LANCETILLA SEMEHSUR",
    "CENTRO MÉDICO OLANCHANO",
    "HOSPITAL BARANDILLAS",
    "HOSPITAL SHENALU"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFuncionario(prev => ({ ...prev, [name]: value }));
  };

  const handleGastoChange = (e) => {
    const { name, value } = e.target;
    setNewGasto(prev => ({ ...prev, [name]: value }));
  };

  const addGasto = () => {
    if (newGasto.fecha && newGasto.concepto && newGasto.monto) {
      const montoNum = parseFloat(newGasto.monto);
      if (isNaN(montoNum) || montoNum <= 0) {
        alert('Por favor, ingresa un monto válido para el gasto.');
        return;
      }
      setFuncionario(prev => ({
        ...prev,
        gastos: [...prev.gastos, { ...newGasto, id: Date.now(), monto: montoNum }],
        totalGastos: prev.totalGastos + montoNum
      }));
      setNewGasto({ fecha: '', concepto: '', monto: '' });
    } else {
      alert('Por favor, completa todos los campos del gasto.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddFuncionarioLesionado({ ...funcionario, id: Date.now() });
    setFuncionario({
      dni: '', nombre: '', grado: '', edad: '', sexo: '', promocion: '', anioIngreso: '', tiempoInstitucion: '',
      direccionPerteneces: '', asignacion: '', lugarAsignacion: '', dondeVive: '', celular: '',
      tipoIncidente: '', diagnostico: '', fechaIngreso: '', hospitalTraslado: '',
      observacionesLesion: '', gastos: [], totalGastos: 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-4">Registro de Funcionario Lesionado</h2>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos Generales del Funcionario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" name="dni" value={funcionario.dni} onChange={handleChange} placeholder="DNI" className="input-field" required />
          <input type="text" name="nombre" value={funcionario.nombre} onChange={handleChange} placeholder="Nombre Completo" className="input-field" required />
          <input type="text" name="grado" value={funcionario.grado} onChange={handleChange} placeholder="Grado" className="input-field" />
          <input type="number" name="edad" value={funcionario.edad} onChange={handleChange} placeholder="Edad" className="input-field" />
          <select name="sexo" value={funcionario.sexo} onChange={handleChange} className="input-field">
            <option value="">Seleccionar Sexo</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
          <input type="text" name="promocion" value={funcionario.promocion} onChange={handleChange} placeholder="Promoción" className="input-field" />
          <input type="number" name="anioIngreso" value={funcionario.anioIngreso} onChange={handleChange} placeholder="Año de Ingreso" className="input-field" />
          <input type="text" name="tiempoInstitucion" value={funcionario.tiempoInstitucion} onChange={handleChange} placeholder="Tiempo en la Institución" className="input-field" />
          <input type="text" name="direccionPerteneces" value={funcionario.direccionPerteneces} onChange={handleChange} placeholder="Dirección a la que pertenece" className="input-field" />
          <input type="text" name="asignacion" value={funcionario.asignacion} onChange={handleChange} placeholder="Asignación" className="input-field" />
          <input type="text" name="lugarAsignacion" value={funcionario.lugarAsignacion} onChange={handleChange} placeholder="Lugar de Asignación" className="input-field" />
          <input type="text" name="dondeVive" value={funcionario.dondeVive} onChange={handleChange} placeholder="Lugar donde vive" className="input-field" />
          <input type="text" name="celular" value={funcionario.celular} onChange={handleChange} placeholder="Celular" className="input-field" />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de la Lesión</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="tipoIncidente" value={funcionario.tipoIncidente} onChange={handleChange} className="input-field">
            <option value="">Seleccionar Tipo de Incidente</option>
            {tiposIncidente.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
          <input type="text" name="diagnostico" value={funcionario.diagnostico} onChange={handleChange} placeholder="Diagnóstico de Lesión" className="input-field" />
          <input type="date" name="fechaIngreso" value={funcionario.fechaIngreso} onChange={handleChange} placeholder="Fecha de Ingreso al Hospital" className="input-field" />
          <select name="hospitalTraslado" value={funcionario.hospitalTraslado} onChange={handleChange} className="input-field">
            <option value="">Seleccionar Hospital de Traslado</option>
            {hospitalesAutorizados.map(hospital => (
              <option key={hospital} value={hospital}>{hospital}</option>
            ))}
          </select>
          <textarea name="observacionesLesion" value={funcionario.observacionesLesion} onChange={handleChange} placeholder="Observaciones de la Lesión / Accidente" className="input-field col-span-full resize-y min-h-[80px]"></textarea>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contabilidad de Gastos Médicos</h3>
        <div className="space-y-4 mb-4">
          {funcionario.gastos.map((gasto, index) => (
            <div key={gasto.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
              <div>
                <p className="font-medium">{gasto.concepto} - {gasto.fecha}</p>
                <p className="text-sm text-gray-700">Monto: L. {gasto.monto.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="date" name="fecha" value={newGasto.fecha} onChange={handleGastoChange} placeholder="Fecha del Gasto" className="input-field" />
          <input type="text" name="concepto" value={newGasto.concepto} onChange={handleGastoChange} placeholder="Concepto del Gasto" className="input-field" />
          <input type="number" name="monto" value={newGasto.monto} onChange={handleGastoChange} placeholder="Monto (L.)" className="input-field" step="0.01" />
        </div>
        <button type="button" onClick={addGasto} className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold shadow-md">
          Agregar Gasto
        </button>
        <p className="text-lg font-bold text-gray-800 mt-4">Total de Gastos: L. {funcionario.totalGastos.toFixed(2)}</p>
      </section>

      <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg shadow-md">
        Registrar Funcionario Lesionado
      </button>
    </form>
  );
};