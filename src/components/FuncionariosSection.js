import React from 'react';

export const FuncionariosSection = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Funcionarios Lesionados</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hospital</label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black" />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors">
              Registrar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};