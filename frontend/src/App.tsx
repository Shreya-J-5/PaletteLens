import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewAnalysisPage } from './pages/NewAnalysisPage';
import { AnalysisResultsPage } from './pages/AnalysisResultsPage';
import { PageAnalysisDetail } from './pages/PageAnalysisDetail';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { DocumentationPage } from './pages/DocumentationPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#F6F5F2] text-[#111318] flex flex-col font-sans antialiased">
          <Navbar />
          <AuthModal />
          <LogoutConfirmModal />
          
          <div className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/docs" element={<DocumentationPage />} />
              <Route
                path="/*"
                element={
                  <div className="flex-1 flex w-full">
                    <Sidebar />
                    <main className="flex-1 overflow-x-hidden">
                      <Routes>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/analyze" element={<NewAnalysisPage />} />
                        <Route path="/analysis/:id" element={<AnalysisResultsPage />} />
                        <Route path="/analysis/:id/page/:pageId" element={<PageAnalysisDetail />} />
                      </Routes>
                    </main>
                  </div>
                }
              />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
