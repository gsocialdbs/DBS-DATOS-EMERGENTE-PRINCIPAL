// Servicio de base de datos adaptado para usar FastAPI en lugar de Supabase

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Helper function para manejar respuestas HTTP
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// ================== PACIENTES ==================
export const pacientesService = {
  // Obtener todos los pacientes
  async getAll() {
    try {
      console.log('Cargando pacientes desde API...')
      const response = await fetch(`${API}/pacientes`);
      const data = await handleResponse(response);
      
      console.log('Pacientes cargados:', data?.length || 0)
      return data || []
    } catch (err) {
      console.error('Error en getAll pacientes:', err)
      return []
    }
  },

  // Crear nuevo paciente
  async create(paciente) {
    try {
      console.log('Creando paciente:', paciente.nombre)
      const response = await fetch(`${API}/pacientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paciente)
      });
      
      const data = await handleResponse(response);
      console.log('Paciente creado exitosamente:', data.id)
      return data
    } catch (err) {
      console.error('Error en create paciente:', err)
      throw err
    }
  },

  // Actualizar paciente
  async update(id, updates) {
    try {
      const response = await fetch(`${API}/pacientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      
      const data = await handleResponse(response);
      return data
    } catch (err) {
      console.error('Error en update paciente:', err)
      throw err
    }
  },

  // Eliminar paciente
  async delete(id) {
    try {
      const response = await fetch(`${API}/pacientes/${id}`, {
        method: 'DELETE'
      });
      
      await handleResponse(response);
    } catch (err) {
      console.error('Error en delete paciente:', err)
      throw err
    }
  }
}

// ================== VISITAS ==================
export const visitasService = {
  // Crear nueva visita
  async create(visita) {
    try {
      const response = await fetch(`${API}/visitas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visita)
      });
      
      return await handleResponse(response);
    } catch (err) {
      console.error('Error creando visita:', err)
      throw err
    }
  },

  // Obtener visitas por paciente
  async getByPaciente(pacienteId) {
    try {
      const response = await fetch(`${API}/visitas/paciente/${pacienteId}`);
      return await handleResponse(response);
    } catch (err) {
      console.error('Error obteniendo visitas:', err)
      throw err
    }
  },

  // Eliminar visita
  async delete(id) {
    try {
      const response = await fetch(`${API}/visitas/${id}`, {
        method: 'DELETE'
      });
      
      await handleResponse(response);
    } catch (err) {
      console.error('Error eliminando visita:', err)
      throw err
    }
  }
}

// ================== FUNCIONARIOS LESIONADOS ==================
export const funcionariosService = {
  // Obtener todos los funcionarios lesionados
  async getAll() {
    try {
      const response = await fetch(`${API}/funcionarios-lesionados`);
      return await handleResponse(response);
    } catch (err) {
      console.error('Error obteniendo funcionarios lesionados:', err)
      throw err
    }
  },

  // Crear nuevo funcionario lesionado
  async create(funcionario) {
    try {
      console.log('Datos recibidos para funcionario:', funcionario);
      
      // Mapear campos del formulario a campos de la API
      const funcionarioData = {
        funcionario_nombre: funcionario.nombre || funcionario.funcionario_nombre,
        funcionario_policial: funcionario.funcionario || funcionario.funcionario_policial,
        no_expediente: funcionario.expediente || funcionario.no_expediente,
        miembro_amputado: funcionario.miembro || funcionario.miembro_amputado,
        hospital_traslado: funcionario.hospital || funcionario.hospital_traslado,
        total_gastos: funcionario.gastos ? parseFloat(funcionario.gastos) : (funcionario.total_gastos || 0)
      };
      
      console.log('Datos mapeados para API:', funcionarioData);
      
      const response = await fetch(`${API}/funcionarios-lesionados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(funcionarioData)
      });
      
      const data = await handleResponse(response);
      console.log('Funcionario creado exitosamente:', data);
      return data
    } catch (err) {
      console.error('Error creando funcionario lesionado:', err)
      throw err
    }
  },

  // Actualizar funcionario lesionado
  async update(id, updates) {
    try {
      const response = await fetch(`${API}/funcionarios-lesionados/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      
      return await handleResponse(response);
    } catch (err) {
      console.error('Error actualizando funcionario lesionado:', err)
      throw err
    }
  },

  // Eliminar funcionario lesionado
  async delete(id) {
    try {
      const response = await fetch(`${API}/funcionarios-lesionados/${id}`, {
        method: 'DELETE'
      });
      
      await handleResponse(response);
    } catch (err) {
      console.error('Error eliminando funcionario lesionado:', err)
      throw err
    }
  }
}

// ================== FALLECIDOS ==================
export const fallecidosService = {
  // Obtener todos los fallecidos
  async getAll() {
    try {
      const response = await fetch(`${API}/fallecidos`);
      return await handleResponse(response);
    } catch (err) {
      console.error('Error obteniendo fallecidos:', err)
      throw err
    }
  },

  // Crear nuevo fallecido
  async create(fallecido) {
    try {
      console.log('Datos recibidos para fallecido:', fallecido);
      
      // Mapear campos del formulario a campos de la API
      const fallecidoData = {
        policia_fallecido: fallecido.nombre || fallecido.policia_fallecido,
        no_expediente: fallecido.expediente || fallecido.no_expediente,
        causa_muerte: fallecido.causa || fallecido.causa_muerte,
        fecha_muerte: fallecido.fecha || fallecido.fecha_muerte,
        lugar_muerte: fallecido.lugar || fallecido.lugar_muerte,
        beneficiarios: fallecido.beneficiarios
      };
      
      console.log('Datos mapeados para API:', fallecidoData);
      
      const response = await fetch(`${API}/fallecidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fallecidoData)
      });
      
      const data = await handleResponse(response);
      console.log('Fallecido creado exitosamente:', data);
      return data
    } catch (err) {
      console.error('Error creando fallecido:', err)
      throw err
    }
  },

  // Actualizar fallecido
  async update(id, updates) {
    try {
      const response = await fetch(`${API}/fallecidos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      
      return await handleResponse(response);
    } catch (err) {
      console.error('Error actualizando fallecido:', err)
      throw err
    }
  },

  // Eliminar fallecido
  async delete(id) {
    try {
      const response = await fetch(`${API}/fallecidos/${id}`, {
        method: 'DELETE'
      });
      
      await handleResponse(response);
    } catch (err) {
      console.error('Error eliminando fallecido:', err)
      throw err
    }
  }
}

// ================== INDEMNIZACIONES ==================
export const indemnizacionesService = {
  // Obtener todas las indemnizaciones
  async getAll() {
    try {
      const response = await fetch(`${API}/indemnizaciones`);
      return await handleResponse(response);
    } catch (err) {
      console.error('Error obteniendo indemnizaciones:', err)
      throw err
    }
  },

  // Crear nueva indemnización
  async create(indemnizacion) {
    try {
      console.log('Datos recibidos para indemnización:', indemnizacion);
      
      // Mapear campos del formulario a campos de la API
      const indemnizacionData = {
        funcionario_policial: indemnizacion.funcionario || indemnizacion.funcionario_policial,
        no_expediente: indemnizacion.expediente || indemnizacion.no_expediente,
        estado_expediente: indemnizacion.estado || indemnizacion.estado_expediente,
        suma_pagar: indemnizacion.suma ? parseFloat(indemnizacion.suma) : (indemnizacion.suma_pagar || 0),
        causa_indemnizacion: indemnizacion.causa || indemnizacion.causa_indemnizacion,
        fecha_solicitud: indemnizacion.fecha || indemnizacion.fecha_solicitud,
        observaciones: indemnizacion.observaciones
      };
      
      console.log('Datos mapeados para API:', indemnizacionData);
      
      const response = await fetch(`${API}/indemnizaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(indemnizacionData)
      });
      
      const data = await handleResponse(response);
      console.log('Indemnización creada exitosamente:', data);
      return data
    } catch (err) {
      console.error('Error creando indemnización:', err)
      throw err
    }
  },

  // Actualizar indemnización
  async update(id, updates) {
    try {
      const response = await fetch(`${API}/indemnizaciones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      
      return await handleResponse(response);
    } catch (err) {
      console.error('Error actualizando indemnización:', err)
      throw err
    }
  },

  // Eliminar indemnización
  async delete(id) {
    try {
      const response = await fetch(`${API}/indemnizaciones/${id}`, {
        method: 'DELETE'
      });
      
      await handleResponse(response);
    } catch (err) {
      console.error('Error eliminando indemnización:', err)
      throw err
    }
  }
}