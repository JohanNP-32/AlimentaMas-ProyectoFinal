const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);

// Manejo simple de rutas no encontradas
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

module.exports = app;

// Solo levanta el servidor si se ejecuta directamente (node src/app.js),
// no cuando Jest lo importa para pruebas.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Alimenta+ donor module escuchando en puerto ${PORT}`));
}
