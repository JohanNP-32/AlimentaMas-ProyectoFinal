const { verifyToken } = require('../utils/jwt');

// Revisa que venga un token válido en el header "Authorization: Bearer <token>"
function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload; // { sub, email, role, tipo }
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// Revisa que el usuario autenticado tenga uno de los roles permitidos.
// Uso: requireRole('admin') o requireRole('admin', 'usuario')
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permiso para esta acción' });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
