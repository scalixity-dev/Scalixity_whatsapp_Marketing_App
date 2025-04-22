import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MessageSquare, Users, Send, Home, BarChart2, FileText, Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getActiveLinkClass = (path: string) => {
    return location.pathname === path
      ? 'bg-emerald-800 text-white'
      : 'text-white hover:bg-emerald-800/50 transition-colors';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-emerald-900 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6" />
          <h1 className="text-lg md:text-xl font-semibold">WhatsApp Marketing</h1>
        </div>
        <button 
          className="md:hidden p-2 rounded-md hover:bg-emerald-800 focus:outline-none"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`bg-emerald-700 w-64 text-white flex flex-col transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 absolute md:relative z-30 h-[calc(100vh-64px)] md:h-auto shadow-lg md:shadow-none`}
        >
          <nav className="flex-1 py-4 px-2">
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/" 
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-md ${getActiveLinkClass('/')}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/contacts" 
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-md ${getActiveLinkClass('/contacts')}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  <span>Contacts</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/campaigns" 
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-md ${getActiveLinkClass('/campaigns')}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Send className="h-5 w-5" />
                  <span>Campaigns</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/conversations" 
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-md ${getActiveLinkClass('/conversations')}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Conversations</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/templates" 
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-md ${getActiveLinkClass('/templates')}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  <span>Templates</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/analytics" 
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-md ${getActiveLinkClass('/analytics')}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <BarChart2 className="h-5 w-5" />
                  <span>Analytics</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/groups" 
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-md ${getActiveLinkClass('/groups')}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  <span>Groups</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-emerald-600 text-xs text-emerald-100">
            <p>© 2025 WhatsApp Marketing</p>
            <p>Version 1.0.0</p>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;