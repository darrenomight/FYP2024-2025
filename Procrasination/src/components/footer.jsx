import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Footer = () => {
    return (
        <footer className="footer bg-dark text-white text-center py-3 mt-4">
            <p className="mb-0">&copy; {new Date().getFullYear()} Procrastination App. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
