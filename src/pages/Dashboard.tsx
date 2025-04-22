import React, { useState, useEffect } from 'react';
import { Users, Send, MessageSquare, BarChart2 } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import ActivityChart from '../components/Dashboard/ActivityChart';
import RecentCampaigns from '../components/Dashboard/RecentCampaigns';
import RecentMessages from '../components/Dashboard/RecentMessages';
import { Campaign, Contact, Message, DashboardStats } from '../types';
import { analyticsService } from '../services/analyticsService';
import { campaignService } from '../services/campaignService';
import { contactService } from '../services/contactService';
import { messageService } from '../services/messageService';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Activity chart data
  const chartData = [
    { date: 'Mon', sent: 124, delivered: 120, read: 95, replied: 45 },
    { date: 'Tue', sent: 145, delivered: 140, read: 110, replied: 55 },
    { date: 'Wed', sent: 165, delivered: 160, read: 130, replied: 70 },
    { date: 'Thu', sent: 180, delivered: 175, read: 140, replied: 65 },
    { date: 'Fri', sent: 165, delivered: 160, read: 120, replied: 60 },
    { date: 'Sat', sent: 130, delivered: 125, read: 100, replied: 40 },
    { date: 'Sun', sent: 100, delivered: 95, read: 75, replied: 30 },
  ];
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch all required data
        const [dashboardStats, campaigns, allMessages, allContacts] = await Promise.all([
          analyticsService.getDashboardStats(),
          campaignService.getAllCampaigns(),
          messageService.getAllMessages(),
          contactService.getAllContacts()
        ]);
        
        // Sort campaigns by created date (newest first) and take the most recent 5
        const sortedCampaigns = [...campaigns].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 4);
        
        // Sort messages by timestamp (newest first) and take the most recent 10
        const sortedMessages = [...allMessages].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ).slice(0, 8);
        
        setStats(dashboardStats);
        setRecentCampaigns(sortedCampaigns);
        setRecentMessages(sortedMessages);
        setContacts(allContacts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format percentage
  const formatPercentage = (num: number): string => {
    return `${num}%`;
  };
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-emerald-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Contacts" 
          value={stats?.totalContacts || 0} 
          icon={<Users className="h-5 w-5" />}
          formatter={formatNumber}
          color="primary"
          change={12}
        />
        <StatsCard 
          title="Active Campaigns" 
          value={stats?.activeCampaigns || 0} 
          icon={<Send className="h-5 w-5" />}
          formatter={formatNumber}
          color="secondary"
          change={5}
        />
        <StatsCard 
          title="Messages Delivered" 
          value={stats?.messagesDelivered || 0} 
          icon={<MessageSquare className="h-5 w-5" />}
          formatter={formatNumber}
          color="info"
          change={18}
        />
        <StatsCard 
          title="Response Rate" 
          value={stats?.responseRate || 0} 
          icon={<BarChart2 className="h-5 w-5" />}
          formatter={formatPercentage}
          color="success"
          change={3}
        />
      </div>
      
      {/* Charts and recent data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart data={chartData} />
        <RecentCampaigns campaigns={recentCampaigns} />
      </div>
      
      <div>
        <RecentMessages 
          messages={recentMessages} 
          contacts={contacts} 
        />
      </div>
    </div>
  );
};

export default Dashboard;