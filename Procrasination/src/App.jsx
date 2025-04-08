import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Main from './pages/main';
import Profile from './pages/user_profile';
import Login from './pages/login';
import NewTasks from './pages/newtasks'
import Header from './components/header';
import Footer from './components/footer';
import UsernameSetup from "./pages/username";
import Customization from './pages/customise';
import FriendsPage from './pages/friends';
import AchievementsPage from './pages/tracking_progress';


function App() {

  return (
      <Router>
        <Header /> 
            <div className="content"> 
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/main" element={<Main />} />
                <Route path="/user_profile" element={<Profile />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/newtasks" element={<NewTasks />}/>
                <Route path="/user_profile" element={<Profile />}/>
                <Route path="/username-setup" element={<UsernameSetup />} />
                <Route path="/customise" element={<Customization />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/tracking_progress" element={<AchievementsPage />} />
            </Routes>
            </div>
          <Footer /> 
      </Router>
       
  );
};

export default App
