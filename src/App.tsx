import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuickLog from './components/QuickLog';
import AIAssistant from './components/AIAssistant';
import Settings from './components/Settings';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import { isTelegramWebApp } from './lib/telegram';
import './i18n';

function AppShell() {
  const { preferences } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!preferences.onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
      {activeTab === 'quick-log' && <QuickLog />}
      {activeTab === 'ai' && <AIAssistant />}
      {activeTab === 'settings' && <Settings />}
    </Layout>
  );
}

export default function App() {
  if (!isTelegramWebApp()) {
    return (
      <AppProvider>
        <Login />
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
