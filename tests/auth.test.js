const request = require('supertest');
const app = require('../src/app');
const userModel = require('../src/models/userModel');

beforeEach(() => {
  userModel.reset();
});

describe('POST /api/auth/register', () => {
  it('registra una empresa donante correctamente', async () => {
    const res = await request(app).post('/api/auth/register').send({
      nombre: 'Panaderia El Buen Pan',
      email: 'contacto@buenpan.com',
      password: 'password123',
      tipo: 'empresa_donante',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('usuario');
    expect(res.body.user.tipo).toBe('empresa_donante');
  });

  it('registra una organizacion beneficiaria correctamente', async () => {
    const res = await request(app).post('/api/auth/register').send({
      nombre: 'Comedor Comunitario Esperanza',
      email: 'contacto@esperanza.org',
      password: 'password123',
      tipo: 'organizacion_beneficiaria',
    });

    expect(res.status).toBe(201);
    expect(res.body.user.tipo).toBe('organizacion_beneficiaria');
  });

  it('rechaza el registro si faltan campos', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'incompleto@test.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Faltan campos/);
  });

  it('rechaza un email invalido', async () => {
    const res = await request(app).post('/api/auth/register').send({
      nombre: 'Test',
      email: 'no-es-un-email',
      password: 'password123',
      tipo: 'empresa_donante',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Email inválido/);
  });

  it('rechaza una contraseña muy corta', async () => {
    const res = await request(app).post('/api/auth/register').send({
      nombre: 'Test',
      email: 'test@test.com',
      password: '123',
      tipo: 'empresa_donante',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/contraseña/);
  });

  it('rechaza un tipo invalido', async () => {
    const res = await request(app).post('/api/auth/register').send({
      nombre: 'Test',
      email: 'test@test.com',
      password: 'password123',
      tipo: 'tipo_que_no_existe',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Tipo inválido/);
  });

  it('rechaza un email duplicado', async () => {
    await request(app).post('/api/auth/register').send({
      nombre: 'Test',
      email: 'duplicado@test.com',
      password: 'password123',
      tipo: 'empresa_donante',
    });

    const res = await request(app).post('/api/auth/register').send({
      nombre: 'Test 2',
      email: 'duplicado@test.com',
      password: 'password123',
      tipo: 'empresa_donante',
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/Ya existe/);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      nombre: 'Empresa Login',
      email: 'login@test.com',
      password: 'password123',
      tipo: 'empresa_donante',
    });
  });

  it('inicia sesion con credenciales correctas', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rechaza password incorrecto', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'password-incorrecto',
    });

    expect(res.status).toBe(401);
  });

  it('rechaza email que no existe', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'no-existe@test.com',
      password: 'password123',
    });

    expect(res.status).toBe(401);
  });

  it('rechaza login si faltan campos', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'login@test.com' });
    expect(res.status).toBe(400);
  });
});
