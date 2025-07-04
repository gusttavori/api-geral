const express = require('express');
const router = express.Router();
const multer = require('multer');
const autenticarToken = require('../middleware/autenticarToken');

// Cloudinary SDK + Multer Storage
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configurações do Cloudinary (usa variáveis do .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Define o armazenamento no Cloudinary via Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'grimoveis', // pasta no Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit' }]
  }
});

const upload = multer({ storage });

// --- Rotas de API para Upload ---

/**
 * @route   POST /upload
 * @desc    Faz o upload de uma única imagem para o Cloudinary
 * @access  Private (requer token)
 */
router.post('/', autenticarToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
  }

  // req.file.path já é a URL pública da imagem no Cloudinary
  res.status(200).json({
    message: 'Arquivo enviado com sucesso!',
    filePath: req.file.path
  });
});

/**
 * @route   POST /upload/gallery
 * @desc    Faz o upload de até 10 imagens para o Cloudinary
 * @access  Private (requer token)
 */
router.post('/gallery', autenticarToken, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
  }

  const filePaths = req.files.map(file => file.path);

  res.status(200).json({
    message: `${req.files.length} arquivos enviados com sucesso!`,
    filePaths: filePaths
  });
});

// Middleware para tratar erros do Multer ou outros
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: `Erro no upload: ${error.message}` });
  } else if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
});

module.exports = router;
