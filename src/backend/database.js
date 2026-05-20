const Database = require('better-sqlite3')

const db = new Database('./corridas.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS corridas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    data TEXT NOT NULL,
    local TEXT NOT NULL
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS distancias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    corrida_id INTEGER NOT NULL,
    km REAL NOT NULL,
    FOREIGN KEY (corrida_id) REFERENCES corridas(id)
  )
`)

module.exports = db