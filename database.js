const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'data.db'), (err) => {
  if (err) {
    console.error('Erreur connexion DB:', err);
  } else {
    console.log('✅ Base de données SQLite connectée');
    initDatabase();
  }
});

function initDatabase() {
  // Table Utilisateurs
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      solde REAL DEFAULT 0,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table Produits
  db.run(`
    CREATE TABLE IF NOT EXISTS produits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      description TEXT,
      prix REAL NOT NULL,
      image TEXT,
      stock INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table Panier
  db.run(`
    CREATE TABLE IF NOT EXISTS panier (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      produit_id INTEGER NOT NULL,
      quantite INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (produit_id) REFERENCES produits(id)
    )
  `);

  // Table Commandes
  db.run(`
    CREATE TABLE IF NOT EXISTS commandes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total REAL NOT NULL,
      statut TEXT DEFAULT 'en attente',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Table Votes
  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      option TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Insérer des produits par défaut
  db.run(`
    INSERT OR IGNORE INTO produits (id, nom, description, prix, stock) 
    VALUES 
    (1, 'Produit Premium', 'Excellent produit haut de gamme', 99.99, 50),
    (2, 'Pack Deluxe', 'Pack complet et économique', 149.99, 30),
    (3, 'Édition Standard', 'Version classique et fiable', 49.99, 100),
    (4, 'Bonus Spécial', 'Offre limitée', 29.99, 20)
  `);

  console.log('📊 Tables créées/vérifiées');
}

module.exports = db;
