import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';

// Public pages
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { Exhibitions } from './pages/Exhibitions';
import { Nobel } from './pages/Nobel';
import { Glasfusing } from './pages/Glasfusing';
import { Textile } from './pages/Textile';
import { Education } from './pages/Education';
import { Contact } from './pages/Contact';

// Admin pages
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { GalleryManager } from './pages/admin/GalleryManager';
import { ExhibitionsManager } from './pages/admin/ExhibitionsManager';
import { EducationManager } from './pages/admin/EducationManager';
import { PagesManager } from './pages/admin/PagesManager';
import { AdminSettings } from './pages/admin/Settings';
import { ProtectedRoute } from './pages/admin/ProtectedRoute';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/galleri" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/utstallningar" element={<PublicLayout><Exhibitions /></PublicLayout>} />
          <Route path="/nobel" element={<PublicLayout><Nobel /></PublicLayout>} />
          <Route path="/glasfusing" element={<PublicLayout><Glasfusing /></PublicLayout>} />
          <Route path="/textilmaleri" element={<PublicLayout><Textile /></PublicLayout>} />
          <Route path="/utbildning" element={<PublicLayout><Education /></PublicLayout>} />
          <Route path="/kontakt" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/gallery" 
            element={
              <ProtectedRoute>
                <GalleryManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/exhibitions" 
            element={
              <ProtectedRoute>
                <ExhibitionsManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/education" 
            element={
              <ProtectedRoute>
                <EducationManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/pages" 
            element={
              <ProtectedRoute>
                <PagesManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
