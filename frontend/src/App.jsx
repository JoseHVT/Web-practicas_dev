import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/pages/LoginPage';
import Dashboard from './features/users/pages/DashboardPage';
import UsersPage from './features/users/pages/UsersPage';
import APITester from './shared/pages/APITester';
import Navbar from './shared/components/Navbar';
import { CssBaseline } from '@mui/material'; // estilos bas.

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <CssBaseline />

      {/* nav oculta por auth dinamico */}
      {isAuthenticated && <Navbar onLogout={() => setIsAuthenticated(false)} />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={() => setIsAuthenticated(true)} />
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
            isAuthenticated ? <UsersPage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/test-api"
          element={<APITester />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;