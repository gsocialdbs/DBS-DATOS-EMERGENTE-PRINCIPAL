import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StatusCheckApp = () => {
  const [statusChecks, setStatusChecks] = useState([]);
  const [newClientName, setNewClientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar status checks al iniciar
  useEffect(() => {
    fetchStatusChecks();
  }, []);

  const fetchStatusChecks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/status`);
      setStatusChecks(response.data);
      setError("");
    } catch (e) {
      console.error("Error fetching status checks:", e);
      setError("Error al cargar los status checks");
    } finally {
      setLoading(false);
    }
  };

  const createStatusCheck = async (e) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API}/status`, {
        client_name: newClientName.trim()
      });
      
      setStatusChecks([...statusChecks, response.data]);
      setNewClientName("");
      setError("");
    } catch (e) {
      console.error("Error creating status check:", e);
      setError("Error al crear el status check");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">DB</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Sistema de Status Checks
          </h1>
          <p className="text-gray-400 text-lg">
            Gestiona y monitorea los status checks de tus clientes
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Formulario para crear nuevo status check */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">Crear Nuevo Status Check</h2>
          <form onSubmit={createStatusCheck} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Nombre del cliente..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !newClientName.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? "Creando..." : "Crear Status Check"}
            </button>
          </form>
        </div>

        {/* Lista de status checks */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-blue-400">Status Checks Registrados</h2>
            <button
              onClick={fetchStatusChecks}
              disabled={loading}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Actualizar"}
            </button>
          </div>

          {loading && statusChecks.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Cargando status checks...</p>
            </div>
          ) : statusChecks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-gray-400 text-lg mb-2">No hay status checks registrados</p>
              <p className="text-gray-500 text-sm">Crea el primer status check usando el formulario arriba</p>
            </div>
          ) : (
            <div className="space-y-4">
              {statusChecks.map((check, index) => (
                <div
                  key={check.id}
                  className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-blue-500/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white">{check.client_name}</h3>
                        <p className="text-gray-400 text-sm">ID: {check.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Creado el:</p>
                      <p className="text-blue-400 font-medium">{formatDate(check.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>💾 Base de datos: MongoDB | 🚀 Backend: FastAPI | ⚛️ Frontend: React</p>
          <p className="mt-2">🔥 Hecho con Emergent</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return <StatusCheckApp />;
}

export default App;