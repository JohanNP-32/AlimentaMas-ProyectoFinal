const express = require('express');
const { register, login } = require('../controllers/authController');
const { requireAuth, requireRole } = require('../middleware/auth');
const userModel = require('../models/userModel');

const router = express.Router();

// Públicas
router.post('/register', register);
router.post('/login', login);

// Protegida: cualquier usuario autenticado puede ver su propio perfil
router.get('/me', requireAuth, (req, res) => {
  const user = userModel.findById(req.user.sub);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  return res.json({ id: user.id, nombre: user.nombre, email: user.email, tipo: user.tipo, role: user.role });
});

// Protegida solo para administradores: lista todos los usuarios registrados
router.get('/usuarios', requireAuth, requireRole('admin'), (req, res) => {
  const list = userModel.all().map((u) => ({
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    tipo: u.tipo,
    role: u.role,
  }));
  return res.json(list);
});

module.exports = router;
