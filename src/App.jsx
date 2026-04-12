import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Inventory from './pages/Inventory';
import Scanner from './pages/Scanner';
import Profile from './pages/Profile';
import AlertPage from './pages/Alert';
import Settings from './pages/Settings';
import ShopPage from './pages/Shop';

function App() {
  return (
    <Router>
      <div className="app-container">

        {/* Navbar hidden on login/register */}
        {window.location.pathname !== '/login' &&
         window.location.pathname !== '/register' && <Navbar />}

        <div className="page-content fade-in">

          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🔒 PROTECTED ROUTES */}

            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/scanner"
              element={
                <ProtectedRoute>
                  <Scanner />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/shop"
              element={
                <ProtectedRoute>
                  <ShopPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/alert"
              element={
                <ProtectedRoute>
                  <AlertPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

          </Routes>

        </div>
      </div>
    </Router>
  );
}

export default App;