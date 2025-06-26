const express = require('express');
const router = express.Router();
const axios = require('axios');
const { createPayPalOrder, capturePayPalOrder } = require('../controllers/paymentController');

// 🔶 Orange Money – Récupération du token
router.post('/orange/token', async (req, res) => {
  try {
    const credentials = Buffer.from(`${process.env.ORANGE_CLIENT_ID}:${process.env.ORANGE_CLIENT_SECRET}`).toString('base64');
    const response = await axios.post(
      'https://api.orange.com/oauth/v3/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur token Orange' });
  }
});

// 🔵 PayPal – Création et capture de commande
router.post('/paypal/create-order', createPayPalOrder);
router.post('/paypal/capture-order/:orderID', capturePayPalOrder);

// 📦 Exporter le routeur une seule fois
module.exports = router;
//mtn
const { requestToPay } = require('../controllers/mtnController');

router.post('/mtn/request-to-pay', requestToPay);
