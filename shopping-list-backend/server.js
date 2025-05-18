const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const productRoutes = require('./routes/product');
const shoppingListRoutes = require('./routes/shoppingListRoutes');
const categoriasRoutes = require('./routes/categorias');

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://shopping-list-frontend-three.vercel.app' //Versel depois
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api', productRoutes);
app.use('/api', shoppingListRoutes);
app.use('/api', categoriasRoutes);
app.get('/debug', (req, res) => {
  res.send('API ativa!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});