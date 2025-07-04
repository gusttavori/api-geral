const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
require('dotenv').config();

const router = express.Router();
const SECRET = process.env.JWT_SECRET;

// Rota para Cadastro de usuário: POST /auth/usuarios
router.post('/usuarios', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ mensagem: 'Email já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario({ email, senhaHash });
    await novoUsuario.save();

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error("Erro no cadastro:", err);
    res.status(500).json({ erro: 'Ocorreu um erro inesperado no servidor.' });
  }
});

// Rota para Login: POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      // Use a mesma mensagem de erro para não informar se o email existe ou não
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaOk) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: usuario._id, email: usuario.email }, SECRET, { expiresIn: '1h' });

    res.json({ token, email: usuario.email });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ erro: 'Ocorreu um erro inesperado no servidor.' });
  }
});

module.exports = router;
