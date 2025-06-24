import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface UserAllocation {
  id: string;
  articleId: string;
  articleName: string;
  allocationDate: Date;
  dailyRevenue: number;
  totalRevenue: number;
  withdrawalDate: Date;
  isActive: boolean;
}

interface WithdrawButtonProps {
  balance: number;
  allocations: UserAllocation[];
  onWithdraw: () => void;
}

const WithdrawButton: React.FC<WithdrawButtonProps> = ({ 
  balance, 
  allocations, 
  onWithdraw 
}) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const canWithdraw = () => {
    return allocations.every(allocation => {
      const now = new Date();
      return now >= allocation.withdrawalDate;
    });
  };

  const getTimeUntilWithdraw = () => {
    if (allocations.length === 0) return null;
    
    const earliestWithdraw = allocations.reduce((earliest, allocation) => {
      return allocation.withdrawalDate < earliest ? allocation.withdrawalDate : earliest;
    }, allocations[0].withdrawalDate);

    const now = new Date();
    const diff = earliestWithdraw.getTime() - now.getTime();
    
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}j ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleWithdraw = async () => {
    if (!canWithdraw()) return;

    setIsWithdrawing(true);
    
    // Simulation du processus de retrait
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsWithdrawing(false);
    setShowSuccessMessage(true);
    
    // Reset après 3 secondes
    setTimeout(() => {
      setShowSuccessMessage(false);
      onWithdraw();
    }, 3000);
  };

  const timeRemaining = getTimeUntilWithdraw();
  const isWithdrawable = canWithdraw();

  if (showSuccessMessage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-sm p-6"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Retrait Réussi !
          </h3>
          <p className="text-gray-600 mb-4">
            Votre montant de {balance.toFixed(2)}€ a été transféré avec succès.
          </p>
          <div className="text-sm text-gray-500">
            Rechargement du dashboard...
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Retirer mes gains</h3>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="text-3xl font-bold text-green-600">
              {balance.toFixed(2)}€
            </div>
            <div className="text-sm text-gray-600">
              Solde disponible pour retrait
            </div>
          </div>

          {!isWithdrawable && timeRemaining && (
            <div className="flex items-center space-x-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-lg text-sm mb-4">
              <Clock className="h-4 w-4" />
              <span>Retrait disponible dans {timeRemaining}</span>
            </div>
          )}

          {isWithdrawable && (
            <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm mb-4">
              <CheckCircle className="h-4 w-4" />
              <span>Retrait disponible maintenant</span>
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            onClick={handleWithdraw}
            disabled={!isWithdrawable || isWithdrawing}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              isWithdrawable && !isWithdrawing
                ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isWithdrawing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Traitement...</span>
              </div>
            ) : isWithdrawable ? (
              'Retirer maintenant'
            ) : (
              'Retrait verrouillé'
            )}
          </button>

          {isWithdrawable && (
            <div className="text-xs text-gray-500 mt-2">
              Processus instantané et sécurisé
            </div>
          )}
        </div>
      </div>

      {allocations.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Détails des allocations
          </h4>
          <div className="space-y-2">
            {allocations.map((allocation) => {
              const canWithdrawThis = new Date() >= allocation.withdrawalDate;
              return (
                <div key={allocation.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{allocation.articleName}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {allocation.totalRevenue.toFixed(2)}€
                    </span>
                    {canWithdrawThis ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WithdrawButton;