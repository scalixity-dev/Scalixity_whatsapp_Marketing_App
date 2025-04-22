import React from 'react';

interface DataPoint {
  date: string;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
}

interface ActivityChartProps {
  data: DataPoint[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  // Find the maximum value for scaling
  const maxValue = Math.max(...data.flatMap(d => [d.sent, d.delivered, d.read, d.replied]));
  
  // Chart height for scaling
  const chartHeight = 200;
  
  // Function to calculate bar height
  const getBarHeight = (value: number) => {
    return value === 0 ? 0 : Math.max(10, (value / maxValue) * chartHeight);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Message Activity</h3>
      
      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Sent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Delivered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Read</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Replied</span>
          </div>
        </div>
        
        <div className="relative h-[200px] mt-6">
          <div className="absolute inset-0 flex items-end justify-between">
            {data.map((point, index) => (
              <div key={index} className="flex flex-col items-center justify-end space-y-1 w-16">
                <div className="w-full flex justify-around items-end h-[200px]">
                  <div 
                    className="w-2 bg-emerald-500 rounded-t transition-all duration-300 ease-out"
                    style={{ height: `${getBarHeight(point.sent)}px` }}
                  ></div>
                  <div 
                    className="w-2 bg-blue-500 rounded-t transition-all duration-300 ease-out"
                    style={{ height: `${getBarHeight(point.delivered)}px` }}
                  ></div>
                  <div 
                    className="w-2 bg-indigo-500 rounded-t transition-all duration-300 ease-out"
                    style={{ height: `${getBarHeight(point.read)}px` }}
                  ></div>
                  <div 
                    className="w-2 bg-purple-500 rounded-t transition-all duration-300 ease-out"
                    style={{ height: `${getBarHeight(point.replied)}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{point.date}</span>
              </div>
            ))}
          </div>
          
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="border-t border-gray-200 w-full h-0"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;