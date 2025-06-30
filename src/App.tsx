import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import OverviewMainPage from './pages/OverviewMainPage';
import OverviewPage from './pages/OverviewPage';
import AccountPage from './pages/AccountPage';
import ConstructionPage from './pages/ConstructionPage';
import ChecklistCapturaPage from './pages/ChecklistCapturaPage';
import SelectAccountPage from './pages/SelectAccountPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import ActiveAccountsPage from './pages/ActiveAccountsPage';
import InactiveAccountsPage from './pages/InactiveAccountsPage';
import ExpedienteElectronicoPage from './pages/ExpedienteElectronicoPage';
import PresentacionInicialPage from './pages/PresentacionInicialPage';
import WorkHubPage from './pages/WorkHubPage';
import './styles/global.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={{
          enter: 1500,
          exit: 1500
        }}
        classNames={{
          enter: 'page-enter',
          enterActive: 'page-enter-active',
          exit: 'page-exit',
          exitActive: 'page-exit-active'
        }}
        mountOnEnter
        unmountOnExit
      >
        <Routes location={location}>
          <Route path="/" element={<Header />} /> 
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MenuPage />
            </ProtectedRoute>
          } />
          <Route path="/overview-main" element={
            <ProtectedRoute>
              <OverviewMainPage />
            </ProtectedRoute>
          } />
          <Route path="/overview" element={
            <ProtectedRoute requiredPermissions={['create_accounts', 'edit_accounts']}>
              <OverviewPage />
            </ProtectedRoute>
          } />
          <Route path="/select-account" element={
            <ProtectedRoute>
              <SelectAccountPage />
            </ProtectedRoute>
          } />
          <Route path="/client-dashboard" element={
            <ProtectedRoute>
              <ClientDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/active-accounts" element={
            <ProtectedRoute>
              <ActiveAccountsPage />
            </ProtectedRoute>
          } />
          <Route path="/inactive-accounts" element={
            <ProtectedRoute>
              <InactiveAccountsPage />
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          } />
          <Route path="/construction" element={
            <ProtectedRoute>
              <ConstructionPage />
            </ProtectedRoute>
          } />
          <Route path="/expediente-electronico" element={
            <ProtectedRoute>
              <ExpedienteElectronicoPage />
            </ProtectedRoute>
          } />
          <Route path="/presentacion-inicial" element={
            <ProtectedRoute>
              <PresentacionInicialPage />
            </ProtectedRoute>
          } />
          <Route path="/checklist-captura" element={
            <ProtectedRoute>
              <ChecklistCapturaPage />
            </ProtectedRoute>
          } />
          <Route path="/workhub" element={
            <ProtectedRoute>
              <WorkHubPage />
            </ProtectedRoute>
          } />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;