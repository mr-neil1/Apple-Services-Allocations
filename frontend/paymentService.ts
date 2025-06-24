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

  // Exemple générique
  async processPayment(paymentData: PaymentData): Promise<{ success: boolean; transactionId?: string }> {
    if (paymentData.method === 'paypal') {
      const orderId = await paymentService.createPaypalOrder(paymentData.amount);
      if (!orderId) return { success: false };

      const success = await paymentService.capturePaypalOrder(orderId);
      return {
        success,
        transactionId: success ? `PAYPAL_${orderId}` : undefined,
      };
    }

    // Pour Orange, Bitcoin, etc. plus tard
    return { success: false };
  },
};
