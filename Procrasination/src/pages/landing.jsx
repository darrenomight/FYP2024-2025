import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div>
            <h1>Welcome to the Landing Page</h1>
            <p>main redireccts to login and basic info about app 
                box 2/4 grid 
            </p>
            <Link to="/main">Go to Main Page</Link>
        </div>
    );
};

export default Landing;
