import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/pages/LoginPage';
import Dashboard from './features/users/pages/DashboardPage';
import UsersPage from './features/users/pages/UsersPage';
import APITester from './shared/pages/APITester';
import Navbar from './shared/components/Navbar';
import { CssBaseline } from '@mui/material';
import {
  clearAuthSession,
  loadAuthSession,
  subscribeToAuthSession
} from './shared/utils/authSession';

function App() {
  const [session, setSession] = useState(loadAuthSession);
  const isAuthenticated = Boolean(session?.token);
  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => subscribeToAuthSession(() => {
    setSession(loadAuthSession());
  }), []);

  const handleLogout = () => {
    clearAuthSession();
    setSession(null);
  };

  return (
    <BrowserRouter>
      <CssBaseline />

      {isAuthenticated && <Navbar onLogout={handleLogout} isAdmin={isAdmin} />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={setSession} />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/" />
          }
        />
        <Route
          path="/usuarios"
          element={
            isAuthenticated ? <UsersPage isAdmin={isAdmin} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/test-api"
          element={
            !isAuthenticated
              ? <Navigate to="/" />
              : isAdmin
                ? <APITester />
                : <Navigate to="/dashboard" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
