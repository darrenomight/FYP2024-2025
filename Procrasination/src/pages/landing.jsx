import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../components/footer";

const Landing = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero text-center text-white d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh", background: "linear-gradient(to right, #6a11cb, #2575fc)" }}>
                <h1 className="display-3 fw-bold">Welcome to Momentum The Procrastination App</h1>
                <p className="lead">Turn your procrastination into productivity with gamification!</p>
                <Link to="/login" className="btn btn-light btn-lg mt-3">Get Started</Link>
            </section>

            {/* Features Section */}
            <section className="container my-5">
                <h2 className="text-center mb-4">Why Use This App?</h2>
                <div className="row text-center">
                    <div className="col-md-4">
                        <div className="card p-4">
                            <h4>📊 Track Progress</h4>
                            <p>Track your productivity levels with real-time stats.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card p-4">
                            <h4>🎯 Set Goals</h4>
                            <p>Stay on track by setting goals and challenges.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card p-4">
                            <h4>🏆 Earn Rewards</h4>
                            <p>Make productivity fun by unlocking achievements!</p>
                        </div>
                    </div>
                </div>
            </section>

            
        </div>
    );
};

export default Landing;
