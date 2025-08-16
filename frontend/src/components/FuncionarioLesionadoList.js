import React, { useState } from 'react';

export const FuncionarioLesionadoList = ({ funcionariosLesionados, onDeleteFuncionarioLesionado }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSexo, setFilterSexo] = useState('todos');
  const [filterGrado, setFilterGrado] = useState('todos');
  const [filterTipoIncidente, setFilterTipoIncidente] = useState('todos');

  const availableGrados = [...new Set(funcionariosLesionados.map(f => f.grado))].sort();
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
    const matchesSearch = funcionario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          funcionario.dni.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSexo = filterSexo === 'todos' || funcionario.sexo === filterSexo;
    const matchesGrado = filterGrado === 'todos' || funcionario.grado === filterGrado;
    const matchesTipoIncidente = filterTipoIncidente === 'todos' || funcionario.tipoIncidente === filterTipoIncidente;
    
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
                <td className="table-cell font-medium text-gray-900">{funcionario.dni}</td>
                <td className="table-cell text-gray-700">{funcionario.nombre}</td>
                <td className="table-cell text-gray-700">{funcionario.grado}</td>
                <td className="table-cell text-gray-700">{funcionario.tipoIncidente}</td>
                <td className="table-cell text-gray-700">{funcionario.hospitalTraslado}</td>
                <td className="table-cell text-gray-700">L. {funcionario.totalGastos.toFixed(2)}</td>
                <td className="table-cell">
                  <button
                    onClick={() => alert(JSON.stringify(funcionario, null, 2))} // Mostrar detalles completos
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
    </div>
  );
};