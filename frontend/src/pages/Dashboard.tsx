import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Apple, LogOut, Wallet, TrendingUp, Clock, Plus } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import RevenueTracker from '../components/RevenueTracker';
import WithdrawButton from '../components/WithdrawButton';
import PaymentModal from '../components/PaymentModal';

interface Article {
  id: string;
  name: string;
  description: string;
  price: number;
  dailyRevenue: number;
  image: string;
  category: string;
}

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

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [allocations, setAllocations] = useState<UserAllocation[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [totalBalance, setTotalBalance] = useState(0);

  const articles: Article[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Services',
      description: 'Services premium pour iPhone 15 Pro avec technologie avancée',
      price: 299,
      dailyRevenue: 15,
      image: 'https://images.pexels.com/photos/18525574/pexels-photo-18525574.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'iPhone'
    },
    {
      id: '2',
      name: 'MacBook Pro Services',
      description: 'Services professionnels pour MacBook Pro M3',
      price: 499,
      dailyRevenue: 25,
      image: 'https://images.pexels.com/photos/18105/pexels-photo-18105.jpg?auto=compress&cs=tinysrgb&w=400',
      category: 'MacBook'
    },
    {
      id: '3',
      name: 'AirPods Pro Services',
      description: 'Services audio premium avec réduction de bruit',
      price: 199,
      dailyRevenue: 8,
      image: 'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'AirPods'
    },
    {
      id: '4',
      name: 'iPad Pro Services',
      description: 'Services créatifs pour iPad Pro avec Apple Pencil',
      price: 399,
      dailyRevenue: 18,
      image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpg?auto=compress&cs=tinysrgb&w=400',
      category: 'iPad'
    },
    {
      id: '5',
      name: 'Apple Watch Services',
      description: 'Services de santé et fitness pour Apple Watch',
      price: 149,
      dailyRevenue: 6,
      image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Watch'
    },
    {
      id: '6',
      name: 'Mac Studio Services',
      description: 'Services professionnels pour Mac Studio haute performance',
      price: 799,
      dailyRevenue: 35,
      image: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=400',
      category: 'Mac'
    }
  ];

  // Simulation de génération de revenus quotidiens
  useEffect(() => {
    const generateDailyRevenue = () => {
      setAllocations(prev => 
        prev.map(allocation => {
          const daysSinceAllocation = Math.floor(
            (Date.now() - allocation.allocationDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          const newTotalRevenue = daysSinceAllocation * allocation.dailyRevenue;
          
          return {
            ...allocation,
            totalRevenue: newTotalRevenue
          };
        })
      );
    };

    const interval = setInterval(generateDailyRevenue, 1000); // Mise à jour chaque seconde pour la démo
    return () => clearInterval(interval);
  }, []);

  // Calcul du solde total
  useEffect(() => {
    const total = allocations.reduce((sum, allocation) => sum + allocation.totalRevenue, 0);
    setTotalBalance(total);
  }, [allocations]);

  const handleAllocateService = (article: Article) => {
    setSelectedArticle(article);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (article: Article) => {
    const newAllocation: UserAllocation = {
      id: Date.now().toString(),
      articleId: article.id,
      articleName: article.name,
      allocationDate: new Date(),
      dailyRevenue: article.dailyRevenue,
      totalRevenue: 0,
      withdrawalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 jours
      isActive: true
    };

    setAllocations(prev => [...prev, newAllocation]);
    setShowPaymentModal(false);
    setSelectedArticle(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Apple className="h-6 w-6 text-gray-900" />
              <span className="font-semibold text-xl text-gray-900">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Bonjour, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solde Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalBalance.toFixed(2)}€</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Services Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{allocations.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Quotidiens</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allocations.reduce((sum, a) => sum + a.dailyRevenue, 0)}€/jour
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Revenue Tracker */}
        {allocations.length > 0 && (
          <div className="mb-8">
            <RevenueTracker allocations={allocations} />
          </div>
        )}

        {/* Withdraw Button */}
        {totalBalance > 0 && (
          <div className="mb-8">
            <WithdrawButton 
              balance={totalBalance} 
              allocations={allocations}
              onWithdraw={() => {
                setAllocations([]);
                setTotalBalance(0);
              }}
            />
          </div>
        )}

        {/* Services Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Services Disponibles</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Plus className="h-4 w-4" />
              <span>Cliquez sur "Allouer" pour investir</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                onAllocate={handleAllocateService}
                delay={index * 0.1}
                isAllocated={allocations.some(a => a.articleId === article.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedArticle && (
        <PaymentModal
          article={selectedArticle}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedArticle(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;