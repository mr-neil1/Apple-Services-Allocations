import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, DollarSign, Bitcoin, Check, AlertCircle } from 'lucide-react';
import { paymentService } from '../services/paymentService';
interface Article {
  id: string;
  name: string;
  description: string;
  price: number;
  dailyRevenue: number;
  image: string;
  category: string;
}

interface PaymentModalProps {
  article: Article;
  onClose: () => void;
  onSuccess: (article: Article) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ article, onClose, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [bitcoinAddress, setBitcoinAddress] = useState('');

  const paymentMethods = [
    {
      id: 'momo',
      name: 'MTN MoMo',
      icon: <Smartphone className="h-6 w-6" />,
      color: 'bg-yellow-500',
      description: 'Paiement mobile MTN'
    },
    {
      id: 'orange',
      name: 'Orange Money',
      icon: <Smartphone className="h-6 w-6" />,
      color: 'bg-orange-500',
      description: 'Paiement mobile Orange'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'bg-blue-500',
      description: 'Paiement sécurisé PayPal'
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      icon: <Bitcoin className="h-6 w-6" />,
      color: 'bg-orange-400',
      description: 'Crypto-monnaie Bitcoin'
    }
  ];

const handlePayment = async () => {
  if (!selectedMethod) return;

  setIsProcessing(true);

  const paymentData = {
    amount: article.price,
    method: selectedMethod === 'momo' ? 'mtn-momo' : selectedMethod,
    phoneNumber,
    email: "client@exemple.com", // tu peux ajouter un champ email dynamique plus tard
    bitcoinAddress,
  };

  const result = await paymentService.processPayment(paymentData);

  setIsProcessing(false);
  if (result.success) {
    setIsSuccess(true);
    setTimeout(() => {
      onSuccess(article);
    }, 2000);
  } else {
    alert("Échec du paiement. Veuillez réessayer.");
  }
};

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'momo':
      case 'orange':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ex: +237 6XX XXX XXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
      
      case 'paypal':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de carte
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'expiration
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/AA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );
      
      case 'bitcoin':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse Bitcoin
              </label>
              <input
                type="text"
                value={bitcoinAddress}
                onChange={(e) => setBitcoinAddress(e.target.value)}
                placeholder="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-orange-700">
                  Montant: {(article.price / 45000).toFixed(8)} BTC (taux: 45,000€/BTC)
                </span>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Paiement Réussi !
          </h3>
          <p className="text-gray-600 mb-4">
            Votre service {article.name} a été alloué avec succès.
          </p>
          <div className="text-sm text-gray-500">
            Génération des revenus en cours...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Paiement Sécurisé</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6">
            {/* Article Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={article.image} 
                  alt={article.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{article.name}</h3>
                  <p className="text-sm text-gray-600">{article.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold text-gray-900">{article.price}€</span>
                    <span className="text-sm text-green-600 font-medium">
                      +{article.dailyRevenue}€/jour
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Choisissez votre méthode de paiement
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 ${method.color} text-white rounded-lg`}>
                        {method.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            {selectedMethod && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Informations de paiement
                </h4>
                {renderPaymentForm()}
              </motion.div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                selectedMethod && !isProcessing
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Traitement en cours...</span>
                </div>
              ) : (
                `Payer ${article.price}€`
              )}
            </button>

            {/* Security Notice */}
            <div className="mt-4 text-center text-sm text-gray-500">
              🔒 Paiement sécurisé et crypté
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;