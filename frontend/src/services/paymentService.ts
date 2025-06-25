export interface PaymentData {
  amount: number;
  method: 'paypal' | 'orange-money' | 'mtn-momo' | 'bitcoin';
  phoneNumber?: string;
  email?: string;
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

      // Ajoute ici d’autres méthodes réelles (MTN, Orange, etc.)
      
      return { success: false };
    } catch (err) {
      console.error('Erreur processPayment:', err);
      return { success: false };
    }
  },
  
  // Les fonctions createPaypalOrder et capturePaypalOrder que tu as déjà doivent être présentes ici
  // ...
};
