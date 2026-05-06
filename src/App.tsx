import React, { useState } from 'react';
import { AppProvider } from './AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuickLog from './components/QuickLog';
import AIAssistant from './components/AIAssistant';
import Settings from './components/Settings';
import Login from './components/Login';
import { isTelegramWebApp } from './lib/telegram';
import './i18n';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(() => isTelegramWebApp());

  return (
    <AppProvider>
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
          {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
          {activeTab === 'quick-log' && <QuickLog />}
          {activeTab === 'ai' && <AIAssistant />}
          {activeTab === 'settings' && <Settings />}
        </Layout>
      )}
    </AppProvider>
  );
}
