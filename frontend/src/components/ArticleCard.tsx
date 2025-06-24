import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Smartphone, Laptop, Headphones, Tablet, Watch, Monitor } from 'lucide-react';

interface Article {
  id: string;
  name: string;
  description: string;
  price: number;
  dailyRevenue: number;
  image: string;
  category: string;
}

interface ArticleCardProps {
  article: Article;
  onAllocate: (article: Article) => void;
  delay?: number;
  isAllocated?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  onAllocate, 
  delay = 0,
  isAllocated = false 
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'iPhone':
        return <Smartphone className="h-5 w-5" />;
      case 'MacBook':
      case 'Mac':
        return <Laptop className="h-5 w-5" />;
      case 'AirPods':
        return <Headphones className="h-5 w-5" />;
      case 'iPad':
        return <Tablet className="h-5 w-5" />;
      case 'Watch':
        return <Watch className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <img 
          src={article.image} 
          alt={article.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-gray-700">
            {getCategoryIcon(article.category)}
            <span>{article.category}</span>
          </div>
        </div>
        {isAllocated && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              <span>Alloué</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {article.name}
        </h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {article.description}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Prix d'allocation</span>
            <span className="text-lg font-bold text-gray-900">{article.price}€</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Revenus quotidiens</span>
            <span className="text-lg font-bold text-green-600">+{article.dailyRevenue}€/jour</span>
          </div>
          <div className="h-px bg-gray-200"></div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">ROI mensuel estimé</span>
            <span className="text-sm font-bold text-blue-600">
              {((article.dailyRevenue * 30 / article.price) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <button
          onClick={() => onAllocate(article)}
          disabled={isAllocated}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
            isAllocated
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {isAllocated ? (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>Service Alloué</span>
            </>
          ) : (
            <>
              <span>Allouer ce service</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ArticleCard;