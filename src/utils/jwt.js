const jwt = require('jsonwebtoken');

// En un entorno real esto vendría de una variable de entorno / secret manager.
// Nunca subas el secreto real a GitHub; en el pipeline de CI/CD se inyecta
// como "secret" (ver .github/workflows/ci-cd.yml).
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-not-for-production';
const JWT_EXPIRES_IN = '2h';

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, tipo: user.tipo },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken, JWT_SECRET };
