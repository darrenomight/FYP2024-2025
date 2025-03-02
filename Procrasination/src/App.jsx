import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Main from './pages/main';
import Profile from './pages/user_profile';
import Login from './pages/login';
import NewTasks from './pages/newtasks'
import Header from './components/header';
import Footer from './components/footer';


function App() {

  return (
      <Router>
        <Header /> {/* This ensures the Header is visible on all pages */}
            <div className="content"> {/* Wrapper to push footer down */}
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/main" element={<Main />} />
                <Route path="/user_profile" element={<Profile />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/newtasks" element={<NewTasks />}/>
                <Route path="/user_profile" element={<Profile />}/>
            </Routes>
            </div>
          <Footer /> {/* Footer stays at the bottom */ } 
      </Router>
       
  );
};

export default App
