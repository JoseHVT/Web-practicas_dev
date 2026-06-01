import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/pages/LoginPage';
import Dashboard from './features/users/pages/DashboardPage';
import UsersPage from './features/users/pages/UsersPage';
import UserDetailPage from './features/users/pages/UserDetailPage';
import APITester from './shared/pages/APITester';
import Navbar from './shared/components/Navbar';
import { CssBaseline } from '@mui/material';
import useAuth from './features/auth/hooks/useAuth';
import useAdmin from './features/auth/hooks/useAdmin';

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin } = useAdmin(user);

  return (
    <BrowserRouter>
      <CssBaseline />

      {isAuthenticated && <Navbar onLogout={logout} isAdmin={isAdmin} />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
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
          path="/usuarios/:id"
          element={
            isAuthenticated ? <UserDetailPage /> : <Navigate to="/" />
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
