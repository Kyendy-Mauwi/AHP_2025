import React from 'react';

interface PriceDistributionChartProps {
  data: Array<{
    category: string;
    avgPrice: number;
    count: number;
    color: string;
  }>;
}

const PriceDistributionChart: React.FC<PriceDistributionChartProps> = ({ data }) => {
  const maxPrice = Math.max(...data.map(d => d.avgPrice));
  
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `KES ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `KES ${(price / 1000).toFixed(0)}K`;
    }
    return `KES ${price.toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const width = (item.avgPrice / maxPrice) * 100;
        
        return (
          <div key={item.category} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="font-medium text-gray-900">{item.category}</span>
                <span className="text-sm text-gray-500">({item.count} units)</span>
              </div>
              <span className="font-semibold text-gray-900">
                {formatPrice(item.avgPrice)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${width}%`,
                  backgroundColor: item.color 
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PriceDistributionChart;