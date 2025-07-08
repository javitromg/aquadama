const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Faltan datos" });

  const hash = await bcrypt.hash(password, 10);
  try {
    await db.query('INSERT INTO admins(username, password_hash) VALUES ($1, $2)', [username, hash]);
    res.json({ message: '✅ Admin creado correctamente' });
  } catch (e) {
    res.status(500).json({ error: 'Error al registrar admin' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Faltan datos" });

  try {
    const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Usuario no existe" });

    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: 'Error en login' });
  }
});

module.exports = router;
