# Dashboard Ejecutivo · Escuela de Gobierno (Universidad de La Sabana)

Aplicación web interactiva para la gestión comercial, financiera, roadmap y seguimiento de propuestas de Programas Executive.

---

## 🚀 Despliegue en Railway (Paso a Paso)

El proyecto está 100% preparado para ser detectado y desplegado automáticamente en **Railway** sin necesidad de configurar variables complejas ni base de datos.

### Opción 1: Despliegue desde GitHub (Recomendado)

1. **Subir los cambios a tu repositorio de GitHub:**
   ```bash
   git add .
   git commit -m "Preparar proyecto para despliegue en Railway"
   git push origin main
   ```

2. **Crear el servicio en Railway:**
   - Inicia sesión en [railway.com](https://railway.com/).
   - Haz clic en **"New Project"** (Nuevo Proyecto).
   - Selecciona **"Deploy from GitHub repo"**.
   - Elige el repositorio `Dashboard-Francy`.

3. **Generar el Dominio Público:**
   - Una vez termine de construir (tarda menos de 1 minuto):
   - Ve a la pestaña **Settings** del servicio en Railway.
   - En la sección **Networking**, haz clic en **"Generate Domain"**.
   - ¡Listo! Tendrás tu enlace público HTTPS (ejemplo: `https://dashboard-francy.up.railway.app`).

---

## 🛠️ Estructura del Proyecto

- `index.html`: Dashboard principal interactivo.
- `Dashboard_Executive_Escuela_Gobierno_V12_Corregido.html`: Archivo original de respaldo.
- `server.js`: Servidor HTTP ligero y ultra-rápido en Node.js nativo (sin dependencias externas).
  - Escucha en `0.0.0.0` y respeta la variable de entorno `PORT` inyectada por Railway.
  - Incluye soporte para compresión Gzip.
  - Cuenta con endpoint de salud `/health` para monitorización continua.
- `package.json`: Configuración para que Railway detecte el entorno Node.js automáticamente.
- `railway.json`: Configuración declarativa de build, health check y reinicio para Railway.
- `Procfile`: Definición del proceso web (`web: node server.js`).
- `Dockerfile`: Configuración de contenedor Docker lista por si prefieres compilar vía Docker.

---

## 💻 Ejecución Local

Para probarlo en tu equipo:

```bash
# Con Node.js
npm start
# O directamente
node server.js
```

Abre tu navegador en: [http://localhost:3000](http://localhost:3000)
Endpoint de salud: [http://localhost:3000/health](http://localhost:3000/health)
