
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import Events from './pages/footer-links/Events';
import Members from './pages/footer-links/Members';
import About from './pages/footer-links/About';
import Contact from './pages/footer-links/Contact';
import Feed from './pages/feed/Feed';
import Forum from './pages/forum/Forum';
import Communities from './pages/communitites/Communities';
import Marketplace from './pages/marketplace/MPHeader';
import Messages from './components/marketplace/Messages';
import Navbar from './components/Navbar';
import UserPage from './pages/userpage/UserPage';
import MemberProfile from './pages/footer-links/MemberProfile';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import './App.css';
import React, { useState, useEffect } from 'react';
import ForgotPassword from './pages/auth/ForgotPassword';

export const UserContext = React.createContext(null);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load userId from localStorage and fetch user data
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      fetch(`${import.meta.env.VITE_SERVER_URL}/api/user/profile?userId=${storedUserId}`)
        .then(res => res.json())
        .then(data => {
          setUser({ id: storedUserId, ...data });
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Navbar />
        <div className='mt-15'></div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/marketplace/*" element={<Marketplace />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/events" element={<Events />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:memberId" element={<MemberProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
