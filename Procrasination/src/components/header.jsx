import React from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

const Header = () => {
    const navigate = useNavigate();
    const user = auth.currentUser; 

    //  Logout Function
    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login"); 
    };

    return (
        <nav className="navbar navbar-dark bg-dark d-flex justify-content-center p-3">
            <h2 className="text-white me-3">Momentum</h2>
            <div className="btn-group">
                <Link to="/" className="btn btn-secondary">Landing</Link>
                <Link to="/main" className="btn btn-secondary">Main</Link>
                <Link to="/user_profile" className="btn btn-secondary">Profile</Link>
                <Link to="/login" className="btn btn-secondary">Login</Link>
                
                {/* Show Logout Button ONLY if user is logged in */}
                {user && (
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                )}
            </div>
        </nav>
    );
};

export default Header;
