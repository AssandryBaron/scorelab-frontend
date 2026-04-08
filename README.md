# ScoreLab - Frontend ⚽

Interfaz de usuario para la gestión de torneos de fútbol, desarrollada con **React.js** y **Vite**. Esta aplicación permite a organizadores y delegados gestionar sus competencias en tiempo real.

---

##  Requisitos Técnicos
Antes de comenzar, asegúrate de tener instalado:
* **Node.js** (Versión 18 o superior).
* **NPM** (incluido con Node) o **Yarn**.
* El **Backend** de ScoreLab corriendo en `http://localhost:8080`.

---

##  Guía de Instalación Paso a Paso

### 1. Instalar las dependencias
Este paso descargará todas las librerías necesarias como React, Axios y React Router:
```sql
npm install
```

### 2. Configurar la conexión con el API
Abre el archivo src/api/api.js y asegúrate de que la URL apunte a tu servidor de Spring Boot:
```sql
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});
```

### 3. Ejecutar la aplicación
Para iniciar el servidor de desarrollo, ejecuta:
```sql
npm run dev
```
