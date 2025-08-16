import React from 'react';

export const VisitasHeader = () => (
  <header className="sticky top-0 z-50 bg-white shadow-sm">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-800">Registro Hospitalario</h1>
      <nav className="flex space-x-6">
        <button className="text-gray-600 hover:text-black transition-colors">Inicio</button>
        <button className="text-gray-600 hover:text-black transition-colors">Visitas</button>
        <button className="text-gray-600 hover:text-black transition-colors">Fallecidos</button>
      </nav>
    </div>
  </header>
);