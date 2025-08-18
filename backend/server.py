from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, date

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ================== MODELOS PYDANTIC ==================

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Modelo para Visitas
class Visita(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    visitaNombre: str
    visitaGrado: Optional[str] = None
    visitaDireccion: Optional[str] = None
    acompanantes: Optional[str] = None
    fechaVisita: Optional[date] = None
    notas: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Modelo para Pacientes
class Paciente(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nombre: str
    dni: str
    grado: Optional[str] = None
    edad: Optional[int] = None
    sexo: Optional[str] = None
    promocion: Optional[str] = None
    anio_ingreso: Optional[int] = None
    tiempo_institucion: Optional[str] = None
    direccion_perteneces: Optional[str] = None
    asignacion: Optional[str] = None
    lugar_asignacion: Optional[str] = None
    donde_vive: Optional[str] = None
    celular: Optional[str] = None
    
    # Información médica
    diagnostico: Optional[str] = None
    fecha_ingreso: Optional[date] = None
    motivo_ingreso: Optional[str] = None
    accidente_detalles: Optional[str] = None
    quien_traslado: Optional[str] = None
    hospital: Optional[str] = None
    sala: Optional[str] = None
    cama: Optional[str] = None
    
    # Información familiar
    familiar_nombre: Optional[str] = None
    familiar_parentesco: Optional[str] = None
    familiar_celular: Optional[str] = None
    
    # Estado y alta
    status: str = Field(default="interno")
    fecha_alta: Optional[date] = None
    observaciones_alta: Optional[str] = None
    dias_incapacidad: Optional[int] = None
    
    # Historial de visitas
    visitas: Optional[List[Dict]] = Field(default_factory=list)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PacienteCreate(BaseModel):
    nombre: str
    dni: str
    grado: Optional[str] = None
    edad: Optional[int] = None
    sexo: Optional[str] = None
    promocion: Optional[str] = None
    anio_ingreso: Optional[int] = None
    tiempo_institucion: Optional[str] = None
    direccion_perteneces: Optional[str] = None
    asignacion: Optional[str] = None
    lugar_asignacion: Optional[str] = None
    donde_vive: Optional[str] = None
    celular: Optional[str] = None
    diagnostico: Optional[str] = None
    fecha_ingreso: Optional[date] = None
    motivo_ingreso: Optional[str] = None
    accidente_detalles: Optional[str] = None
    quien_traslado: Optional[str] = None
    hospital: Optional[str] = None
    sala: Optional[str] = None
    cama: Optional[str] = None
    familiar_nombre: Optional[str] = None
    familiar_parentesco: Optional[str] = None
    familiar_celular: Optional[str] = None
    status: str = Field(default="interno")
    fecha_alta: Optional[date] = None
    observaciones_alta: Optional[str] = None
    dias_incapacidad: Optional[int] = None
    visitas: Optional[List[Dict]] = Field(default_factory=list)

# Modelo para Funcionarios Lesionados
class FuncionarioLesionado(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    funcionario_nombre: str
    funcionario_policial: Optional[str] = None
    no_expediente: Optional[str] = None
    miembro_amputado: Optional[str] = None
    hospital_traslado: Optional[str] = None
    gastos: Optional[Dict[str, Any]] = None
    total_gastos: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class FuncionarioLesionadoCreate(BaseModel):
    funcionario_nombre: str
    funcionario_policial: Optional[str] = None
    no_expediente: Optional[str] = None
    miembro_amputado: Optional[str] = None
    hospital_traslado: Optional[str] = None
    gastos: Optional[Dict[str, Any]] = None
    total_gastos: float = Field(default=0.0)

# Modelo para Fallecidos
class Fallecido(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    policia_fallecido: str
    no_expediente: Optional[str] = None
    causa_muerte: Optional[str] = None
    fecha_muerte: Optional[date] = None
    lugar_muerte: Optional[str] = None
    beneficiarios: Optional[str] = None
    documentos_adjuntos: Optional[List[str]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class FallecidoCreate(BaseModel):
    policia_fallecido: str
    no_expediente: Optional[str] = None
    causa_muerte: Optional[str] = None
    fecha_muerte: Optional[date] = None
    lugar_muerte: Optional[str] = None
    beneficiarios: Optional[str] = None
    documentos_adjuntos: Optional[List[str]] = None

# Modelo para Indemnizaciones
class Indemnizacion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    funcionario_policial: str
    no_expediente: Optional[str] = None
    estado_expediente: Optional[str] = None
    suma_pagar: Optional[float] = None
    causa_indemnizacion: Optional[str] = None
    fecha_solicitud: Optional[date] = None
    fecha_pago: Optional[date] = None
    observaciones: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class IndemnizacionCreate(BaseModel):
    funcionario_policial: str
    no_expediente: Optional[str] = None
    estado_expediente: Optional[str] = None
    suma_pagar: Optional[float] = None
    causa_indemnizacion: Optional[str] = None
    fecha_solicitud: Optional[date] = None
    fecha_pago: Optional[date] = None
    observaciones: Optional[str] = None

# ================== ENDPOINTS ORIGINALES ==================

@api_router.get("/")
async def root():
    return {"message": "DBS - Dirección de Bienestar Social API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# ================== ENDPOINTS PACIENTES ==================

@api_router.get("/pacientes", response_model=List[Paciente])
async def get_pacientes():
    pacientes = await db.pacientes.find().sort("created_at", -1).to_list(1000)
    return [Paciente(**paciente) for paciente in pacientes]

@api_router.post("/pacientes", response_model=Paciente)
async def create_paciente(paciente_data: PacienteCreate):
    paciente = Paciente(**paciente_data.dict())
    paciente_dict = paciente.dict()
    
    # Convertir dates a strings para MongoDB
    if paciente_dict.get('fecha_ingreso'):
        paciente_dict['fecha_ingreso'] = paciente_dict['fecha_ingreso'].isoformat()
    if paciente_dict.get('fecha_alta'):
        paciente_dict['fecha_alta'] = paciente_dict['fecha_alta'].isoformat()
    
    await db.pacientes.insert_one(paciente_dict)
    return paciente

@api_router.put("/pacientes/{paciente_id}", response_model=Paciente)
async def update_paciente(paciente_id: str, updates: dict):
    updates["updated_at"] = datetime.utcnow()
    
    # Convertir dates a strings para MongoDB
    if updates.get('fecha_ingreso') and isinstance(updates['fecha_ingreso'], date):
        updates['fecha_ingreso'] = updates['fecha_ingreso'].isoformat()
    if updates.get('fecha_alta') and isinstance(updates['fecha_alta'], date):
        updates['fecha_alta'] = updates['fecha_alta'].isoformat()
    
    result = await db.pacientes.update_one(
        {"id": paciente_id}, 
        {"$set": updates}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    updated_paciente = await db.pacientes.find_one({"id": paciente_id})
    return Paciente(**updated_paciente)

@api_router.delete("/pacientes/{paciente_id}")
async def delete_paciente(paciente_id: str):
    result = await db.pacientes.delete_one({"id": paciente_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return {"message": "Paciente eliminado exitosamente"}

# ================== ENDPOINTS FUNCIONARIOS LESIONADOS ==================

@api_router.get("/funcionarios-lesionados", response_model=List[FuncionarioLesionado])
async def get_funcionarios_lesionados():
    funcionarios = await db.funcionarios_lesionados.find().sort("created_at", -1).to_list(1000)
    return [FuncionarioLesionado(**funcionario) for funcionario in funcionarios]

@api_router.post("/funcionarios-lesionados", response_model=FuncionarioLesionado)
async def create_funcionario_lesionado(funcionario_data: FuncionarioLesionadoCreate):
    funcionario = FuncionarioLesionado(**funcionario_data.dict())
    await db.funcionarios_lesionados.insert_one(funcionario.dict())
    return funcionario

@api_router.put("/funcionarios-lesionados/{funcionario_id}", response_model=FuncionarioLesionado)
async def update_funcionario_lesionado(funcionario_id: str, updates: dict):
    updates["updated_at"] = datetime.utcnow()
    result = await db.funcionarios_lesionados.update_one(
        {"id": funcionario_id}, 
        {"$set": updates}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Funcionario no encontrado")
    
    updated_funcionario = await db.funcionarios_lesionados.find_one({"id": funcionario_id})
    return FuncionarioLesionado(**updated_funcionario)

@api_router.delete("/funcionarios-lesionados/{funcionario_id}")
async def delete_funcionario_lesionado(funcionario_id: str):
    result = await db.funcionarios_lesionados.delete_one({"id": funcionario_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Funcionario no encontrado")
    return {"message": "Funcionario eliminado exitosamente"}

# ================== ENDPOINTS FALLECIDOS ==================

@api_router.get("/fallecidos", response_model=List[Fallecido])
async def get_fallecidos():
    fallecidos = await db.fallecidos.find().sort("created_at", -1).to_list(1000)
    return [Fallecido(**fallecido) for fallecido in fallecidos]

@api_router.post("/fallecidos", response_model=Fallecido)
async def create_fallecido(fallecido_data: FallecidoCreate):
    fallecido = Fallecido(**fallecido_data.dict())
    fallecido_dict = fallecido.dict()
    
    # Convertir date a string para MongoDB
    if fallecido_dict.get('fecha_muerte'):
        fallecido_dict['fecha_muerte'] = fallecido_dict['fecha_muerte'].isoformat()
    
    await db.fallecidos.insert_one(fallecido_dict)
    return fallecido

@api_router.put("/fallecidos/{fallecido_id}", response_model=Fallecido)
async def update_fallecido(fallecido_id: str, updates: dict):
    updates["updated_at"] = datetime.utcnow()
    
    # Convertir date a string para MongoDB si es necesario
    if updates.get('fecha_muerte') and isinstance(updates['fecha_muerte'], date):
        updates['fecha_muerte'] = updates['fecha_muerte'].isoformat()
    
    result = await db.fallecidos.update_one(
        {"id": fallecido_id}, 
        {"$set": updates}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Fallecido no encontrado")
    
    updated_fallecido = await db.fallecidos.find_one({"id": fallecido_id})
    return Fallecido(**updated_fallecido)

@api_router.delete("/fallecidos/{fallecido_id}")
async def delete_fallecido(fallecido_id: str):
    result = await db.fallecidos.delete_one({"id": fallecido_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Fallecido no encontrado")
    return {"message": "Fallecido eliminado exitosamente"}

# ================== ENDPOINTS INDEMNIZACIONES ==================

@api_router.get("/indemnizaciones", response_model=List[Indemnizacion])
async def get_indemnizaciones():
    indemnizaciones = await db.indemnizaciones.find().sort("created_at", -1).to_list(1000)
    return [Indemnizacion(**indemnizacion) for indemnizacion in indemnizaciones]

@api_router.post("/indemnizaciones", response_model=Indemnizacion)
async def create_indemnizacion(indemnizacion_data: IndemnizacionCreate):
    indemnizacion = Indemnizacion(**indemnizacion_data.dict())
    indemnizacion_dict = indemnizacion.dict()
    
    # Convertir dates a strings para MongoDB
    if indemnizacion_dict.get('fecha_solicitud'):
        indemnizacion_dict['fecha_solicitud'] = indemnizacion_dict['fecha_solicitud'].isoformat()
    if indemnizacion_dict.get('fecha_pago'):
        indemnizacion_dict['fecha_pago'] = indemnizacion_dict['fecha_pago'].isoformat()
    
    await db.indemnizaciones.insert_one(indemnizacion_dict)
    return indemnizacion

@api_router.put("/indemnizaciones/{indemnizacion_id}", response_model=Indemnizacion)
async def update_indemnizacion(indemnizacion_id: str, updates: dict):
    updates["updated_at"] = datetime.utcnow()
    
    # Convertir dates a strings para MongoDB
    if updates.get('fecha_solicitud') and isinstance(updates['fecha_solicitud'], date):
        updates['fecha_solicitud'] = updates['fecha_solicitud'].isoformat()
    if updates.get('fecha_pago') and isinstance(updates['fecha_pago'], date):
        updates['fecha_pago'] = updates['fecha_pago'].isoformat()
    
    result = await db.indemnizaciones.update_one(
        {"id": indemnizacion_id}, 
        {"$set": updates}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Indemnización no encontrada")
    
    updated_indemnizacion = await db.indemnizaciones.find_one({"id": indemnizacion_id})
    return Indemnizacion(**updated_indemnizacion)

@api_router.delete("/indemnizaciones/{indemnizacion_id}")
async def delete_indemnizacion(indemnizacion_id: str):
    result = await db.indemnizaciones.delete_one({"id": indemnizacion_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Indemnización no encontrada")
    return {"message": "Indemnización eliminada exitosamente"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()