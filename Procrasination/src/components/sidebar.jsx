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
                <p><strong>Level:</strong> {Math.floor(xp / 100)}</p>
                <p><strong>XP:</strong> {xp % 100} / 100</p>
                <div className="progress">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${xp % 100}%` }}
                        aria-valuenow={xp % 100}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        {xp % 100} XP
                    </div>
                </div>

                <p><strong>Goals Completed:</strong> {goalsCompleted}</p>
            </div>

            {/* Progress View */}
            <div className="col-md-12">
                <div className="card p-4 shadow-sm">
                    <h5>View Your Progress</h5>
                    <p>Track your achievements and milestones</p>
                    <button className="btn btn-secondary" > Progress</button>
                </div>
            </div>


            <div className="col-md-12">
                <div className="card p-4 shadow-sm">
                    <h5>Wanna see how your friends are doing ?</h5>
                    <p>Check out the daily leaderboards to see how you and your friends are staying productive !</p>
                    <button className="btn btn-secondary" >To Friends</button>
                </div>
            </div>
        </div> // End Div



    );
};

export default Sidebar;
