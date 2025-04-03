import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../assets/sampleUserPf.jpg";
import UserMetrics from "../components/user_metrics.jsx";
import ProfilePicUploader from "../components/profile_pic_choser.jsx";



const Profile = () => { 
    const navigate = useNavigate();
    const user = auth.currentUser;
    const {
        profilePic,
        darkMode,
        username,
        loading
    } = UserMetrics();


    if (!user) return <p>Loading...</p>;

    // Handle Logout
    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    // Redirect to Username Setup Page
    const handleChangeUsername = () => {
        navigate("/username-setup");
    };

    return (
        <div className={`container mt-5 ${darkMode ? "bg-dark text-white" : ""}`}>
            <div className="row">
                <div className="col-md-4 text-center p-4">
                    <img
                        src={profilePic || defaultProfilePic}
                        alt="User Profile"
                        className="rounded-circle img-fluid"
                        style={{ width: "200px", height: "200px", objectFit: "cover" }}
                    />
                    <h3>{user.displayName || "User"}</h3>
                    <p className="text-muted">{user.email}</p>
                    <p>Joined: March 10, 2025</p>
                </div>

                <div className="col-md-8">
                    <h2>Profile Overview</h2>

                    <div className="card p-3 mb-4">
                        <h5>Basics Settings</h5>
                        <ProfilePicUploader currentPic={profilePic || defaultProfilePic} />
                    </div>

                    <div className="card p-3 mb-4">
                        <h5>Account Settings</h5>
                        <button className="btn btn-primary w-100 mb-2" onClick={handleChangeUsername}>
                            Set New Username
                        </button>
                        <button className="btn btn-warning w-100 mb-2">Change Password</button>
                        <button className="btn btn-danger w-100 mb-2" onClick={handleLogout}>Log Out</button>
                    </div>

                    <div className="card p-3 mb-4">
                        <h5>Customisation</h5>
                        <button className="btn btn-secondary w-100" onClick={() => navigate("/customise")}>
                            Open Customization Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
