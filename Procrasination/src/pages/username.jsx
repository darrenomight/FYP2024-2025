import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import UserMetrics from "../components/user_metrics.jsx";

const UsernameSetup = () => {
    const { darkMode } = UserMetrics(); 
    const user = auth.currentUser;
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    if (!user) return <p>Loading...</p>;

    const handleUsernameSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim()) {
            setError("Username cannot be empty.");
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);

            //  Update Firestore
            await updateDoc(userRef, { username });

            // Update Firebase Auth Profile
            await updateProfile(user, { displayName: username });

            // Redirect to main dashboard
            navigate("/main");
        } catch (err) {
            setError("Error setting username. Try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="form-box">
                    <h2 className="text-center">Set Your Username</h2>
                    <p className="text-center">This will be your public name.</p>

                    {error && <p className="error-text">{error}</p>}

                    <form onSubmit={handleUsernameSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Save Username</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UsernameSetup;
