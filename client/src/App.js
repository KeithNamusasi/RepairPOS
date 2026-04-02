import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import Repairs from './pages/Repairs';
import Savings from './pages/Savings';
import Reports from './pages/Reports';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

const Layout = ({ children }) => (
  <div className="app">
    <Navbar />
    <div className="main-content">
      {children}
    </div>
  </div>
);

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><Layout><Products /></Layout></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><Layout><Sales /></Layout></ProtectedRoute>} />
      <Route path="/purchases" element={<ProtectedRoute><Layout><Purchases /></Layout></ProtectedRoute>} />
      <Route path="/repairs" element={<ProtectedRoute><Layout><Repairs /></Layout></ProtectedRoute>} />
      <Route path="/savings" element={<ProtectedRoute><Layout><Savings /></Layout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;