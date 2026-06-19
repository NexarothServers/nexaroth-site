const express = require('express');
const db = require('../database');

const router = express.Router();

// Obtenir tous les produits
router.get('/produits', (req, res) => {
  db.all('SELECT * FROM produits', (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

// Ajouter au panier
router.post('/panier/ajouter', (req, res) => {
  const { user_id, produit_id, quantite } = req.body;

  db.run(
    'INSERT INTO panier (user_id, produit_id, quantite) VALUES (?, ?, ?)',
    [user_id, produit_id, quantite],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, message: 'Produit ajouté au panier' });
    }
  );
});

// Obtenir le panier
router.get('/panier/:user_id', (req, res) => {
  const { user_id } = req.params;

  db.all(`
    SELECT p.id, p.nom, p.prix, pa.quantite, (p.prix * pa.quantite) as total
    FROM panier pa
    JOIN produits p ON pa.produit_id = p.id
    WHERE pa.user_id = ?
  `, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

// Checkout
router.post('/checkout', (req, res) => {
  const { user_id, total } = req.body;

  db.run(
    'INSERT INTO commandes (user_id, total, statut) VALUES (?, ?, ?)',
    [user_id, total, 'complétée'],
    function(err) {
      if (err) return res.status(500).json({ error: err });

      // Vider le panier
      db.run('DELETE FROM panier WHERE user_id = ?', [user_id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ success: true, commande_id: this.lastID });
      });
    }
  );
});

module.exports = router;
