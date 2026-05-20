const dotenv = require('dotenv')
const envFound = dotenv.config(); // Atribui ao process

if (envFound.error) {
  throw new Error("Não foi possível encontrar o arquivo .env ");
}

module.exports = { // Configurações relacionadas
  port: parseInt(process.env.PORT, 10),
  databaseURL: process.env.MONGODB_URI,
  api: {
    prefix: '/api',
  }
};