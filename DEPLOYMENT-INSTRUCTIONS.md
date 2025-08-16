# 🚀 Instrucciones de Despliegue en Vercel

## ✅ Archivos Listos para Despliegue

Tu repositorio ya está configurado correctamente con:

- `package.json` - Configurado para build estático
- `vercel.json` - Configuración de rutas para SPA
- `index.html` - Aplicación completa y funcional

## 📋 Pasos para Desplegar en Vercel

### Opción 1: Configuración Automática (Recomendada)

1. **Ve a tu repositorio en GitHub** (gsocialdbs/DBS-BD-SEGURIDADSOCIAL)

2. **Actualiza los archivos en GitHub**:
   - Sube el `package.json` actualizado
   - Sube el `vercel.json` actualizado  
   - Sube el `index.html` actualizado

3. **Conecta a Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio GitHub
   - ¡Vercel debería detectar automáticamente la configuración!

### Opción 2: Configuración Manual en Vercel

Si necesitas configurar manualmente:

1. **En el Dashboard de Vercel**:
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## 🔧 Configuración Técnica

### package.json - Script de Build
```json
{
  "scripts": {
    "build": "mkdir -p dist && cp index.html dist/index.html"
  }
}
```

### vercel.json - Configuración de Rutas
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/.*",
      "dest": "/index.html"
    }
  ]
}
```

## ✨ Funcionalidades de la Aplicación

- 🔐 **Sistema de Autenticación**
- 👥 **Gestión de Pacientes**
- 🚑 **Funcionarios Lesionados**
- 💐 **Registro de Fallecidos**
- 💰 **Indemnizaciones**
- 💾 **Persistencia con Supabase**

## 🔑 Credenciales de Acceso

- **Usuario**: admin
- **Contraseña**: bienestar2024

## 🆘 Solución de Problemas

### Si el build falla:
1. Verifica que `package.json` tenga el script correcto
2. Asegúrate de que `vercel.json` esté presente
3. Confirma que `index.html` esté en la raíz

### Si la aplicación no carga:
1. Revisa que las rutas en `vercel.json` estén correctas
2. Verifica que Supabase esté funcionando
3. Confirma que el `outputDirectory` sea `dist`

## 📱 URL de la Aplicación

Una vez desplegado, tendrás una URL como:
`https://tu-proyecto.vercel.app`

¡Tu aplicación estará lista para usar! 🎉