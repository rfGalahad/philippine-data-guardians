import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, Outlet } from 'react-router-dom';

import LandingPage from '@/features/landing/pages/LandingPage';
import RegistrationPage from '@/features/registration/pages/RegistrationPage';
import LoginPage from "@/features/auth/pages/LoginPage";

import PrivacyImpactAssessmentPage from "@/features/services/PrivacyImpactAssessment/pages/PrivacyImpactAssessmentPage";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import PDGMembersPage from "@/features/pdgMembers/pages/PDGMembers";
import SubscribersPage from "@/features/subscribers/pages/SubscribersPage";

import PaymentSuccessPage from "@/components/PaymentSuccessPage";
import EmptyPage from "@/components/EmptyPage";
import LoadingPage from "@/components/LoadingPage";

import AdminLayout from "@/layout/AdminLayout";

import { ToastProvider } from "@/components/Toast";
import { AuthProvider } from "@/features/auth/provider/AuthProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";




const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingPage />;
  return isAuthenticated 
    ? <Outlet /> 
    : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* <Route path="*" element={EmptyPage}/> */}
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/registration" element={<RegistrationPage/>}/>
            <Route path="/success/membership" element={<PaymentSuccessPage/>}/>
            <Route path="/admin/login" element={<LoginPage/>}/>

            <Route path="/services">
              <Route path="privacy-impact-assessment" element={<PrivacyImpactAssessmentPage/>}/>
              <Route path='privacy-training' element={<EmptyPage />} />
              <Route path='compliance-consulting' element={<EmptyPage />} />
              <Route path='policy-development' element={<EmptyPage />} />            
              <Route path='data-breach-response' element={<EmptyPage />} />
              <Route path='audit-risk-assessment' element={<EmptyPage />} />
              <Route path='research-advocacy' element={<EmptyPage />} />
              <Route path='technology-solutions' element={<EmptyPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="admin" element={<AdminLayout />} >
                  <Route path='dashboard' element={<DashboardPage />} />
                  <Route path='pdg-members' element={<PDGMembersPage />} />
                  <Route path='subscribers' element={<SubscribersPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
