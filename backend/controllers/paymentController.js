const { getPayPalToken, createOrder, captureOrder } = require('../services/paypalService');

exports.createPayPalOrder = async (req, res) => {
  try {
    const token = await getPayPalToken();
    const order = await createOrder(token, req.body.amount);
    res.json(order);
  } catch (err) {
    console.error('Erreur createOrder:', err);
    res.status(500).json({ error: 'Erreur lors de la création de la commande PayPal' });
  }
};

exports.capturePayPalOrder = async (req, res) => {
  try {
    const token = await getPayPalToken();
    const captured = await captureOrder(token, req.params.orderID);
    res.json(captured);
  } catch (err) {
    console.error('Erreur captureOrder:', err);
    res.status(500).json({ error: 'Erreur lors de la capture de la commande PayPal' });
  }
};
