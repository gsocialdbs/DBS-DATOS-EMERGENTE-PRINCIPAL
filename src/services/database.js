import { supabase } from '../lib/supabase'

// ================== PACIENTES ==================
export const pacientesService = {
  // Obtener todos los pacientes
  async getAll() {
    try {
      console.log('Cargando pacientes desde Supabase...')
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error obteniendo pacientes:', error)
        throw error
      }
      
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
      const { data, error } = await supabase
        .from('pacientes')
        .insert([paciente])
        .select()
        .single()
      
      if (error) {
        console.error('Error creando paciente:', error)
        throw error
      }
      
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
      const { data, error } = await supabase
        .from('pacientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error actualizando paciente:', error)
        throw error
      }
      return data
    } catch (err) {
      console.error('Error en update paciente:', err)
      throw err
    }
  },

  // Eliminar paciente
  async delete(id) {
    try {
      const { error } = await supabase
        .from('pacientes')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error eliminando paciente:', error)
        throw error
      }
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
    const { data, error } = await supabase
      .from('visitas')
      .insert([visita])
      .select()
      .single()
    
    if (error) {
      console.error('Error creando visita:', error)
      throw error
    }
    return data
  },

  // Obtener visitas por paciente
  async getByPaciente(pacienteId) {
    const { data, error } = await supabase
      .from('visitas')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('fecha_visita', { ascending: false })
    
    if (error) {
      console.error('Error obteniendo visitas:', error)
      throw error
    }
    return data
  },

  // Eliminar visita
  async delete(id) {
    const { error } = await supabase
      .from('visitas')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error eliminando visita:', error)
      throw error
    }
  }
}

// ================== FUNCIONARIOS LESIONADOS ==================
export const funcionariosService = {
  // Obtener todos los funcionarios lesionados
  async getAll() {
    const { data, error } = await supabase
      .from('funcionarios_lesionados')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error obteniendo funcionarios lesionados:', error)
      throw error
    }
    return data
  },

  // Crear nuevo funcionario lesionado
  async create(funcionario) {
    console.log('Datos recibidos para funcionario:', funcionario);
    
    // Mapear campos del formulario a campos de la BD
    const funcionarioData = {
      funcionario_nombre: funcionario.nombre || funcionario.funcionario_nombre,
      funcionario_policial: funcionario.funcionario || funcionario.funcionario_policial,
      no_expediente: funcionario.expediente || funcionario.no_expediente,
      miembro_amputado: funcionario.miembro || funcionario.miembro_amputado,
      hospital_traslado: funcionario.hospital || funcionario.hospital_traslado,
      total_gastos: funcionario.gastos ? parseFloat(funcionario.gastos) : (funcionario.total_gastos || 0)
    };
    
    console.log('Datos mapeados para BD:', funcionarioData);
    
    const { data, error } = await supabase
      .from('funcionarios_lesionados')
      .insert([funcionarioData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creando funcionario lesionado:', error)
      throw error
    }
    
    console.log('Funcionario creado exitosamente:', data);
    return data
  },

  // Actualizar funcionario lesionado
  async update(id, updates) {
    const { data, error } = await supabase
      .from('funcionarios_lesionados')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error actualizando funcionario lesionado:', error)
      throw error
    }
    return data
  },

  // Eliminar funcionario lesionado
  async delete(id) {
    const { error } = await supabase
      .from('funcionarios_lesionados')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error eliminando funcionario lesionado:', error)
      throw error
    }
  }
}

// ================== FALLECIDOS ==================
export const fallecidosService = {
  // Obtener todos los fallecidos
  async getAll() {
    const { data, error } = await supabase
      .from('fallecidos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error obteniendo fallecidos:', error)
      throw error
    }
    return data
  },

  // Crear nuevo fallecido
  async create(fallecido) {
    console.log('Datos recibidos para fallecido:', fallecido);
    
    // Mapear campos del formulario a campos de la BD
    const fallecidoData = {
      policia_fallecido: fallecido.nombre || fallecido.policia_fallecido,
      no_expediente: fallecido.expediente || fallecido.no_expediente,
      causa_muerte: fallecido.causa || fallecido.causa_muerte,
      fecha_muerte: fallecido.fecha || fallecido.fecha_muerte,
      lugar_muerte: fallecido.lugar || fallecido.lugar_muerte,
      beneficiarios: fallecido.beneficiarios
    };
    
    console.log('Datos mapeados para BD:', fallecidoData);
    
    const { data, error } = await supabase
      .from('fallecidos')
      .insert([fallecidoData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creando fallecido:', error)
      throw error
    }
    
    console.log('Fallecido creado exitosamente:', data);
    return data
  },

  // Actualizar fallecido
  async update(id, updates) {
    const { data, error } = await supabase
      .from('fallecidos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error actualizando fallecido:', error)
      throw error
    }
    return data
  },

  // Eliminar fallecido
  async delete(id) {
    const { error } = await supabase
      .from('fallecidos')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error eliminando fallecido:', error)
      throw error
    }
  }
}

// ================== INDEMNIZACIONES ==================
export const indemnizacionesService = {
  // Obtener todas las indemnizaciones
  async getAll() {
    const { data, error } = await supabase
      .from('indemnizaciones')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error obteniendo indemnizaciones:', error)
      throw error
    }
    return data
  },

  // Crear nueva indemnización
  async create(indemnizacion) {
    console.log('Datos recibidos para indemnización:', indemnizacion);
    
    // Mapear campos del formulario a campos de la BD
    const indemnizacionData = {
      funcionario_policial: indemnizacion.funcionario || indemnizacion.funcionario_policial,
      no_expediente: indemnizacion.expediente || indemnizacion.no_expediente,
      estado_expediente: indemnizacion.estado || indemnizacion.estado_expediente,
      suma_pagar: indemnizacion.suma ? parseFloat(indemnizacion.suma) : (indemnizacion.suma_pagar || 0),
      causa_indemnizacion: indemnizacion.causa || indemnizacion.causa_indemnizacion,
      fecha_solicitud: indemnizacion.fecha || indemnizacion.fecha_solicitud,
      observaciones: indemnizacion.observaciones
    };
    
    console.log('Datos mapeados para BD:', indemnizacionData);
    
    const { data, error } = await supabase
      .from('indemnizaciones')
      .insert([indemnizacionData])
      .select()
      .single()
    
    if (error) {
      console.error('Error creando indemnización:', error)
      throw error
    }
    
    console.log('Indemnización creada exitosamente:', data);
    return data
  },

  // Actualizar indemnización
  async update(id, updates) {
    const { data, error } = await supabase
      .from('indemnizaciones')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error actualizando indemnización:', error)
      throw error
    }
    return data
  },

  // Eliminar indemnización
  async delete(id) {
    const { error } = await supabase
      .from('indemnizaciones')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error eliminando indemnización:', error)
      throw error
    }
  }
}