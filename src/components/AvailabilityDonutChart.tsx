import React from 'react';

interface AvailabilityData {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

interface AvailabilityDonutChartProps {
  data: AvailabilityData[];
}

const AvailabilityDonutChart: React.FC<AvailabilityDonutChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let cumulativePercentage = 0;

  const createPath = (percentage: number, startAngle: number) => {
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex items justify-center">
      <div className="relative">
        <svg width="250" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
          {data.map((item, index) => {
            const path = createPath(item.percentage, cumulativePercentage * 3.6);
            cumulativePercentage += item.percentage;
            
            return (
              <path
                key={item.status}
                d={path}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300 hover:opacity-80"
              />
            );
          })}
          
          {/* Inner circle for donut effect */}
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="white"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-20 flex justify-center">
          <div className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Total Unit<br></br> Categories</div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="ml-6 space-y-2">
        {data.map((item) => (
          <div key={item.status} className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="text-xs flex justify-between w-full" >
              <div className="font-medium text-gray-900">{item.status}</div>
              <div className="text-gray-500">
                {item.count.toLocaleString()} ({item.percentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityDonutChart;