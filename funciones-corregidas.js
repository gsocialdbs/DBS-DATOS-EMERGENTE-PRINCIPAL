// FUNCIONES CORREGIDAS - Copiar y pegar para reemplazar las existentes

// Función para funcionarios lesionados (CORREGIDA)
async function insertarFuncionario(datos) {
    try {
        console.log('Insertando funcionario:', datos);
        
        const { data, error } = await supabase
            .from('funcionarios_lesionados')
            .insert([{
                funcionario_nombre: datos.funcionarioNombre || datos.nombre,
                funcionario_policial: datos.funcionarioPolicial || datos.policial,
                no_expediente: datos.noExpediente || datos.expediente,
                miembro_amputado: datos.miembroAmputado || datos.miembro,
                hospital_traslado: datos.hospitalTraslado || datos.hospital,
                total_gastos: parseFloat(datos.totalGastos || datos.gastos) || 0
            }])
            .select();

        if (error) {
            console.error('Error insertando funcionario:', error);
            throw error;
        }

        console.log('Funcionario insertado exitosamente:', data);
        alert('✅ Funcionario lesionado guardado correctamente');
        return data[0];
    } catch (err) {
        console.error('Error completo:', err);
        alert('❌ Error: ' + err.message);
        throw err;
    }
}

// Función para fallecidos (CORREGIDA)
async function insertarFallecido(datos) {
    try {
        console.log('Insertando fallecido:', datos);
        
        const { data, error } = await supabase
            .from('fallecidos')
            .insert([{
                policia_fallecido: datos.policiaFallecido || datos.nombre,
                no_expediente: datos.noExpediente || datos.expediente,
                causa_muerte: datos.causaMuerte || datos.causa,
                fecha_muerte: datos.fechaMuerte || datos.fecha,
                lugar_muerte: datos.lugarMuerte || datos.lugar,
                beneficiarios: datos.beneficiarios
            }])
            .select();

        if (error) {
            console.error('Error insertando fallecido:', error);
            throw error;
        }

        console.log('Fallecido insertado exitosamente:', data);
        alert('✅ Información de fallecido guardada correctamente');
        return data[0];
    } catch (err) {
        console.error('Error completo:', err);
        alert('❌ Error: ' + err.message);
        throw err;
    }
}

// Función para indemnizaciones (CORREGIDA)
async function insertarIndemnizacion(datos) {
    try {
        console.log('Insertando indemnización:', datos);
        
        const { data, error } = await supabase
            .from('indemnizaciones')
            .insert([{
                funcionario_policial: datos.funcionarioPolicial || datos.funcionario,
                no_expediente: datos.noExpediente || datos.expediente,
                estado_expediente: datos.estadoExpediente || datos.estado,
                suma_pagar: parseFloat(datos.sumaPagar || datos.suma) || 0,
                causa_indemnizacion: datos.causaIndemnizacion || datos.causa,
                fecha_solicitud: datos.fechaSolicitud || datos.fecha,
                observaciones: datos.observaciones
            }])
            .select();

        if (error) {
            console.error('Error insertando indemnización:', error);
            throw error;
        }

        console.log('Indemnización insertada exitosamente:', data);
        alert('✅ Indemnización guardada correctamente');
        return data[0];
    } catch (err) {
        console.error('Error completo:', err);
        alert('❌ Error: ' + err.message);
        throw err;
    }
}