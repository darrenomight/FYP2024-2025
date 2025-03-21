import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;

    if (!user) return <p>Loading...</p>;

    // ✅ Handle Logout
    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    // ✅ Redirect to Username Setup Page
    const handleChangeUsername = () => {
        navigate("/username-setup");
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Sidebar - User Info */}
                <div className="col-md-4 text-center p-4">
                    <h3>{user.displayName || "User"}</h3>
                    <p className="text-muted">{user.email}</p>
                    <p>Joined: January 10, 2024</p>
                </div>

                {/* Main Profile Content */}
                <div className="col-md-8">
                    <h2>Profile Overview</h2>

                    {/* Change Username Section */}
                    <div className="card p-3 mb-4">
                        <h5>Change Username</h5>
                        <button className="btn btn-primary w-100" onClick={handleChangeUsername}>
                            Set New Username
                        </button>
                    </div>

                    {/* Account Settings */}
                    <div className="card p-3 mb-4">
                        <h5>Account Settings</h5>
                        <button className="btn btn-warning w-100 mb-2">Change Password</button>
                        <button className="btn btn-danger w-100" onClick={handleLogout}>Log Out</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
