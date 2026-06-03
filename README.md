# Plataforma de Reportes — C.C. Carlos Camacho Espíritu

Sistema de reportes de incidentes y condiciones del plantel para ambos turnos (matutino y vespertino).

---

## 🚀 Pasos para poner en marcha la plataforma

### PASO 1 — Crear el proyecto Firebase

1. Abre [https://console.firebase.google.com](https://console.firebase.google.com) con **la cuenta Google diferente** que quieres usar
2. Haz clic en **"Agregar proyecto"**
3. Nombre sugerido: `incidentes-ccespiritu`
4. Desactiva Google Analytics (no es necesario) → Crear proyecto

---

### PASO 2 — Activar Authentication

1. En el menú izquierdo: **Authentication** → Comenzar
2. En la pestaña **"Sign-in method"**: habilita **Correo electrónico/contraseña** → Guardar

---

### PASO 3 — Crear Firestore Database

1. En el menú izquierdo: **Firestore Database** → Crear base de datos
2. Selecciona **Modo de producción** (las reglas correctas se cargan después)
3. Elige la ubicación más cercana: `us-central1`

---

### PASO 4 — Activar Storage

> ✅ **YA NO SE USA Firebase Storage.** Las fotos se guardan en **Google Drive** con Apps Script. Sáltate este paso.

---

### PASO 4b — Crear el Apps Script (subidor de fotos a Drive)

1. Ve a [https://script.google.com](https://script.google.com) (con **la misma cuenta** del proyecto Firebase)
2. Haz clic en **"Nuevo proyecto"**
3. Ponle nombre: `API Fotos CCE`
4. Borra el código de ejemplo y **pega todo el contenido** del archivo [`setup/subir-a-drive.gs`](./setup/subir-a-drive.gs)
5. Haz clic en **"Implementar"** → **"Nueva implementación"**
   - **Tipo:** Aplicación web
   - **Ejecutar como:** Yo (tu cuenta Google)
   - **Quién tiene acceso:** Cualquier persona
6. Haz clic en **"Implementar"** y autoriza los permisos
7. **Copia la URL** que aparece (empieza con `https://script.google.com/macros/s/...`)
8. Pégala en `app.html` donde dice:
   ```js
   const APPS_SCRIPT_URL = 'PEGA_AQUI_LA_URL_DE_TU_APPS_SCRIPT';
   ```

> 💡 Para probar que funciona, visita la URL en tu navegador. Debes ver: `{"success":true,"mensaje":"✅ API de Fotos CCE funcionando..."}`

---

### PASO 5 — Configurar las Reglas de Firestore

1. En Firestore: pestaña **"Reglas"**
2. Borra el contenido y pega el contenido del archivo [`firestore.rules`](./firestore.rules)
3. Haz clic en **Publicar**

---

1. En Firebase: **Configuración del proyecto** (ícono ⚙️ junto a "Project Overview")
2. Baja hasta **"Tus apps"** → Haz clic en el ícono web `</>`
3. Registra la app con el nombre: `reportes-cce`
4. **NO** marques Firebase Hosting (usaremos GitHub Pages)
5. Copia el bloque `firebaseConfig` que aparece

#### Pegar la configuración en el proyecto
Abre el archivo [`js/firebase-config.js`](./js/firebase-config.js) y reemplaza los valores:

```js
export const firebaseConfig = {
  apiKey:            "AIzaSy...",          // ← pega tu API Key
  authDomain:        "incidentes-ccespiritu.firebaseapp.com",
  projectId:         "incidentes-ccespiritu",
  storageBucket:     "incidentes-ccespiritu.appspot.com",
  messagingSenderId: "1234567890",
  appId:             "1:1234567890:web:abc123"
};
```

---

### PASO 7 — Crear los usuarios

1. Ve a **Configuración del proyecto** → pestaña **"Cuentas de servicio"**
2. Haz clic en **"Generar nueva clave privada"** → Confirmar
3. Guarda el archivo JSON descargado como:
   ```
   setup/serviceAccountKey.json
   ```
4. Abre una terminal y ejecuta:
   ```bash
   cd setup
   npm install
   node setup-usuarios.js
   ```

Si todo va bien, verás todos los usuarios listados con ✅.

> ⚠️ El archivo `serviceAccountKey.json` está en el `.gitignore`. **Nunca lo subas a GitHub.**

---

### PASO 8 — Subir a GitHub y publicar con GitHub Pages

1. Crea un repositorio en [github.com](https://github.com) (público o privado)
2. Sube todos los archivos del proyecto (excepto `setup/serviceAccountKey.json` y `setup/node_modules/`)
3. Ve a tu repositorio → **Settings** → **Pages**
4. En "Source": selecciona **"Deploy from a branch"**
5. Branch: `main` → carpeta: `/ (root)` → Guardar
6. En unos minutos tu app estará disponible en:
   ```
   https://TU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/
   ```

---

## 👤 Credenciales de Acceso

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@ccespiritu.edu.mx` | `Admin.2024!` |
| Directora Matutino | `directora.mat@ccespiritu.edu.mx` | `DirMat.2024!` |
| Directora Vespertino | `directora.ves@ccespiritu.edu.mx` | `DirVes.2024!` |
| Jefe 1° Matutino | `jefe.1m@ccespiritu.edu.mx` | `Jefe1M.2024!` |
| Jefe 2° Matutino | `jefe.2m@ccespiritu.edu.mx` | `Jefe2M.2024!` |
| Jefe 3° Matutino | `jefe.3m@ccespiritu.edu.mx` | `Jefe3M.2024!` |
| Jefe 1° Vespertino | `jefe.1v@ccespiritu.edu.mx` | `Jefe1V.2024!` |
| Jefe 2° Vespertino | `jefe.2v@ccespiritu.edu.mx` | `Jefe2V.2024!` |
| Jefe 3° Vespertino | `jefe.3v@ccespiritu.edu.mx` | `Jefe3V.2024!` |
| Intendente 1 | `intendente1@ccespiritu.edu.mx` | `Int1.2024!` |
| Intendente 2 | `intendente2@ccespiritu.edu.mx` | `Int2.2024!` |

> Se recomienda cambiar las contraseñas después del primer acceso usando la opción **"¿Olvidaste tu contraseña?"** en la app.

---

## 📁 Estructura de Archivos

```
/
├── index.html              ← Página de login
├── app.html                ← Aplicación principal (todos los paneles)
├── css/
│   └── styles.css          ← Sistema de diseño completo
├── js/
│   └── firebase-config.js  ← Configuración de Firebase (¡llenar!)
├── setup/
│   ├── package.json
│   ├── setup-usuarios.js   ← Script de creación de usuarios
│   └── serviceAccountKey.json ← (tú lo generas — NO subir a GitHub)
├── firestore.rules         ← Reglas de seguridad de Firestore
├── storage.rules           ← Reglas de seguridad de Storage
└── README.md               ← Este archivo
```

---

## 🔒 Roles y Permisos

| Rol | Puede hacer |
|---|---|
| **Jefe de Grupo** | Crear reportes de su salón, ver solo sus propios reportes |
| **Directora Matutino** | Ver **todos** los reportes del turno matutino, filtrar |
| **Directora Vespertino** | Ver **todos** los reportes del turno vespertino, filtrar |
| **Intendencia** | Ver todos los reportes, marcar como "En Atención" y "Resuelto", subir foto de resolución |
| **Admin** | Ver todo de ambos turnos |

---

## ❓ Soporte

Si tienes algún problema durante la configuración, revisa:

1. Que el archivo `firebase-config.js` tiene los valores correctos
2. Que las reglas de Firestore y Storage fueron publicadas
3. Que el script `setup-usuarios.js` se ejecutó sin errores
4. Que GitHub Pages está habilitado en el repositorio
