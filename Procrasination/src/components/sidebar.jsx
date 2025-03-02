import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import userProfile from "../assets/sampleUserPf.jpg"; 
import DailyLogin from "./daily_login"; // ✅ Import DailyLogin for Streaks only

const Sidebar = () => {
    return (
        <div className="text-center">
            {/* User Profile Image */}
            <div className="mb-3">
                <img 
                    src={userProfile}
                    alt="User Profile" 
                    className="rounded-circle img-fluid"
                />
            </div>

            {/* User Info */}
            <h5 className="fw-bold">John DonoWork</h5>
            <p>Productivity Enthusiast</p>

            <DailyLogin showButton={false} />

            {/* Additional Stats */}
            <p><strong>Goals Completed:</strong> 12</p>
        </div>
    );
};

export default Sidebar;
