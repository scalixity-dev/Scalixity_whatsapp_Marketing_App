import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, UserCheck, Clock } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import { DashboardStats } from '../types';
import { analyticsService } from '../services/analyticsService';


const Analytics: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await analyticsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);
  
  // Format percentage
  const formatPercentage = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `${num.toFixed(1)}%`;
  };
  
  // Mock campaign performance data - in a real app, this would come from the API
  const campaignPerformance = [
    { 
      id: 1, 
      name: 'Product Launch', 
      delivered: 245, 
      read: 190, 
      replied: 42 
    },
    { 
      id: 2, 
      name: 'Black Friday Sale', 
      delivered: 0, 
      read: 0, 
      replied: 0 
    },
    { 
      id: 3, 
      name: 'Customer Feedback', 
      delivered: 142, 
      read: 98, 
      replied: 45 
    },
    { 
      id: 4, 
      name: 'Webinar Invitation', 
      delivered: 275, 
      read: 150, 
      replied: 30 
    },
  ];
  
  // Mock response times data
  const responseTimesData = [
    { timeRange: '<5 min', count: 35 },
    { timeRange: '5-30 min', count: 45 },
    { timeRange: '30-60 min', count: 25 },
    { timeRange: '1-3 hours', count: 20 },
    { timeRange: '3-24 hours', count: 15 },
    { timeRange: '>24 hours', count: 5 },
  ];
  
  // Calculate max for response times chart
  const maxResponseCount = Math.max(...responseTimesData.map(d => d.count));
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-emerald-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Response Rate" 
          value={stats?.responseRate || 0} 
          icon={<BarChart2 className="h-5 w-5" />}
          formatter={formatPercentage}
          color="primary"
          change={4.2}
        />
        <StatsCard 
          title="Messages Delivered" 
          value={stats?.messagesDelivered || 0} 
          icon={<TrendingUp className="h-5 w-5" />}
          color="info"
          change={12.5}
        />
        <StatsCard 
          title="Active Contacts" 
          value={stats?.activeContacts || 0} 
          icon={<UserCheck className="h-5 w-5" />}
          color="success"
          change={8.1}
        />
        <StatsCard 
          title="Avg. Response Time" 
          value="42 min" 
          icon={<Clock className="h-5 w-5" />}
          color="secondary"
          change={-15.3}
        />
      </div>
      
      {/* Campaign Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Campaign Performance</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Open Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Response Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaignPerformance.map((campaign) => {
                const totalContacts = campaign.delivered > 0 ? campaign.delivered : 250; // Mock total if no messages sent
                const deliveryRate = (campaign.delivered / totalContacts) * 100;
                const openRate = campaign.delivered > 0 ? (campaign.read / campaign.delivered) * 100 : 0;
                const responseRate = campaign.read > 0 ? (campaign.replied / campaign.read) * 100 : 0;
                
                return (
                  <tr key={campaign.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">{deliveryRate.toFixed(1)}%</span>
                        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${deliveryRate}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">{openRate.toFixed(1)}%</span>
                        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${openRate}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">{responseRate.toFixed(1)}%</span>
                        <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2">
                          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${responseRate}%` }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Response Times Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Response Times</h2>
        
        <div className="mt-6">
          <div className="flex items-end">
            {responseTimesData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">{data.count}</div>
                <div 
                  className="w-full mx-1 max-w-[50px] bg-emerald-500 rounded-t"
                  style={{ 
                    height: `${(data.count / maxResponseCount) * 200}px`,
                    backgroundColor: index === 0 || index === 1 ? '#10b981' : // emerald-500
                                     index === 2 || index === 3 ? '#3b82f6' : // blue-500
                                     '#6366f1' // indigo-500
                  }}
                ></div>
                <div className="text-xs text-gray-500 mt-2 text-center">{data.timeRange}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>Average response time: <span className="font-medium text-gray-800">42 minutes</span></p>
            <p>Fastest response: <span className="font-medium text-gray-800">30 seconds</span></p>
            <p>Most responses occur within: <span className="font-medium text-gray-800">5-30 minutes</span></p>
          </div>
        </div>
      </div>
      
      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Engagement</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>Active Contacts</span>
                <span>{(stats?.activeContacts || 0) / (stats?.totalContacts || 1) * 100}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${(stats?.activeContacts || 0) / (stats?.totalContacts || 1) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>Responding Contacts</span>
                <span>32.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: '32.5%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>Repeat Responders</span>
                <span>18.7%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: '18.7%' }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p className="mb-2">Most active hours:</p>
              <div className="flex space-x-1">
                {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((hour) => (
                  <div 
                    key={hour} 
                    className="flex-1 h-8 rounded"
                    style={{ 
                      backgroundColor: 
                        hour >= 9 && hour <= 10 ? '#d1fae5' : // emerald-100
                        hour >= 11 && hour <= 13 ? '#6ee7b7' : // emerald-300
                        hour >= 14 && hour <= 15 ? '#10b981' : // emerald-500
                        hour >= 16 && hour <= 17 ? '#6ee7b7' : // emerald-300
                        '#d1fae5' // emerald-100
                    }}
                    title={`${hour}:00 - ${hour+1}:00`}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>9 AM</span>
                <span>2 PM</span>
                <span>6 PM</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Campaign Trends</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Best Performing Campaigns</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li className="text-sm text-gray-600">Customer Feedback (45% response rate)</li>
                <li className="text-sm text-gray-600">Product Launch (22% response rate)</li>
                <li className="text-sm text-gray-600">Webinar Invitation (20% response rate)</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Most Engaging Message Types</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                    <span>Questions</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                    <span>Offers/Discounts</span>
                    <span>48%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '48%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                    <span>Announcements</span>
                    <span>32%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Top Performing Times</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500">Day of Week</div>
                  <div className="text-sm font-medium text-gray-800">Tuesday</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500">Time of Day</div>
                  <div className="text-sm font-medium text-gray-800">2PM - 4PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;