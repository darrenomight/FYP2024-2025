import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import userProfile from "../assets/sampleUserPf.jpg"; 
import useUserMetrics from "./user_metrics"; // ✅ Corrected hook import

const Sidebar = () => {
    
    const { username, currentStreak, bestStreak, xp, loading } = useUserMetrics();

    if (loading) return <p>Loading...</p>;

    return (
        <div className="text-center">
            {/* User Profile Image */}
            <div className="mb-3">
                <img 
                    src={userProfile}
                    alt="User Profile" 
                    className="rounded-circle img-fluid"
                    style={{ width: "150px", height: "150px" }} 
                />
            </div>

            {/* ✅ Display Correct Username */}
            <h5 className="fw-bold">{username}</h5>
            <p>Productivity Enthusiast</p>
            
            {/* Quick Stats - Mini Version of Login Streak */}
            <div className="card p-3">
                <h5>Login Streak:</h5>
                <p><strong>Current Streak:</strong> {currentStreak} days</p>
                <p><strong>Best Streak:</strong> {bestStreak} days</p>
                <p><strong>XP Earned:</strong> {xp || 0} XP</p> {/* ✅ Default to 0 if XP is missing */}
                <p><strong>Goals Completed:</strong> 12</p>
            </div>
        </div>
    );
};

export default Sidebar;
