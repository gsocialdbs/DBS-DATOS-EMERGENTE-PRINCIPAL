import React, { useState, useEffect } from 'react';
import { LayoutHeader } from './components/LayoutHeader';
import { BitacoraMain } from './components/BitacoraMain';
import { FallecidosMain } from './components/FallecidosMain';
import { FuncionariosLesionadosMain } from './components/FuncionariosLesionadosMain';
import { IndemnizacionesMain } from './components/IndemnizacionesMain';
import { ProtectedRoute } from './components/ProtectedRoute';
import { authService } from './services/auth';
import { 
  pacientesService, 
  funcionariosService, 
  fallecidosService, 
  indemnizacionesService 
} from './services/database';

export default function App() {
  // Estados para autenticación
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState(null);
  
  // Estados para datos
  const [patients, setPatients] = useState([]);
  const [fallecidos, setFallecidos] = useState([]);
  const [funcionariosLesionados, setFuncionariosLesionados] = useState([]);
  const [indemnizaciones, setIndemnizaciones] = useState([]);
  
  // Estados para UI
  const [activeTab, setActiveTab] = useState('bitacora');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar sesión al cargar la aplicación
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadAllData();
    } else {
      setLoading(false);
    }
  }, []);

  // Función de login
  const handleLogin = async (credentials) => {
    try {
      setLoginError(null);
      const userData = await authService.login(credentials);
      setUser(userData);
      await loadAllData();
    } catch (err) {
      setLoginError(err.message);
      throw err;
    }
  };

  // Función de logout
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setPatients([]);
    setFallecidos([]);
    setFuncionariosLesionados([]);
    setIndemnizaciones([]);
    setActiveTab('bitacora');
  };

  const loadAllData = async () => {
    try {
      console.log('Iniciando carga de datos...')
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const patientsData = await pacientesService.getAll();
      console.log('Datos de pacientes cargados:', patientsData)

      const fallecidosData = await fallecidosService.getAll();
      const funcionariosData = await funcionariosService.getAll();
      const indemnizacionesData = await indemnizacionesService.getAll();

      setPatients(patientsData || []);
      setFallecidos(fallecidosData || []);
      setFuncionariosLesionados(funcionariosData || []);
      setIndemnizaciones(indemnizacionesData || []);

      console.log('Todos los datos cargados exitosamente')
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError(`Error al cargar los datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ================== FUNCIONES PARA PACIENTES ==================
  const addPatient = async (newPatient) => {
    try {
      // Convertir el objeto para que coincida con la estructura de la base de datos
      const patientData = {
        nombre: newPatient.nombre,
        dni: newPatient.dni,
        grado: newPatient.grado,
        edad: newPatient.edad ? parseInt(newPatient.edad) : null,
        sexo: newPatient.sexo,
        promocion: newPatient.promocion,
        anio_ingreso: newPatient.anioIngreso ? parseInt(newPatient.anioIngreso) : null,
        tiempo_institucion: newPatient.tiempoInstitucion,
        direccion_perteneces: newPatient.direccionPerteneces,
        asignacion: newPatient.asignacion,
        lugar_asignacion: newPatient.lugarAsignacion,
        donde_vive: newPatient.dondeVive,
        celular: newPatient.celular,
        diagnostico: newPatient.diagnostico,
        fecha_ingreso: newPatient.fechaIngreso || null,
        motivo_ingreso: newPatient.motivoIngreso,
        accidente_detalles: newPatient.accidenteDetalles,
        quien_traslado: newPatient.quienTraslado,
        hospital: newPatient.hospital,
        sala: newPatient.sala,
        cama: newPatient.cama,
        familiar_nombre: newPatient.familiarNombre,
        familiar_parentesco: newPatient.familiarParentesco,
        familiar_celular: newPatient.familiarCelular,
        status: newPatient.status || 'interno',
        fecha_alta: newPatient.fechaAlta || null,
        observaciones_alta: newPatient.observacionesAlta,
        dias_incapacidad: newPatient.diasIncapacidad ? parseInt(newPatient.diasIncapacidad) : null
      };

      console.log('Agregando paciente:', patientData.nombre)
      const createdPatient = await pacientesService.create(patientData);
      
      // Recargar todos los pacientes desde la base de datos
      const updatedPatients = await pacientesService.getAll();
      setPatients(updatedPatients || []);
      
      console.log('Paciente agregado y lista actualizada')
      return createdPatient;
    } catch (err) {
      console.error('Error agregando paciente:', err);
      setError('Error al agregar el paciente. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  const deletePatient = async (id) => {
    try {
      await pacientesService.delete(id);
      setPatients(prevPatients => prevPatients.filter(patient => patient.id !== id));
    } catch (err) {
      console.error('Error eliminando paciente:', err);
      setError('Error al eliminar el paciente. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  const updatePatientStatus = async (id, newStatus, dischargeInfo = {}) => {
    try {
      const updates = {
        status: newStatus,
        ...dischargeInfo
      };

      const updatedPatient = await pacientesService.update(id, updates);
      setPatients(prevPatients =>
        prevPatients.map(patient =>
          patient.id === id ? { ...patient, ...updates } : patient
        )
      );
      return updatedPatient;
    } catch (err) {
      console.error('Error actualizando estado del paciente:', err);
      setError('Error al actualizar el estado del paciente. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  const updatePatient = async (updatedPatient) => {
    try {
      // Convertir el objeto para que coincida con la estructura de la base de datos
      const patientData = {
        ...updatedPatient,
        anio_ingreso: updatedPatient.anioIngreso,
        tiempo_institucion: updatedPatient.tiempoInstitucion,
        direccion_perteneces: updatedPatient.direccionPerteneces,
        lugar_asignacion: updatedPatient.lugarAsignacion,
        donde_vive: updatedPatient.dondeVive,
        fecha_ingreso: updatedPatient.fechaIngreso,
        motivo_ingreso: updatedPatient.motivoIngreso,
        accidente_detalles: updatedPatient.accidenteDetalles,
        quien_traslado: updatedPatient.quienTraslado,
        familiar_nombre: updatedPatient.familiarNombre,
        familiar_parentesco: updatedPatient.familiarParentesco,
        familiar_celular: updatedPatient.familiarCelular,
        fecha_alta: updatedPatient.fechaAlta,
        observaciones_alta: updatedPatient.observacionesAlta,
        dias_incapacidad: updatedPatient.diasIncapacidad
      };

      await pacientesService.update(updatedPatient.id, patientData);
      setPatients(prevPatients =>
        prevPatients.map(patient =>
          patient.id === updatedPatient.id ? { ...patient, ...updatedPatient } : patient
        )
      );
    } catch (err) {
      console.error('Error actualizando paciente:', err);
      setError('Error al actualizar el paciente. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  // ================== FUNCIONES PARA FALLECIDOS ==================
  const addFallecido = async (newFallecido) => {
    try {
      const fallecidoData = {
        ...newFallecido,
        policia_fallecido: newFallecido.policiaFallecido,
        no_expediente: newFallecido.noExpediente,
        causa_muerte: newFallecido.causaMuerte,
        fecha_muerte: newFallecido.fechaMuerte,
        lugar_muerte: newFallecido.lugarMuerte,
        documentos_adjuntos: newFallecido.documentosAdjuntos || []
      };

      const createdFallecido = await fallecidosService.create(fallecidoData);
      setFallecidos(prevFallecidos => [createdFallecido, ...prevFallecidos]);
      return createdFallecido;
    } catch (err) {
      console.error('Error agregando fallecido:', err);
      setError('Error al agregar el fallecido. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  const onDeleteFallecido = async (id) => {
    try {
      await fallecidosService.delete(id);
      setFallecidos(prevFallecidos => prevFallecidos.filter(fallecido => fallecido.id !== id));
    } catch (err) {
      console.error('Error eliminando fallecido:', err);
      setError('Error al eliminar el fallecido. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  // ================== FUNCIONES PARA FUNCIONARIOS LESIONADOS ==================
  const addFuncionarioLesionado = async (newFuncionario) => {
    try {
      const funcionarioData = {
        ...newFuncionario,
        funcionario_nombre: newFuncionario.funcionarioNombre,
        funcionario_policial: newFuncionario.funcionarioPolicial,
        no_expediente: newFuncionario.noExpediente,
        miembro_amputado: newFuncionario.miembroAmputado,
        hospital_traslado: newFuncionario.hospitalTraslado,
        total_gastos: newFuncionario.totalGastos || 0
      };

      const createdFuncionario = await funcionariosService.create(funcionarioData);
      setFuncionariosLesionados(prev => [createdFuncionario, ...prev]);
      return createdFuncionario;
    } catch (err) {
      console.error('Error agregando funcionario lesionado:', err);
      setError('Error al agregar el funcionario lesionado. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  const onDeleteFuncionarioLesionado = async (id) => {
    try {
      await funcionariosService.delete(id);
      setFuncionariosLesionados(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error('Error eliminando funcionario lesionado:', err);
      setError('Error al eliminar el funcionario lesionado. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  // ================== FUNCIONES PARA INDEMNIZACIONES ==================
  const addIndemnizacion = async (newIndemnizacion) => {
    try {
      const indemnizacionData = {
        ...newIndemnizacion,
        funcionario_policial: newIndemnizacion.funcionarioPolicial,
        no_expediente: newIndemnizacion.noExpediente,
        estado_expediente: newIndemnizacion.estadoExpediente,
        suma_pagar: newIndemnizacion.sumaPagar,
        causa_indemnizacion: newIndemnizacion.causaIndemnizacion,
        fecha_solicitud: newIndemnizacion.fechaSolicitud,
        fecha_pago: newIndemnizacion.fechaPago
      };

      const createdIndemnizacion = await indemnizacionesService.create(indemnizacionData);
      setIndemnizaciones(prev => [createdIndemnizacion, ...prev]);
      return createdIndemnizacion;
    } catch (err) {
      console.error('Error agregando indemnización:', err);
      setError('Error al agregar la indemnización. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  const onDeleteIndemnizacion = async (id) => {
    try {
      await indemnizacionesService.delete(id);
      setIndemnizaciones(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error('Error eliminando indemnización:', err);
      setError('Error al eliminar la indemnización. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  const updateIndemnizacion = async (updatedIndemnizacion) => {
    try {
      const indemnizacionData = {
        ...updatedIndemnizacion,
        funcionario_policial: updatedIndemnizacion.funcionarioPolicial,
        no_expediente: updatedIndemnizacion.noExpediente,
        estado_expediente: updatedIndemnizacion.estadoExpediente,
        suma_pagar: updatedIndemnizacion.sumaPagar,
        causa_indemnizacion: updatedIndemnizacion.causaIndemnizacion,
        fecha_solicitud: updatedIndemnizacion.fechaSolicitud,
        fecha_pago: updatedIndemnizacion.fechaPago
      };

      await indemnizacionesService.update(updatedIndemnizacion.id, indemnizacionData);
      setIndemnizaciones(prev =>
        prev.map(i =>
          i.id === updatedIndemnizacion.id ? { ...i, ...updatedIndemnizacion } : i
        )
      );
    } catch (err) {
      console.error('Error actualizando indemnización:', err);
      setError('Error al actualizar la indemnización. Por favor, intenta de nuevo.');
      throw err;
    }
  };

  // Mostrar pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si hay alguno
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Conexión</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadAllData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute 
      user={user} 
      onLogin={handleLogin} 
      onLogout={handleLogout}
      loginError={loginError}
    >
      {/* Mostrar pantalla de carga */}
      {loading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      ) : error ? (
        // Mostrar error si hay alguno
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Conexión</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadAllData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : (
        // Contenido principal de la aplicación
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
          <LayoutHeader onTabChange={setActiveTab} />
          <main className="container mx-auto px-4 py-8 space-y-8">
            {activeTab === 'bitacora' && (
              <BitacoraMain
                patients={patients}
                onAddPatient={addPatient}
                onDeletePatient={deletePatient}
                onUpdatePatientStatus={updatePatientStatus}
                onUpdatePatient={updatePatient}
              />
            )}
            {activeTab === 'funcionarios' && (
              <FuncionariosLesionadosMain
                patients={patients}
                funcionariosLesionados={funcionariosLesionados}
                onAddFuncionarioLesionado={addFuncionarioLesionado}
                onDeleteFuncionarioLesionado={onDeleteFuncionarioLesionado}
              />
            )}
            {activeTab === 'fallecidos' && (
              <FallecidosMain
                fallecidos={fallecidos}
                onAddFallecido={addFallecido}
                onDeleteFallecido={onDeleteFallecido}
              />
            )}
            {activeTab === 'indemnizaciones' && (
              <IndemnizacionesMain
                indemnizaciones={indemnizaciones}
                onAddIndemnizacion={addIndemnizacion}
                onDeleteIndemnizacion={onDeleteIndemnizacion}
                onUpdateIndemnizacion={updateIndemnizacion}
              />
            )}
          </main>
        </div>
      )}
    </ProtectedRoute>
  );
}