-- Esquema de base de datos para el Sistema de Bienestar Social
-- Ejecutar este script en el SQL Editor de Supabase

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS pacientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  dni VARCHAR(20) NOT NULL,
  grado VARCHAR(100),
  edad INTEGER,
  sexo VARCHAR(20),
  promocion VARCHAR(100),
  anio_ingreso INTEGER,
  tiempo_institucion VARCHAR(100),
  direccion_perteneces VARCHAR(255),
  asignacion VARCHAR(255),
  lugar_asignacion VARCHAR(255),
  donde_vive VARCHAR(255),
  celular VARCHAR(20),
  
  -- Información médica
  diagnostico TEXT,
  fecha_ingreso DATE,
  motivo_ingreso VARCHAR(100),
  accidente_detalles TEXT,
  quien_traslado VARCHAR(255),
  hospital VARCHAR(255),
  sala VARCHAR(100),
  cama VARCHAR(100),
  
  -- Información familiar
  familiar_nombre VARCHAR(255),
  familiar_parentesco VARCHAR(100),
  familiar_celular VARCHAR(20),
  
  -- Estado y alta
  status VARCHAR(50) DEFAULT 'interno',
  fecha_alta DATE,
  observaciones_alta TEXT,
  dias_incapacidad INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de visitas
CREATE TABLE IF NOT EXISTS visitas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  visita_nombre VARCHAR(255) NOT NULL,
  visita_grado VARCHAR(100),
  visita_direccion VARCHAR(255),
  acompanantes TEXT,
  fecha_visita DATE NOT NULL,
  notas TEXT,
  imagenes_visita TEXT[], -- Array de URLs de imágenes
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de funcionarios lesionados
CREATE TABLE IF NOT EXISTS funcionarios_lesionados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_nombre VARCHAR(255) NOT NULL,
  funcionario_policial VARCHAR(255),
  no_expediente VARCHAR(100),
  miembro_amputado VARCHAR(255),
  hospital_traslado VARCHAR(255),
  gastos JSONB, -- Para almacenar múltiples gastos
  total_gastos DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de fallecidos
CREATE TABLE IF NOT EXISTS fallecidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  policia_fallecido VARCHAR(255) NOT NULL,
  no_expediente VARCHAR(100),
  causa_muerte TEXT,
  fecha_muerte DATE,
  lugar_muerte VARCHAR(255),
  beneficiarios TEXT,
  documentos_adjuntos TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de indemnizaciones
CREATE TABLE IF NOT EXISTS indemnizaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funcionario_policial VARCHAR(255) NOT NULL,
  no_expediente VARCHAR(100),
  estado_expediente VARCHAR(100),
  suma_pagar DECIMAL(10,2),
  causa_indemnizacion TEXT,
  fecha_solicitud DATE,
  fecha_pago DATE,
  observaciones TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_pacientes_dni ON pacientes(dni);
CREATE INDEX IF NOT EXISTS idx_pacientes_status ON pacientes(status);
CREATE INDEX IF NOT EXISTS idx_visitas_paciente_id ON visitas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_funcionarios_expediente ON funcionarios_lesionados(no_expediente);
CREATE INDEX IF NOT EXISTS idx_fallecidos_expediente ON fallecidos(no_expediente);
CREATE INDEX IF NOT EXISTS idx_indemnizaciones_expediente ON indemnizaciones(no_expediente);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_pacientes_updated_at BEFORE UPDATE ON pacientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funcionarios_lesionados_updated_at BEFORE UPDATE ON funcionarios_lesionados
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fallecidos_updated_at BEFORE UPDATE ON fallecidos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_indemnizaciones_updated_at BEFORE UPDATE ON indemnizaciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios_lesionados ENABLE ROW LEVEL SECURITY;
ALTER TABLE fallecidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE indemnizaciones ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad básicas (permitir todo por ahora)
CREATE POLICY "Enable all access for all users" ON pacientes FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON visitas FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON funcionarios_lesionados FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON fallecidos FOR ALL USING (true);
CREATE POLICY "Enable all access for all users" ON indemnizaciones FOR ALL USING (true);