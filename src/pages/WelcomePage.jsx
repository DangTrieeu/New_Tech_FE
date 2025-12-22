import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button/Button';
import logo from '@/assets/logo.png';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--background-color)' }}>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/20 via-indigo-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
          {/* Logo with Glow Effect */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <img
              src={logo}
              alt="Studio478 Logo"
              className="relative mx-auto w-32 h-32 object-contain drop-shadow-2xl transform hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Title with Gradient */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Welcome to Studio478
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
            Connect with friends and family.
          </p>
          <p className="text-lg mb-12 max-w-2xl mx-auto opacity-80" style={{ color: 'var(--text-secondary)' }}>
            Explore the modern digital space where you can connect with the community,
            develop skills, and achieve your goals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={() => navigate('/login')}
              variant="primary"
              size="large"
              className="group relative overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            <Button
              onClick={() => navigate('/register')}
              variant="secondary"
              size="large"
              className="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl backdrop-blur-sm"
            >
              Register Now
            </Button>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-16 text-center">
          <p className="text-sm opacity-60" style={{ color: 'var(--text-secondary)' }}>
            © 2024 Studio478. All rights reserved.
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;

