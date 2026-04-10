import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Inventory from './pages/Inventory';
import Scanner from './pages/Scanner';
import Profile from './pages/Profile';
import AlertPage from './pages/Alert';
import { Shop, Settings } from './pages/Placeholders';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="page-content fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/alert" element={<AlertPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
