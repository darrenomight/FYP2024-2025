import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import defaultProfilePic from "../assets/sampleUserPf.jpg";
import UserMetrics from "./user_metrics";
import { useNavigate } from "react-router-dom";
import { onSnapshot, collection } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const Sidebar = () => {
    const { username, profilePic, currentStreak, bestStreak, xp, loading } = UserMetrics();
    const [completedCount, setCompletedCount] = useState(0);
    const navigate = useNavigate();
    
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;
      
        const completedRef = collection(db, "users", user.uid, "completedTasks");
      
        const unsubscribe = onSnapshot(completedRef, (snapshot) => {
          setCompletedCount(snapshot.size);
        });
      
        return () => unsubscribe(); // cleanup on unmount
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
                <h5>Fast stats about you</h5>
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
                
                <p><strong>Goals Completed:</strong> {completedCount}</p>
            </div>

            {/* Progress View */}
            <div className="col-md-12">
                <div className="card p-4 shadow-sm">
                    <h5>View Your Progress</h5>
                    <p>Track your achievements and milestones</p>
                    <button className="btn btn-secondary" onClick={() => navigate("/tracking_progress")}>
                        View my Progress
                    </button>
                </div>
            </div>


            <div className="col-md-12">
                <div className="card p-4 shadow-sm">
                    <h5>Check in on your crew and family</h5>
                    <p>See who’s quietly crushing it today.</p>
                    <button className="btn btn-secondary" onClick={() => navigate("/friends")}>
                        To friends!
                    </button>
                </div>
            </div>
        </div> // End Div



    );
};

export default Sidebar;
