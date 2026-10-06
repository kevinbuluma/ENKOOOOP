import { lazy, Suspense, useEffect, useRef, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Footer, Navbar, WhatsAppFloat, BackToTop } from './components/common';
import { IntroOverlay } from './components/IntroOverlay';
import { PropertyProvider } from './context/PropertyContext';
import { ExperienceProvider } from './context/ExperienceContext';
import { LoadingState } from './components/Loader';

const HomePage = lazy(() => import('./pages/HomePage'));
const PropertiesPage = lazy(() => import('./pages/PropertyPages').then((module) => ({ default: module.PropertiesPage })));
const PropertyDetailPage = lazy(() => import('./pages/PropertyPages').then((module) => ({ default: module.PropertyDetailPage })));
const SavedPropertiesPage = lazy(() => import('./pages/PropertyPages').then((module) => ({ default: module.SavedPropertiesPage })));
const AboutPage = lazy(() => import('./pages/ContentPages').then((module) => ({ default: module.AboutPage })));
const ServicesPage = lazy(() => import('./pages/ContentPages').then((module) => ({ default: module.ServicesPage })));
const InsightsPage = lazy(() => import('./pages/ContentPages').then((module) => ({ default: module.InsightsPage })));
const InsightDetailPage = lazy(() => import('./pages/ContentPages').then((module) => ({ default: module.InsightDetailPage })));
const ContactPage = lazy(() => import('./pages/ContentPages').then((module) => ({ default: module.ContactPage })));
const NotFoundPage = lazy(() => import('./pages/ContentPages').then((module) => ({ default: module.NotFoundPage })));

function PageTopReset() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    window.scrollTo(0, 0);
    window.requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('#main-content h1');
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    });
  }, [pathname]);
  return null;
}

function RouteMotion({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return <div key={pathname} className="route-motion">{children}</div>;
}

function SiteShell() {
  return (
    <>
      <PageTopReset />
      <IntroOverlay />
      <Navbar />
      <main id="main-content">
        <RouteMotion>
          <Suspense fallback={<LoadingState />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/saved" element={<SavedPropertiesPage />} />
              <Route path="/properties/:slug" element={<PropertyDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/insights/:slug" element={<InsightDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </RouteMotion>
      </main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
    </>
  );
}

export default function App() {
  return <PropertyProvider><ExperienceProvider><SiteShell /></ExperienceProvider></PropertyProvider>;
}
