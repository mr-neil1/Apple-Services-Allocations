const axios = require('axios');
const uuid = require('uuid');

const subscriptionKey = process.env.MTN_SUBSCRIPTION_KEY;
const environment = process.env.MTN_ENVIRONMENT || 'sandbox';

exports.requestToPay = async (req, res) => {
  const { amount, phoneNumber } = req.body;
  const transactionId = uuid.v4();

  try {
    const accessTokenResponse = await axios.post(
      'https://sandbox.momodeveloper.mtn.com/collection/token/',
      {},
      {
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          Authorization: `Basic ${Buffer.from(`${process.env.MTN_USER}:${process.env.MTN_API_KEY}`).toString('base64')}`,
        },
      }
    );

    const accessToken = accessTokenResponse.data.access_token;

    const paymentRequest = {
      amount,
      currency: 'EUR',
      externalId: transactionId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: phoneNumber.replace(/\s+/g, ''), // exemple : 2376XXXXXXXX
      },
      payerMessage: 'Paiement allocation',
      payeeNote: 'Merci pour votre paiement',
    };

    await axios.post(
      `https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/${transactionId}`,
      paymentRequest,
      {
        headers: {
          'X-Reference-Id': transactionId,
          'X-Target-Environment': environment,
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({ transactionId });
  } catch (err) {
    console.error('Erreur MTN:', err.response?.data || err.message);
    res.status(500).json({ error: 'Échec du paiement MoMo' });
  }
};
