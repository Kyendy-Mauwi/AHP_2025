import React from 'react';

interface CountyData {
  county: string;
  totalProjects: number;
  totalUnits: number;
  avgPrice: number;
}

interface CountyDistributionChartProps {
  data: CountyData[];
  sortBy: 'projects' | 'units' | 'price';
}

const CountyDistributionChart: React.FC<CountyDistributionChartProps> = ({ data, sortBy }) => {
  const sortedData = [...data]
    .sort((a, b) => {
      switch (sortBy) {
        case 'projects':
          return b.totalProjects - a.totalProjects;
        case 'units':
          return b.totalUnits - a.totalUnits;
        case 'price':
          return b.avgPrice - a.avgPrice;
        default:
          return 0;
      }
    })
    .slice(0, 5); // Show top 10 counties

  const maxValue = Math.max(...sortedData.map(d => {
    switch (sortBy) {
      case 'projects':
        return d.totalProjects;
      case 'units':
        return d.totalUnits;
      case 'price':
        return d.avgPrice;
      default:
        return 0;
    }
  }));

  const getValue = (item: CountyData) => {
    switch (sortBy) {
      case 'projects':
        return item.totalProjects;
      case 'units':
        return item.totalUnits;
      case 'price':
        return item.avgPrice;
      default:
        return 0;
    }
  };

  const formatValue = (value: number) => {
    if (sortBy === 'price') {
      if (value >= 1000000) {
        return `KES ${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `KES ${(value / 1000).toFixed(0)}K`;
      }
      return `KES ${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  const getColor = (index: number) => {
    const colors = [
      '#2563EB', '#059669', '#EA580C', '#7C2D12', '#9333EA',
      '#C2410C', '#0F766E', '#1D4ED8', '#B45309', '#6366F1'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-3">
      {sortedData.map((item, index) => {
        const value = getValue(item);
        const width = (value / maxValue) * 100;
        const color = getColor(index);
        
        return (
          <div key={item.county} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 text-sm">{item.county}</span>
              <span className="font-semibold text-gray-900 text-sm">
                {formatValue(value)}
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
  );
};

export default CountyDistributionChart;