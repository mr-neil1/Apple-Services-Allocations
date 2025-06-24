import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, DollarSign, Clock } from 'lucide-react';

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

interface RevenueTrackerProps {
  allocations: UserAllocation[];
}

const RevenueTracker: React.FC<RevenueTrackerProps> = ({ allocations }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (withdrawalDate: Date) => {
    const now = new Date();
    const diff = withdrawalDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  const getDaysActive = (allocationDate: Date) => {
    const now = new Date();
    const diff = now.getTime() - allocationDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <TrendingUp className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Suivi des Revenus</h3>
      </div>

      <div className="space-y-4">
        {allocations.map((allocation) => {
          const daysActive = getDaysActive(allocation.allocationDate);
          const daysRemaining = getDaysRemaining(allocation.withdrawalDate);
          const progressPercentage = Math.min(100, (daysActive / 5) * 100);

          return (
            <motion.div
              key={allocation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{allocation.articleName}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Alloué le {formatDate(allocation.allocationDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{daysRemaining} jours avant retrait</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {allocation.totalRevenue.toFixed(2)}€
                  </div>
                  <div className="text-sm text-gray-600">
                    +{allocation.dailyRevenue}€/jour
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Progression vers le retrait</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.min(100, progressPercentage).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, progressPercentage)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-2 rounded-full ${
                      progressPercentage >= 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>

              {/* Daily Revenue Breakdown */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-sm font-medium text-gray-900">{daysActive}</div>
                  <div className="text-xs text-gray-600">Jours actifs</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-sm font-medium text-blue-600">
                    {(allocation.totalRevenue / Math.max(1, daysActive)).toFixed(2)}€
                  </div>
                  <div className="text-xs text-gray-600">Moy./jour</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-sm font-medium text-green-600">
                    {(allocation.dailyRevenue * 30).toFixed(0)}€
                  </div>
                  <div className="text-xs text-gray-600">Proj. mensuelle</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RevenueTracker;