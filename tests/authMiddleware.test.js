const request = require('supertest');
const app = require('../src/app');
const userModel = require('../src/models/userModel');

beforeEach(() => {
  userModel.reset();
});

async function registrarYObtenerToken(overrides = {}) {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      nombre: 'Usuario de prueba',
      email: 'user@test.com',
      password: 'password123',
      tipo: 'empresa_donante',
      ...overrides,
    });
  return res.body.token;
}

describe('GET /api/auth/me (requireAuth)', () => {
  it('rechaza la peticion sin token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/Token no proporcionado/);
  });

  it('rechaza un token mal formado', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'sin-bearer');
    expect(res.status).toBe(401);
  });

  it('rechaza un token invalido', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer token-falso');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/inválido/);
  });

  it('permite el acceso con un token valido', async () => {
    const token = await registrarYObtenerToken();
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('user@test.com');
  });
});

describe('GET /api/auth/usuarios (requireRole admin)', () => {
  it('bloquea a un usuario normal (403)', async () => {
    const token = await registrarYObtenerToken();
    const res = await request(app).get('/api/auth/usuarios').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/permiso/);
  });

  it('permite el acceso a un administrador', async () => {
    // Simulamos un admin creándolo directo en el modelo (en la vida real
    // se asigna por seed o por otro admin, no por registro público).
    const bcrypt = require('bcryptjs');
    const { signToken } = require('../src/utils/jwt');
    const passwordHash = await bcrypt.hash('password123', 10);
    const admin = userModel.create({
      nombre: 'Admin',
      email: 'admin@test.com',
      passwordHash,
      tipo: 'empresa_donante',
      role: 'admin',
    });
    const token = signToken(admin);

    const res = await request(app).get('/api/auth/usuarios').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /health', () => {
  it('responde ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Ruta no encontrada', () => {
  it('responde 404 para rutas inexistentes', async () => {
    const res = await request(app).get('/no/existe');
    expect(res.status).toBe(404);
  });
});
