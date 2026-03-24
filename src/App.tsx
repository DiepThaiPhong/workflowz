import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AssessmentPage from './pages/AssessmentPage';
import DashboardPage from './pages/DashboardPage';
import LearningPathsPage from './pages/LearningPathsPage';
import ChatTutorPage from './pages/ChatTutorPage';
import CommunityPage from './pages/CommunityPage';
import ImpactTrackerPage from './pages/ImpactTrackerPage';
import GrowthPlanPage from './pages/GrowthPlanPage';
// WorkFlowz pages
import BuilderPage from './pages/BuilderPage';
import MarketplacePage from './pages/MarketplacePage';
import WorkflowDetailPage from './pages/WorkflowDetailPage';
import CreatorDashboardPage from './pages/CreatorDashboardPage';
import CertificatePage from './pages/CertificatePage';
import ProfilePage from './pages/ProfilePage';
import CreatorStudioPage from './pages/CreatorStudioPage';
import CourseLandingPage from './pages/CourseLandingPage';
import AboutPage from './pages/AboutPage';
import AffiliatePage from './pages/AffiliatePage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import useDarkMode from './hooks/useDarkMode';
import { useTranslation } from 'react-i18next';

function AppInner() {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const location = useLocation();
  const { t } = useTranslation();

  // Creator Studio + builder have no footer
  const noFooterPaths = ['/ai-mentor', '/studio', '/creator-studio'];
  const showFooter = !noFooterPaths.some((p) => location.pathname.startsWith(p));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Core */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/danh-gia" element={<AssessmentPage />} />
            <Route path="/ai-mentor" element={<ChatTutorPage />} />
            <Route path="/cong-dong" element={<CommunityPage />} />
            <Route path="/tac-dong" element={<ImpactTrackerPage />} />
            <Route path="/ke-hoach" element={<GrowthPlanPage />} />
            <Route path="/lo-trinh" element={<LearningPathsPage />} />

            {/* WorkFlowz routes */}
            <Route path="/studio" element={<BuilderPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/course/:id" element={<CourseLandingPage />} />
            <Route path="/workflow/:id" element={<WorkflowDetailPage />} />
            <Route path="/creator" element={<CreatorDashboardPage />} />
            <Route path="/certificate" element={<CertificatePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/creator-studio" element={<CreatorStudioPage />} />

            {/* New pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/affiliate" element={<AffiliatePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/payment" element={<PaymentPage />} />

            {/* 404 */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4 pt-20">
                <span className="text-6xl">🔍</span>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('nav.home') === 'Home' ? 'Page not found' : 'Trang không tồn tại'}
                </h1>
                <a href="/" className="btn-primary">← {t('nav.home')}</a>
              </div>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AppProvider>
  );
}

export default App;
