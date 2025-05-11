const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: `Bem-vindo, ${req.user.email}!`,
    userId: req.user.userId
  });
});

module.exports = router;
