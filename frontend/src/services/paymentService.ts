export interface PaymentData {
  amount: number;
  method: 'paypal' | 'orange-money' | 'mtn-momo' | 'bitcoin';
  phoneNumber?: string;
  email?: string;
  bitcoinAddress?: string;
}

export const paymentService = {
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

  async processPayment(paymentData: PaymentData): Promise<{ success: boolean }> {
    const { valid, errors } = this.validatePaymentData(paymentData);
    if (!valid) {
      console.warn('Erreur validation paiement:', errors);
      return { success: false };
    }

    // Simulation simple pour Orange, MTN et Bitcoin
    // À remplacer plus tard par vraies API
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true }), 2000);
    });
  },

  validatePaymentData(paymentData: PaymentData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Montant invalide');
    }

    switch (paymentData.method) {
      case 'orange-money':
      case 'mtn-momo':
        if (!paymentData.phoneNumber || !/^\+?[1-9]\d{8,14}$/.test(paymentData.phoneNumber)) {
          errors.push('Numéro de téléphone invalide');
        }
        break;

      case 'paypal':
        if (!paymentData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)) {
          errors.push('Email PayPal invalide');
        }
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
