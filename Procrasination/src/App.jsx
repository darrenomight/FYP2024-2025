import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Main from './pages/main';
import Profile from './pages/user_profile';
import Login from './pages/login';
import Header from './components/header';

function App() {
  
  return (
      <Router>
            <Header /> {/* This ensures the Header is visible on all pages */}
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/main" element={<Main />} />
                <Route path="/user_profile" element={<Profile />} />
                <Route path="/login" element={<Login />}/>
            </Routes>
        </Router>
  );
};

export default App
