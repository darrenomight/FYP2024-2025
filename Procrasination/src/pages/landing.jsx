import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div>
            <h1>Welcome to the Landing Page</h1>
            <Link to="/main">Go to Main Page</Link>
        </div>
    );
};

export default Landing;
