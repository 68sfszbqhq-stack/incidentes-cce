/**
 * ============================================================
 *  SUBIDOR DE FOTOS A GOOGLE DRIVE
 *  Plataforma de Reportes — C.C. Carlos Camacho Espíritu
 * ============================================================
 *
 *  INSTRUCCIONES:
 *  1. Ve a https://script.google.com → "Nuevo proyecto"
 *  2. Borra el código de ejemplo y pega TODO este archivo
 *  3. Ponle nombre: "API Fotos CCE"
 *  4. Haz clic en "Implementar" → "Nueva implementación"
 *     - Tipo: Aplicación web
 *     - Ejecutar como: Yo (tu cuenta)
 *     - Quién tiene acceso: Cualquier persona
 *  5. Autoriza los permisos cuando te lo pida
 *  6. Copia la URL de implementación
 *  7. Pégala en app.html donde dice: APPS_SCRIPT_URL = "..."
 *
 * ============================================================
 */

// ── Carpeta raíz en tu Google Drive ──────────────────────────
const CARPETA_RAIZ = 'Reportes CCE — Carlos Camacho Espíritu';

// ═════════════════════════════════════════════════════════════
//  doPost — Punto de entrada para subir archivos
// ═════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { data, mimeType, fileName, subcarpeta } = payload;

    // Validar datos obligatorios
    if (!data || !mimeType || !fileName) {
      return respuesta({ success: false, error: 'Faltan campos: data, mimeType o fileName' });
    }

    // Obtener o crear la carpeta de destino
    const carpetaDestino = obtenerCarpeta(subcarpeta || 'evidencias');

    // Decodificar base64 y crear el archivo
    const bytes = Utilities.base64Decode(data);
    const blob  = Utilities.newBlob(bytes, mimeType, fileName);
    const file  = carpetaDestino.createFile(blob);

    // Compartir el archivo (solo lectura, cualquiera con el enlace)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileId = file.getId();

    return respuesta({
      success: true,
      id:      fileId,
      // URL para mostrar en <img src="...">
      imgUrl:  `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
      // URL para abrir en Drive
      viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
    });

  } catch (err) {
    Logger.log('Error en doPost: ' + err.toString());
    return respuesta({ success: false, error: err.message });
  }
}

// ═════════════════════════════════════════════════════════════
//  doGet — Prueba de conexión (visita la URL en el navegador)
// ═════════════════════════════════════════════════════════════
function doGet(e) {
  return respuesta({
    success: true,
    mensaje: '✅ API de Fotos CCE funcionando correctamente.',
    version: '1.0.0',
  });
}

// ═════════════════════════════════════════════════════════════
//  HELPERS
// ═════════════════════════════════════════════════════════════

/**
 * Obtiene o crea la carpeta de destino dentro de la raíz.
 * Estructura: Reportes CCE / [subcarpeta]
 */
function obtenerCarpeta(nombreSub) {
  // Carpeta raíz
  let raiz;
  const raices = DriveApp.getFoldersByName(CARPETA_RAIZ);
  if (raices.hasNext()) {
    raiz = raices.next();
  } else {
    raiz = DriveApp.createFolder(CARPETA_RAIZ);
    Logger.log('Carpeta raíz creada: ' + CARPETA_RAIZ);
  }

  // Subcarpeta
  if (!nombreSub) return raiz;
  const subs = raiz.getFoldersByName(nombreSub);
  if (subs.hasNext()) return subs.next();
  Logger.log('Subcarpeta creada: ' + nombreSub);
  return raiz.createFolder(nombreSub);
}

/**
 * Construye una respuesta JSON con encabezados CORS correctos.
 */
function respuesta(obj) {
  const output = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
