import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/sidebar"; 
import DashboardCards from "../components/dashboard_cards"; 
import UserMetrics from "../components/user_metrics.jsx"; 

const Main = () => {
    const { darkMode } = UserMetrics(); 

    return (
        <div className={`d-flex flex-column vh-100 ${darkMode ? "bg-dark text-white" : "bg-light"}`}>
            <div className="container-fluid flex-grow-1">
                <div className="row">
                    <div className={`col-md-3 ${darkMode ? "bg-secondary" : "bg-light"} p-4`}>
                        <Sidebar />
                    </div>
                    <div className="col-md-9 p-4">
                        <DashboardCards />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
