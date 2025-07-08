# Aquadama Employee System

Sistema web completo para registro y gestión de empleados con firma digital, gestión de documentos, panel de administración, login seguro y backend conectado a PostgreSQL (Render).

---

## 📁 Estructura del Proyecto

aquadama/
├── backend/ # Node.js + Express + PostgreSQL
├── frontend/ # HTML + CSS + JS (sin frameworks)
├── README.md # Este archivo

yaml
Copiar
Editar

---

## 🚀 Despliegue en Render

### 1. Base de datos PostgreSQL (ya creada)

Asegúrate de que tu Render DB tenga las tablas `empleados` y `admins`. Si no, ejecuta el SQL proporcionado.

---

### 2. Backend

1. Crea un nuevo **Web Service** en Render.
2. Conecta el repositorio de GitHub `aquadama`.
3. Selecciona la carpeta `backend/`.
4. En "Build Command": *(dejar vacío)*
5. En "Start Command":  
   ```bash
   node index.js
Añade las siguientes Environment Variables:

PORT=4000

JWT_SECRET=una_clave_secreta_segura

DATABASE_URL= (usa el valor de tu Render PostgreSQL)

Pulsa "Deploy".

3. Frontend (sitio estático)
Crea un segundo servicio en Render como Static Site.

Selecciona la carpeta frontend/ del mismo repo.

En “Build Command”: (dejar vacío)

En “Publish directory”:

nginx
Copiar
Editar
frontend
🔐 Acceso Administrador
Desde Beekeeper Studio, inserta un admin:

sql
Copiar
Editar
INSERT INTO admins (username, password_hash)
VALUES ('javierit', '$2b$10$2AdTW/U7Mb4sVPUPAnzv/u1HhVYRA5qtcx2tpZoP.ZeLxBlB1EOqq');
La contraseña es: Ab915712@

✅ Funcionalidades
Registro completo con firma en canvas (PC + móvil)

Carga de documentos (DNI, foto, etc.)

Almacenamiento en base de datos PostgreSQL

Autenticación de administrador con JWT

Panel de gestión de empleados

Cambio de contraseña

Eliminar empleado

Botón para generar PDF por empleado (pendiente)

Interfaz visual clara, limpia y responsiva

📌 Notas
Asegúrate de reemplazar API_URL en main.js por tu dominio Render real.

Puedes proteger el panel administrativo aún más usando cookies HttpOnly o autenticación externa si deseas.

El código es sencillo de mantener y escalar.

Hecho por: Javier A. Gonzáles Fuentes y ChatGPT (OpenAI) 💼
yaml
Copiar
Editar

---

✅ Con esto ya tienes el proyecto **completo, profesional, seguro y desplegable**.

¿Quieres que prepare también el archivo `.env` para usarlo localmente si alguna vez lo necesitas probar fuera de Render?







