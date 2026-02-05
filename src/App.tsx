// Main App component with routing
// Sets up React Router and context providers

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, LanguageProvider, ToastProvider } from './context';
import { Header, Footer, ProtectedRoute, WhatsAppButton } from './components';
import {
  LandingPage,
  LoginPage,
  RegisterPage,
  FormPage,
  UserDashboard,
  AdminDashboard,
  PetPage,
  NotFoundPage
} from './pages';
import { useLocation } from 'react-router-dom';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pet/:id" element={<PetPage />} />

          {/* Protected User Routes (not for admins) */}
          <Route
            path="/submit"
            element={
              <ProtectedRoute userOnly>
                <FormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute userOnly>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      {!isAdminPage && <WhatsAppButton />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
