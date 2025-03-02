import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import userProfile from "../assets/sampleUserPf.jpg"; 

const Profile = () => {
    return (
        <div className="d-flex flex-column vh-100">
            
            <div className="container mt-5">
                <div className="row">
                    {/* Sidebar - User Info */}
                    <div className="col-md-4 text-center p-4">
                        <img 
                            src={userProfile}
                            alt="User Profile" 
                            className="rounded-circle img-fluid mb-3"
                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        />
                        <h3>John DonoWork</h3>
                        <p className="text-muted">johndoe@example.com</p>
                        <p>Joined: January 10, 2024</p>
                    </div>

                    {/* Main Profile Content */}
                    <div className="col-md-8">
                        <h2>Profile Overview</h2>

                        {/* User Progress Overview */}
                        <div className="card p-3 mb-4">
                            <h5>Progress Stats</h5>
                            <ul className="list-group">
                                <li className="list-group-item">✅ Completed Tasks: 25</li>
                                <li className="list-group-item">🔥 Streak: 7 Days</li>
                                <li className="list-group-item">🎯 Goals Achieved: 5</li>
                            </ul>
                        </div>

                        {/* Account Settings */}
                        <div className="card p-3 mb-4">
                            <h5>Account Settings</h5>
                            <button className="btn btn-warning w-100 mb-2">Change Password</button>
                            <button className="btn btn-danger w-100">Log Out</button>
                        </div>

                        {/* Future Customization Placeholder */}
                        <div className="card p-3 text-center">
                            <h5>🎨 Customization (Coming Soon)</h5>
                            <p>Personalize your experience by changing themes and settings.</p>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
};

export default Profile;
