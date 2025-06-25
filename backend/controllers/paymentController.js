const axios = require('axios');

exports.createPayPalOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const auth = await getPayPalAccessToken();
    const response = await axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: 'EUR', value: amount.toString() } }],
    }, {
      headers: {
        Authorization: `Bearer ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    res.json({ id: response.data.id });
  } catch (err) {
    console.error('Erreur création commande PayPal', err.message);
    res.status(500).json({ error: 'Erreur PayPal' });
  }
};

exports.capturePayPalOrder = async (req, res) => {
  try {
    const orderId = req.params.orderID;
    const auth = await getPayPalAccessToken();

    const response = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ status: response.data.status });
  } catch (err) {
    console.error('Erreur capture PayPal', err.message);
    res.status(500).json({ error: 'Erreur capture PayPal' });
  }
};

exports.generateOrangeToken = async (req, res) => {
  try {
    const credentials = Buffer.from(`${process.env.ORANGE_CLIENT_ID}:${process.env.ORANGE_CLIENT_SECRET}`).toString('base64');
    const response = await axios.post(
      'https://api.orange.com/oauth/v3/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('Erreur token Orange', err.message);
    res.status(500).json({ error: 'Erreur Orange' });
  }
};

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', 
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
}
