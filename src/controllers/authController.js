const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { signToken } = require('../utils/jwt');

const TIPOS_VALIDOS = ['empresa_donante', 'organizacion_beneficiaria'];
const SALT_ROUNDS = 10;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function register(req, res) {
  const { nombre, email, password, tipo } = req.body;

  if (!nombre || !email || !password || !tipo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (nombre, email, password, tipo)' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({ error: `Tipo inválido. Usa uno de: ${TIPOS_VALIDOS.join(', ')}` });
  }

  const existing = userModel.findByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Por defecto todo registro público entra como "usuario".
  // El rol "admin" solo se asigna manualmente (seed) o por otro admin, nunca
  // por el propio formulario de registro público — evita que cualquiera se
  // vuelva administrador.
  const user = userModel.create({
    nombre,
    email,
    passwordHash,
    tipo,
    role: 'usuario',
  });

  const token = signToken(user);

  return res.status(201).json({
    message: 'Cuenta creada correctamente',
    token,
    user: { id: user.id, nombre: user.nombre, email: user.email, tipo: user.tipo, role: user.role },
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son obligatorios' });
  }

  const user = userModel.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = signToken(user);

  return res.status(200).json({
    message: 'Sesión iniciada',
    token,
    user: { id: user.id, nombre: user.nombre, email: user.email, tipo: user.tipo, role: user.role },
  });
}

module.exports = { register, login };
