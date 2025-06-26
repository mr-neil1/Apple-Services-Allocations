export interface PaymentData {
  amount: number;
  method: 'paypal' | 'orange-money' | 'mtn-momo' | 'bitcoin';
  phoneNumber?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  bitcoinAddress?: string;
}

export const paymentService = {
  async processPayment(paymentData: PaymentData): Promise<{ success: boolean }> {
    const { valid, errors } = paymentService.validatePaymentData(paymentData);
    if (!valid) {
      console.warn('Erreur validation paiement:', errors);
      return { success: false };
    }

    try {
      if (paymentData.method === 'paypal') {
        const orderId = await paymentService.createPaypalOrder(paymentData.amount);
        if (!orderId) return { success: false };

        const isCaptured = await paymentService.capturePaypalOrder(orderId);
        return { success: isCaptured };
      }

      if (paymentData.method === 'mtn-momo') {
        const result = await paymentService.requestMtnPayment(paymentData.amount, paymentData.phoneNumber || '');
        return { success: result };
      }

      // Si d'autres méthodes comme Orange ou Bitcoin doivent être ajoutées, on les gère ici

      return { success: false };
    } catch (err) {
      console.error('Erreur processPayment:', err);
      return { success: false };
    }
  },

  async requestMtnPayment(amount: number, phoneNumber: string): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:5000/api/payment/mtn/request-to-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, phoneNumber }),
      });

      const data = await res.json();
      return !!data.transactionId;
    } catch (err) {
      console.error('Erreur paiement MTN :', err);
      return false;
    }
  },

  // Place ici tes fonctions existantes PayPal
  async createPaypalOrder(amount: number): Promise<string | null> {
    try {
      const res = await fetch('http://localhost:5000/api/payment/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      return data.id || null;
    } catch (err) {
      console.error('Erreur création commande PayPal :', err);
      return null;
    }
  },

  async capturePaypalOrder(orderId: string): Promise<boolean> {
    try {
      const res = await fetch(`http://localhost:5000/api/payment/paypal/capture-order/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      return data.status === 'COMPLETED';
    } catch (err) {
      console.error('Erreur capture PayPal :', err);
      return false;
    }
  },

  validatePaymentData(paymentData: PaymentData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Montant invalide');
    }

    switch (paymentData.method) {
      case 'mtn-momo':
      case 'orange-money':
        if (!paymentData.phoneNumber || !/^\+?[1-9]\d{8,14}$/.test(paymentData.phoneNumber)) {
          errors.push('Numéro de téléphone invalide');
        }
        break;

      case 'paypal':
        // Email devrait être validé ici si tu demandes un email dans le futur
        break;

      case 'bitcoin':
        if (!paymentData.bitcoinAddress || paymentData.bitcoinAddress.length < 26) {
          errors.push('Adresse Bitcoin invalide');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
};
