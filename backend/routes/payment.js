const express = require('express');
const router = express.Router();
const axios = require('axios');

// Exemple de token Orange
router.post('/orange/token', async (req, res) => {
  try {
    const credentials = Buffer.from(`${process.env.ORANGE_CLIENT_ID}:${process.env.ORANGE_CLIENT_SECRET}`).toString('base64');
    const response = await axios.post('https://api.orange.com/oauth/v3/token', 
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

module.exports = router;
// paypal paiement

const express = require('express');
const { createPayPalOrder, capturePayPalOrder } = require('../controllers/paymentController');

router.post('/paypal/create-order', createPayPalOrder);
router.post('/paypal/capture-order/:orderID', capturePayPalOrder);

module.exports = router;
