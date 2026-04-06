import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProfileListingsProvider } from './context/ProfileListingsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MarketPage from './pages/MarketPage';
import MarketListingDetailPage from './pages/MarketListingDetailPage';
import StringingPage from './pages/StringingPage';
import CourtsPage from './pages/CourtsPage';
import TournamentsPage from './pages/TournamentsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProfileListingDetailPage from './pages/ProfileListingDetailPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function AppShell() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isStringing = pathname === '/stringing';
  const isAuthFullPage = pathname === '/register' || pathname === '/login';
  const shellBgClass = isAuthFullPage
    ? 'bg-dark'
    : isStringing
      ? 'bg-[#e8e8e8]'
      : isHome
        ? 'bg-gray-50'
        : 'bg-dark';
  const mainToneClass =
    isAuthFullPage ? '' : isHome || isStringing ? 'text-gray-900' : 'text-gray-200';

  return (
    <div className={`min-h-screen flex flex-col ${shellBgClass}`}>
      <ScrollToTop />
      {!isAuthFullPage && <Navbar />}
      <main className={`flex-1 ${isAuthFullPage ? 'min-h-screen' : 'pt-[72px]'} ${mainToneClass}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/market/listing/:id" element={<MarketListingDetailPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/stringing" element={<StringingPage />} />
          <Route path="/courts" element={<CourtsPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/listing/:id" element={<ProfileListingDetailPage />} />
        </Routes>
      </main>
      {!isAuthFullPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileListingsProvider>
          <CartProvider>
            <AppShell />
          </CartProvider>
        </ProfileListingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
