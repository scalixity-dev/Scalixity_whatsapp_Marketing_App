import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: number;
  formatter?: (value: number | string) => string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  formatter = (val) => val.toString(),
  color = 'primary'
}) => {
  const getColorClasses = () => {
    switch(color) {
      case 'primary':
        return {
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          changeBg: change && change > 0 ? 'bg-emerald-100' : 'bg-red-100',
          changeColor: change && change > 0 ? 'text-emerald-600' : 'text-red-600'
        };
      case 'secondary':
        return {
          iconBg: 'bg-indigo-100',
          iconColor: 'text-indigo-600',
          changeBg: change && change > 0 ? 'bg-emerald-100' : 'bg-red-100',
          changeColor: change && change > 0 ? 'text-emerald-600' : 'text-red-600'
        };
      case 'success':
        return {
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          changeBg: 'bg-emerald-100',
          changeColor: 'text-emerald-600'
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          changeBg: change && change > 0 ? 'bg-emerald-100' : 'bg-red-100',
          changeColor: change && change > 0 ? 'text-emerald-600' : 'text-red-600'
        };
      case 'info':
        return {
          iconBg: 'bg-sky-100',
          iconColor: 'text-sky-600',
          changeBg: change && change > 0 ? 'bg-emerald-100' : 'bg-red-100',
          changeColor: change && change > 0 ? 'text-emerald-600' : 'text-red-600'
        };
      default:
        return {
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          changeBg: change && change > 0 ? 'bg-emerald-100' : 'bg-red-100',
          changeColor: change && change > 0 ? 'text-emerald-600' : 'text-red-600'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{formatter(value)}</h3>
        </div>
        <div className={`p-3 rounded-full ${colors.iconBg} ${colors.iconColor}`}>
          {icon}
        </div>
      </div>
      
      {change !== undefined && (
        <div className="mt-4 flex items-center">
          <div className={`px-2 py-0.5 rounded text-xs font-medium ${colors.changeBg} ${colors.changeColor}`}>
            {change > 0 ? '+' : ''}{change}%
          </div>
          <span className="ml-2 text-xs text-gray-500">from last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;