const express = require('express');
const db = require('../database');

const router = express.Router();

// Obtenir profil utilisateur
router.get('/profil/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT id, username, email, solde, created_at FROM users WHERE id = ?', [id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  });
});

// Obtenir l'historique des commandes
router.get('/commandes/:id', (req, res) => {
  const { id } = req.params;

  db.all('SELECT * FROM commandes WHERE user_id = ? ORDER BY created_at DESC', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

module.exports = router;
