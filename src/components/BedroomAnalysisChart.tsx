import React from 'react';

interface BedroomData {
  bedrooms: string;
  count: number;
  avgPrice: number;
  avgMonthlyPayment: number;
}

interface BedroomAnalysisChartProps {
  data: BedroomData[];
}

const BedroomAnalysisChart: React.FC<BedroomAnalysisChartProps> = ({ data }) => {
  const maxCount = Math.max(...data.map(d => d.count));
  const maxPrice = Math.max(...data.map(d => d.avgPrice));
  
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toLocaleString();
  };

  const colors = ['#2563EB', '#059669', '#EA580C', '#9333EA', '#C2410C'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Unit Count Distribution */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Unit Count by Bedroom Type</h4>
        <div className="space-y-3">
          {data.map((item, index) => {
            const width = (item.count / maxCount) * 100;
            const color = colors[index % colors.length];
            
            return (
              <div key={item.bedrooms} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 text-sm">{item.bedrooms}</span>
                  <span className="font-semibold text-gray-900 text-sm">
                    {item.count} units
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${width}%`,
                      backgroundColor: color 
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Average Price Distribution */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Average Price by Bedroom Type</h4>
        <div className="space-y-3">
          {data.map((item, index) => {
            const width = (item.avgPrice / maxPrice) * 100;
            const color = colors[index % colors.length];
            
            return (
              <div key={item.bedrooms} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 text-sm">{item.bedrooms}</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 text-sm">
                      KES {formatPrice(item.avgPrice)}
                    </div>
                    {/* <div className="text-xs text-gray-500">
                      ~KES {formatPrice(item.avgMonthlyPayment)}/month
                    </div> */}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${width}%`,
                      backgroundColor: color 
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BedroomAnalysisChart;