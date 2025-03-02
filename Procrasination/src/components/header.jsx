import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

const Header = () => {
    return (
        <nav className="navbar navbar-dark bg-dark d-flex justify-content-center p-3">
            <h2 className="text-white me-3">Momentum</h2>
            <div className="btn-group">
                <Link to="/" className="btn btn-secondary">Landing</Link>
                <Link to="/main" className="btn btn-secondary">Main</Link>
                <Link to="/user_profile" className="btn btn-secondary">Profile</Link>
                <Link to="/login" className="btn btn-secondary">Login</Link>

            </div>
        </nav>
    );
};

export default Header;
