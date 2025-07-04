const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const history = require('connect-history-api-fallback');
require('dotenv').config();

// Middlewares e rotas
const authRoutes = require('./routes/auth');
const imoveisRoutes = require('./routes/imoveis');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:5500' 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.static('public'));

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB conectado com sucesso!'))
  .catch(err => {
    console.error('❌ Erro ao conectar MongoDB:', err);
    process.exit(1);
  });
// Rotas API
app.use('/auth', authRoutes);
app.use('/imoveis', imoveisRoutes);
app.use('/upload', uploadRoutes);

// Servir React build (SPA)
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  console.log('✅ Pasta build encontrada. Servindo frontend React...');
  app.use(history());
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  console.warn('⚠️ Pasta build não encontrada. API rodando sem frontend.');
}

// Inicialização do servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});