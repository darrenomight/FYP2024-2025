import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import defaultProfilePic from "../assets/sampleUserPf.jpg";
import UserMetrics from "./user_metrics";
import { getGoalsCompletedCount } from "./task_metrics";

const Sidebar = () => {
    const { username, profilePic, currentStreak, bestStreak, xp, loading } = UserMetrics();
    const [goalsCompleted, setGoalsCompleted] = useState(0);

    useEffect(() => {
        const fetchCompleted = async () => {
            const count = await getGoalsCompletedCount();
            setGoalsCompleted(count);
        };

        fetchCompleted();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="text-center">
            {/* User Profile Image */}
            <div className="mb-3">
                <img
                    src={profilePic || defaultProfilePic}
                    alt="User Profile"
                    className="rounded-circle img-fluid"
                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                />
            </div>

            {/* Display Correct Username */}
            <h5 className="fw-bold">{username}</h5>
            <p>Productivity Enthusiast</p>

            {/* Quick Stats - Mini Version of Login Streak */}
            <div className="card p-3">
                <h5>Login Streak:</h5>
                <p><strong>Current Streak:</strong> {currentStreak} days</p>
                <p><strong>Best Streak:</strong> {bestStreak} days</p>
                <p><strong>XP Earned:</strong> {xp || 0} XP</p>
                <p><strong>Goals Completed:</strong> {goalsCompleted}</p>
            </div>
        </div>
    );
};

export default Sidebar;
