import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; 
import { db, auth } from "../firebaseConfig"; 
import { onAuthStateChanged } from "firebase/auth";
import useUserStats from "./user_metrics";

const DailyLogin = () => {
    const [userId, setUserId] = useState(null);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestLogin, setBestLogin] = useState(0);
    const [lastLogin, setLastLogin] = useState(null);
    const [nextLoginTime, setNextLoginTime] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(false); // ✅ Prevent multiple clicks
    const [buttonColor, setButtonColor] = useState("btn-danger");

    // ✅ Track logged-in user changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });
        return () => unsubscribe(); 
    }, []);

    // ✅ Function to calculate next reset time (1 AM)
    const getNextResetTime = () => {
        let now = new Date();
        let resetTime = new Date();
        resetTime.setHours(1, 0, 0, 0);
        if (now >= resetTime) {
            resetTime.setDate(resetTime.getDate() + 1);
        }
        return resetTime;
    };

    // ✅ Load Streak Data for Logged-In User
    const loadStreakData = async () => {
        if (!userId) return;

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            setCurrentStreak(userData.streak?.currentStreak || 0);
            setBestLogin(userData.streak?.bestStreak || 0);
            const lastLoginDate = new Date(userData.streak?.lastLogin || 0);
            setLastLogin(lastLoginDate);

            // ✅ Prevent button press if already logged in today
            let now = new Date();
            if (now.toDateString() === lastLoginDate.toDateString()) {
                setButtonDisabled(true);
                setButtonColor("btn-success");
            } else {
                setButtonDisabled(false);
                setButtonColor("btn-danger");
            }
        } else {
            // If no streak data exists, initialize for this user
            await setDoc(userRef, {
                streak: {
                    currentStreak: 0,
                    bestStreak: 0,
                    lastLogin: new Date().toISOString()
                }
            });
        }

        setNextLoginTime(getNextResetTime());
    };

    useEffect(() => {
        if (userId) {
            loadStreakData();
        }
    }, [userId]); // ✅ Re-run whenever user changes

    // ✅ Handle Login Button Click
    const handleLogin = async () => {
        if (!userId || buttonDisabled) return; // Prevent multiple presses

        let now = new Date();
        let timeDiff = lastLogin ? (now - lastLogin) / (1000 * 60 * 60) : 0; // Hours since last login

        let newStreak = currentStreak;
        if (timeDiff < 25) {
            newStreak += 1;
        } else {
            newStreak = 1;
        }

        let newBestStreak = Math.max(newStreak, bestLogin);

        // ✅ Update Firestore with new streak data
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            "streak.currentStreak": newStreak,
            "streak.bestStreak": newBestStreak,
            "streak.lastLogin": now.toISOString()
        });

        // ✅ Update UI state
        setCurrentStreak(newStreak);
        setBestLogin(newBestStreak);
        setLastLogin(now);
        setNextLoginTime(getNextResetTime());
        setButtonColor("btn-success");
        setButtonDisabled(true); // ✅ Disable button after logging in
    };

    return (
        <div className="card p-4 text-center">
            <h5>Login Streak:</h5>
            <p><strong>Current Streak:</strong> {currentStreak} days</p>
            <p><strong>Best Streak:</strong> {bestLogin} days</p>
            <p><strong>Next Login:</strong> {nextLoginTime ? nextLoginTime.toLocaleString() : "Loading..."}</p>

            {/* Login Button - Disabled if already logged in */}
            <button 
                className={`btn ${buttonColor} w-100`} 
                onClick={handleLogin} 
                disabled={buttonDisabled}
            >
                {buttonDisabled ? "Logged In ✅" : "Login Now"}
            </button>
        </div>
    );
};

export default DailyLogin;