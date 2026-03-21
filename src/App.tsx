import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MarketPage from './pages/MarketPage';
import StringingPage from './pages/StringingPage';
import CourtsPage from './pages/CourtsPage';
import TournamentsPage from './pages/TournamentsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/stringing" element={<StringingPage />} />
              <Route path="/courts" element={<CourtsPage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
