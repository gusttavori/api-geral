const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Imovel = require('../models/Imovel');
const autenticarToken = require('../middleware/autenticarToken');
const validate = require('../middleware/validate');

// Função para padronizar a resposta (sem alterações)
function formatarImovel(imovel) {
  const obj = imovel.toObject();
  const { _id, __v, ...resto } = obj;
  return { id: _id.toString(), ...resto };
}

// Schema para CRIAÇÃO de imóvel (campo 'condominio' removido)
const createSchemaImovel = Joi.object({
  titulo: Joi.string().min(3).max(100).required(),
  descricao: Joi.string().min(10).max(1000).required(),
  preco: Joi.alternatives().try(Joi.number().min(0), Joi.string().valid('CONSULTAR VALOR')).required(),
  cidade: Joi.string().min(2).max(50).required(),
  bairro: Joi.string().min(2).max(50).required(),
  tipo: Joi.string().valid('casa', 'apartamento', 'terreno', 'comercial').required(),
  valorCondominio: Joi.number().min(0).optional().allow(null), // Permite null ou número
  dormitorios: Joi.number().integer().min(0).required(),
  banheiros: Joi.number().integer().min(0).required(),
  piscina: Joi.boolean().optional(),
  garagem: Joi.boolean().optional(),
  area: Joi.number().min(0).required(),
  imagens: Joi.array().items(Joi.string().uri()).min(1).required(),
  destaque: Joi.boolean().optional(),
  finalidade: Joi.string().valid('venda', 'locacao').required()
});

// Schema para ATUALIZAÇÃO de imóvel (campo 'condominio' removido)
const updateSchemaImovel = Joi.object({
  titulo: Joi.string().min(3).max(100),
  descricao: Joi.string().min(10).max(1000),
  preco: Joi.alternatives().try(Joi.number().min(0), Joi.string().valid('CONSULTAR VALOR')),
  cidade: Joi.string().min(2).max(50),
  bairro: Joi.string().min(2).max(50),
  tipo: Joi.string().valid('casa', 'apartamento', 'terreno', 'comercial'),
  valorCondominio: Joi.number().min(0).optional().allow(null),
  dormitorios: Joi.number().integer().min(0),
  banheiros: Joi.number().integer().min(0),
  piscina: Joi.boolean(),
  garagem: Joi.boolean(),
  area: Joi.number().min(0),
  imagens: Joi.array().items(Joi.string().uri()).min(1),
  destaque: Joi.boolean(),
  finalidade: Joi.string().valid('venda', 'locacao')
});


// GET /imoveis (sem alterações)
router.get('/', async (req, res) => {
  try {
    const imoveis = await Imovel.find().sort({ createdAt: -1 });
    res.json({ imoveis: imoveis });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar imóveis.' });
  }
});

// GET /imoveis/:id (sem alterações)
router.get('/:id', async (req, res) => {
  try {
    const imovel = await Imovel.findById(req.params.id);
    if (!imovel) return res.status(404).json({ mensagem: 'Imóvel não encontrado.' });
    res.json(imovel);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar imóvel por ID.' });
  }
});

// POST /imoveis - Usa o schema de criação
router.post('/', autenticarToken, validate(createSchemaImovel), async (req, res) => {
  try {
    const novoImovel = new Imovel(req.body);
    await novoImovel.save();
    res.status(201).json(novoImovel);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar imóvel.' });
  }
});

// PUT /imoveis/:id - Usa o schema de atualização
router.put('/:id', autenticarToken, validate(updateSchemaImovel), async (req, res) => {
  try {
    const imovelAtualizado = await Imovel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!imovelAtualizado) return res.status(404).json({ mensagem: 'Imóvel não encontrado.' });
    res.json({ mensagem: 'Imóvel atualizado com sucesso.', imovel: imovelAtualizado });
  } catch (err) {
    console.error("Erro detalhado no PUT:", err);
    res.status(400).json({ erro: 'Erro ao atualizar imóvel.', detalhes: err.message });
  }
});

// DELETE /imoveis/:id (sem alterações)
router.delete('/:id', autenticarToken, async (req, res) => {
  try {
    const imovel = await Imovel.findByIdAndDelete(req.params.id);
    if (!imovel) return res.status(404).json({ mensagem: 'Imóvel não encontrado.' });
    res.json({ mensagem: 'Imóvel excluído com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir imóvel.' });
  }
});

module.exports = router;
