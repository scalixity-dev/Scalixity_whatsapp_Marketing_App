import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Campaigns from './pages/Campaigns';
import Conversations from './pages/Conversations';
import Templates from './pages/Templates';
import Analytics from './pages/Analytics';
import Groups from './pages/Groups';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="templates" element={<Templates />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="groups" element={<Groups />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;