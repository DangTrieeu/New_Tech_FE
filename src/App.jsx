// Import pages
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import ContactsPage from './pages/ContactsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App
