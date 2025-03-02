import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import DailyLogin from "./daily_login"; 

const DashboardCards = () => {
    return (
        <div className="container">
            <div className="row g-4">
                
                <div className="col-md-12">
                    <DailyLogin />
                </div>

                {/* Dashboard Sections */}
                <div className="col-md-6">
                    <div className="card p-4 shadow-sm">
                        <h5>Your Daily Tasks</h5>
                        <p>Stay on top of your productivity</p>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-4 shadow-sm">
                        <h5>New Tasks?</h5>
                        <p>Need to Add new items to your task list?</p>
                        <div className="mt-1">
                            <Link to="/NewTasks" className="btn btn-secondary">Let's add!</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="card p-4 shadow-sm">
                        <h5>View Your Progress</h5>
                        <p>Track your achievements and milestones</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCards;
