// Modelo simple en memoria para el módulo de registro de donantes.
// En producción esto sería la tabla "usuarios" en PostgreSQL (ver arquitectura
// de microservicios del Avance de Reto), pero para esta entrega usamos un
// arreglo en memoria para poder probarlo fácil con Jest.

let users = [];
let nextId = 1;

function reset() {
  users = [];
  nextId = 1;
}

function findByEmail(email) {
  return users.find((u) => u.email === email);
}

function findById(id) {
  return users.find((u) => u.id === id);
}

function create({ nombre, email, passwordHash, tipo, role }) {
  const user = {
    id: nextId++,
    nombre,
    email,
    passwordHash,
    tipo, // 'empresa_donante' | 'organizacion_beneficiaria'
    role, // 'admin' | 'usuario'
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

function all() {
  return users;
}

module.exports = { create, findByEmail, findById, all, reset };
