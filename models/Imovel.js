const mongoose = require('mongoose');

// Define o Schema (a estrutura) do documento de Imóvel no banco de dados.
const ImovelSchema = new mongoose.Schema({
  // --- Campos de Texto ---
  titulo: { 
    type: String, 
    required: [true, 'O título é obrigatório.'],
    trim: true 
  },
  descricao: { 
    type: String, 
    required: [true, 'A descrição é obrigatória.'] 
  },
  cidade: { 
    type: String, 
    required: [true, 'A cidade é obrigatória.'] 
  },
  bairro: { 
    type: String, 
    required: [true, 'O bairro é obrigatório.'] 
  },
  tipo: { 
    type: String, 
    enum: ['casa', 'apartamento', 'terreno', 'comercial'],
    required: [true, 'O tipo do imóvel é obrigatório.'] 
  },
  finalidade: { 
    type: String, 
    enum: ['venda', 'locacao'],
    required: [true, 'A finalidade é obrigatória.'] 
  },

  // --- Campos Numéricos ---
  preco: { 
    type: mongoose.Schema.Types.Mixed, // Permite Number ou String
    required: [true, 'O preço é obrigatório.'] 
  },
  dormitorios: { 
    type: Number, 
    required: [true, 'O número de dormitórios é obrigatório.'],
    default: 0
  },
  banheiros: { 
    type: Number, 
    required: [true, 'O número de banheiros é obrigatório.'],
    default: 0
  },
  area: { 
    type: Number, 
    required: [true, 'A área é obrigatória.'] 
  },
  visualizacoes: { // Campo para contagem de visualizações
    type: Number,
    default: 0
  },

  // O campo 'condominio' foi removido.
  // A existência de um valor em 'valorCondominio' agora indica que é um condomínio.
  valorCondominio: { 
    type: Number, 
    default: null 
  },

  // --- Campos Booleanos (Verdadeiro/Falso) ---
  piscina: { 
    type: Boolean, 
    default: false 
  },
  garagem: { 
    type: Boolean, 
    default: false 
  },
  destaque: { 
    type: Boolean, 
    default: false 
  },

  // --- Campo de Array ---
  imagens: [{ 
    type: String 
  }],

}, {
  // Adiciona automaticamente os campos 'createdAt' e 'updatedAt'
  timestamps: true 
});

// Cria e exporta o Model 'Imovel' baseado no Schema definido acima.
module.exports = mongoose.model('Imovel', ImovelSchema);
