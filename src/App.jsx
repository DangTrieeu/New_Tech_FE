import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ContactsPage from './pages/ContactsPage';
import AboutPage from './pages/AboutPage';
import WelcomePage from './pages/WelcomePage';
import OAuthSuccessPage from './pages/OAuthSuccessPage';
import DemoPage from './pages/DemoPage';
import AdminLayout from './pages/AdminLayout';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--surface-color)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/oauth-success" element={<OAuthSuccessPage />} />
              <Route
                path="/demo"
                element={
                  <ProtectedRoute>
                    <DemoPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contacts"
                element={
                  <ProtectedRoute>
                    <ContactsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <AboutPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes - Integrated with Sidebar */}
              <Route path="/admin/*" element={<AdminLayout />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
