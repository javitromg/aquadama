const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const db = require('../db');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, upload.fields([
  { name: 'fotoDNIDelante' },
  { name: 'fotoDNIDetras' },
  { name: 'fotoPersonal' }
]), async (req, res) => {
  try {
    const data = req.body;

    const fotoDelante = req.files.fotoDNIDelante?.[0]?.buffer.toString('base64') || null;
    const fotoDetras = req.files.fotoDNIDetras?.[0]?.buffer.toString('base64') || null;
    const fotoPersonal = req.files.fotoPersonal?.[0]?.buffer.toString('base64') || null;
    const firma = data.firma || null;

    const result = await db.query(`
      INSERT INTO empleados (
        nombre, apellidos, dni, ss, fecha_nacimiento, nacionalidad,
        sexo, lugar_nacimiento, estado_civil, hijos, telefono, email,
        formacion, direccion, cp, localidad, provincia, iban,
        nombre_contacto, parentesco_contacto, telefono_contacto,
        foto_dni_delante, foto_dni_detras, foto_personal, firma, fecha_registro
      ) VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,$17,$18,
        $19,$20,$21,
        $22,$23,$24,$25,$26
      ) RETURNING *;
    `, [
      data.nombre, data.apellidos, data.dni, data.ss, data.fechaNacimiento, data.nacionalidad,
      data.sexo, data.lugarNacimiento, data.estadoCivil, data.hijos, data.telefono, data.email,
      data.formacion, data.direccion, data.cp, data.localidad, data.provincia, data.iban,
      data.nombreContacto, data.parentescoContacto, data.telefonoContacto,
      fotoDelante, fotoDetras, fotoPersonal, firma, new Date()
    ]);

    res.json({ message: "✅ Empleado creado", empleado: result.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al guardar empleado" });
  }
});

router.get('/', auth, async (_req, res) => {
  try {
    const result = await db.query('SELECT * FROM empleados ORDER BY fecha_registro DESC');
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Error al obtener empleados" });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM empleados WHERE id=$1', [id]);
    res.json({ message: "Empleado eliminado" });
  } catch {
    res.status(500).json({ error: "Error al eliminar empleado" });
  }
});

module.exports = router;
