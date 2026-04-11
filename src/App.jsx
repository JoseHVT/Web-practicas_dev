import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import APITester from './views/APITester';
import Navbar from './components/Navbar';
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
          path="/test-api"
          element={<APITester />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;