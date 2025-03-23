import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import UserMetrics from "../components/user_metrics.jsx"; // ✅

const Customise = () => {
    const [darkModeLocal, setDarkModeLocal] = useState(false); // This handles the toggle UI only
    const [loading, setLoading] = useState(true);
    const { darkMode } = UserMetrics(); // ✅ From Firestore
    const user = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomisation = async () => {
            if (!user) return;
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                setDarkModeLocal(data.customization?.darkMode || false);
            }
            setLoading(false);
        };
        fetchCustomisation();
    }, [user]);

    const handleToggle = async () => {
        const newMode = !darkModeLocal;
        setDarkModeLocal(newMode);
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            "customization.darkMode": newMode
        });
    };

    if (loading) return <p>Loading customization...</p>;

    return (
        <div className={`container mt-5 ${darkMode ? "bg-dark text-white" : ""}`}>
            <h2>🎨 Customisation Settings</h2>
            <div className="form-check form-switch mt-4">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={darkModeLocal}
                    onChange={handleToggle}
                    id="darkModeSwitch"
                />
                <label className="form-check-label" htmlFor="darkModeSwitch">
                    Enable Dark Mode
                </label>
            </div>

            <button className="btn btn-secondary mt-4" onClick={() => navigate("/user_profile")}>
                Back to Profile
            </button>
        </div>
    );
};

export default Customise;
