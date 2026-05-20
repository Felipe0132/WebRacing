const mongoose = require('mongoose');
const config = require('../config'); // Importa o objeto centralizado

module.exports = async () => {
  // Conecta ao MongoDB usando a URL da configuração
  // O proprio NodeJS e Mongo ja criam a tabela com isso
  const connection = await mongoose.connect(config.databaseURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
  return connection.connection.db;
};
