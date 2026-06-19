const express = require('express');
const db = require('../database');

const router = express.Router();

// Options de vote disponibles
const OPTIONS = ['Option A', 'Option B', 'Option C', 'Option D'];

// Obtenir les résultats
router.get('/resultats', (req, res) => {
  db.all(`
    SELECT option, COUNT(*) as votes 
    FROM votes 
    GROUP BY option
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err });

    // Ajouter les options avec 0 votes
    const resultats = {};
    OPTIONS.forEach(opt => resultats[opt] = 0);
    rows.forEach(row => resultats[row.option] = row.votes);

    res.json(resultats);
  });
});

// Voter
router.post('/voter', (req, res) => {
  const { user_id, option } = req.body;

  if (!OPTIONS.includes(option)) {
    return res.status(400).json({ error: 'Option invalide' });
  }

  // Vérifier si l'utilisateur a déjà voté
  db.get('SELECT * FROM votes WHERE user_id = ?', [user_id], (err, vote) => {
    if (vote) {
      return res.status(400).json({ error: 'Vous avez déjà voté' });
    }

    db.run('INSERT INTO votes (user_id, option) VALUES (?, ?)', [user_id, option], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, message: 'Vote enregistré!' });
    });
  });
});

module.exports = router;
