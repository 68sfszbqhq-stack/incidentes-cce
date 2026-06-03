/**
 * ============================================================
 *  SETUP INICIAL DE USUARIOS
 *  Plataforma de Reportes — C.C. Carlos Camacho Espíritu
 * ============================================================
 *
 *  INSTRUCCIONES DE USO:
 *
 *  1. En Firebase Console > Configuración del proyecto
 *     > Cuentas de servicio > Generar nueva clave privada
 *     Guarda el JSON descargado como:
 *       setup/serviceAccountKey.json
 *
 *  2. Abre una terminal y ejecuta:
 *       cd setup
 *       npm install
 *       node setup-usuarios.js
 *
 *  3. Si todo va bien verás "✅ Todos los usuarios creados."
 *     Este script es seguro: si un usuario ya existe lo omite.
 *
 *  ⚠️  IMPORTANTE: No subas serviceAccountKey.json a GitHub.
 *      Ya está en el .gitignore.
 * ============================================================
 */

const admin = require('firebase-admin');
const path  = require('path');
const fs    = require('fs');

// ── Verificar que existe la clave de servicio ─────────────────
const keyPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
  console.error('\n❌ ERROR: No se encontró serviceAccountKey.json');
  console.error('   Descárgala desde Firebase Console > Configuración > Cuentas de servicio');
  console.error('   y guárdala como: setup/serviceAccountKey.json\n');
  process.exit(1);
}

// ── Inicializar Admin SDK ─────────────────────────────────────
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential:  admin.credential.cert(serviceAccount),
  projectId:   'incidencias-bgo-cce-matves',
});

const auth = admin.auth();
const db   = admin.firestore();

// ══════════════════════════════════════════════════════════════
//  LISTADO COMPLETO DE USUARIOS
//  Puedes cambiar los nombres y correos antes de ejecutar.
//  Las contraseñas se pueden cambiar después desde Firebase Console
//  o con el enlace de "Olvidé mi contraseña" en la app.
// ══════════════════════════════════════════════════════════════
const USUARIOS = [
  // ── Administrador ─────────────────────────────────────────
  {
    email:    'admin@ccespiritu.edu.mx',
    password: 'Admin.2024!',
    name:     'Administrador',
    role:     'admin',
    turno:    'ambos',
    grupo:    null,
  },

  // ── Directoras ────────────────────────────────────────────
  {
    email:    'directora.mat@ccespiritu.edu.mx',
    password: 'DirMat.2024!',
    name:     'Directora Matutino',
    role:     'directora_matutino',
    turno:    'matutino',
    grupo:    null,
  },
  {
    email:    'directora.ves@ccespiritu.edu.mx',
    password: 'DirVes.2024!',
    name:     'Directora Vespertino',
    role:     'directora_vespertino',
    turno:    'vespertino',
    grupo:    null,
  },

  // ── Jefes de Grupo — Turno Matutino ──────────────────────
  {
    email:    'jefe.1m@ccespiritu.edu.mx',
    password: 'Jefe1M.2024!',
    name:     'Jefe de Grupo 1° Matutino',
    role:     'jefe_grupo',
    turno:    'matutino',
    grupo:    '1°',
  },
  {
    email:    'jefe.2m@ccespiritu.edu.mx',
    password: 'Jefe2M.2024!',
    name:     'Jefe de Grupo 2° Matutino',
    role:     'jefe_grupo',
    turno:    'matutino',
    grupo:    '2°',
  },
  {
    email:    'jefe.3m@ccespiritu.edu.mx',
    password: 'Jefe3M.2024!',
    name:     'Jefe de Grupo 3° Matutino',
    role:     'jefe_grupo',
    turno:    'matutino',
    grupo:    '3°',
  },

  // ── Jefes de Grupo — Turno Vespertino ────────────────────
  {
    email:    'jefe.1v@ccespiritu.edu.mx',
    password: 'Jefe1V.2024!',
    name:     'Jefe de Grupo 1° Vespertino',
    role:     'jefe_grupo',
    turno:    'vespertino',
    grupo:    '1°',
  },
  {
    email:    'jefe.2v@ccespiritu.edu.mx',
    password: 'Jefe2V.2024!',
    name:     'Jefe de Grupo 2° Vespertino',
    role:     'jefe_grupo',
    turno:    'vespertino',
    grupo:    '2°',
  },
  {
    email:    'jefe.3v@ccespiritu.edu.mx',
    password: 'Jefe3V.2024!',
    name:     'Jefe de Grupo 3° Vespertino',
    role:     'jefe_grupo',
    turno:    'vespertino',
    grupo:    '3°',
  },

  // ── Intendentes ───────────────────────────────────────────
  {
    email:    'intendente1@ccespiritu.edu.mx',
    password: 'Int1.2024!',
    name:     'Intendente 1',
    role:     'intendencia',
    turno:    'ambos',
    grupo:    null,
  },
  {
    email:    'intendente2@ccespiritu.edu.mx',
    password: 'Int2.2024!',
    name:     'Intendente 2',
    role:     'intendencia',
    turno:    'ambos',
    grupo:    null,
  },
];

// ══════════════════════════════════════════════════════════════
//  FUNCIÓN PRINCIPAL
// ══════════════════════════════════════════════════════════════
async function crearUsuarios() {
  console.log('\n🏫 Configuración inicial — C.C. Carlos Camacho Espíritu');
  console.log('─'.repeat(55));
  console.log(`📋 Creando ${USUARIOS.length} usuarios...\n`);

  let creados = 0;
  let omitidos = 0;

  for (const u of USUARIOS) {
    try {
      // Crear en Firebase Auth
      let uid;
      try {
        const userRecord = await auth.createUser({
          email:         u.email,
          password:      u.password,
          displayName:   u.name,
          emailVerified: true,
          disabled:      false,
        });
        uid = userRecord.uid;
        console.log(`  ✅ Creado:  ${u.email}`);
        creados++;
      } catch (authErr) {
        if (authErr.code === 'auth/email-already-exists') {
          // Ya existe — obtener UID y continuar
          const existing = await auth.getUserByEmail(u.email);
          uid = existing.uid;
          console.log(`  ⏭️  Existe:  ${u.email} (actualizando perfil)`);
          omitidos++;
        } else {
          throw authErr;
        }
      }

      // Crear/actualizar perfil en Firestore
      await db.collection('users').doc(uid).set({
        name:      u.name,
        email:     u.email,
        role:      u.role,
        turno:     u.turno,
        grupo:     u.grupo,
        activo:    true,
        creadoEn:  admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

    } catch (err) {
      console.error(`  ❌ Error con ${u.email}: ${err.message}`);
    }
  }

  console.log('\n─'.repeat(55));
  console.log(`✅ Proceso completado.`);
  console.log(`   Creados: ${creados} | Ya existían: ${omitidos}`);
  console.log('\n📋 CREDENCIALES DE ACCESO:');
  console.log('─'.repeat(55));
  USUARIOS.forEach(u => {
    console.log(`  ${u.role.padEnd(22)} | ${u.email.padEnd(35)} | ${u.password}`);
  });
  console.log('\n⚠️  Guarda estas credenciales en un lugar seguro.');
  console.log('   Los usuarios pueden cambiar su contraseña desde la app.\n');

  await admin.app().delete();
}

crearUsuarios().catch(err => {
  console.error('\n❌ Error fatal:', err.message);
  process.exit(1);
});
