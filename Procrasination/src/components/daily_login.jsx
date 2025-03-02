import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DailyLogin = ({ showButton = true }) => {
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestLogin, setBestLogin] = useState(0);
    const [lastLogin, setLastLogin] = useState(null);
    const [nextLoginTime, setNextLoginTime] = useState(null);
    const [buttonColor, setButtonColor] = useState("btn-danger");

    // Function to calculate next reset time (1 AM)
    const getNextResetTime = () => {
        let now = new Date();
        let resetTime = new Date();
        resetTime.setHours(1, 0, 0, 0);
        if (now >= resetTime) {
            resetTime.setDate(resetTime.getDate() + 1);
        }
        return resetTime;
    };

    // Handle login button click
    const handleLogin = () => {
        let now = new Date();
        if (!lastLogin) {
            setCurrentStreak(1);
            setLastLogin(now);
            setNextLoginTime(getNextResetTime());
        } else {
            let timeDiff = (now - lastLogin) / (1000 * 60 * 60);
            if (timeDiff < 25) {
                setCurrentStreak(currentStreak + 1);
            } else {
                setCurrentStreak(1);
            }
            if (currentStreak + 1 > bestLogin) {
                setBestLogin(currentStreak + 1);
            }
            setLastLogin(now);
            setNextLoginTime(getNextResetTime());
        }
        setButtonColor("btn-success");
    };

    // Reset button color at next login time
    useEffect(() => {
        const interval = setInterval(() => {
            let now = new Date();
            if (nextLoginTime && now >= nextLoginTime) {
                setButtonColor("btn-danger");
                setNextLoginTime(getNextResetTime());
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [nextLoginTime]);

    // 🔹 If `showButton` is false, return only streak data
    if (!showButton) {
        return (
            <div className="text-center">
                <p><strong>Current Streak:</strong> {currentStreak} days</p>
                <p><strong>Best Streak:</strong> {bestLogin} days</p>
            </div>
        );
    }

    return (
        <div className="card p-4 text-center">
            <h5>Login Streak:</h5>
            <p><strong>Current Streak:</strong> {currentStreak} days</p>
            <p><strong>Best Streak:</strong> {bestLogin} days</p>
            <p><strong>Next Login:</strong> {nextLoginTime ? nextLoginTime.toLocaleString() : "Loading..."}</p>

            {/* ✅ Only show button if `showButton` is true */}
            <button className={`btn ${buttonColor} w-100`} onClick={handleLogin}>
                {buttonColor === "btn-danger" ? "Login Now" : "Logged In ✅"}
            </button>
        </div>
    );
};

export default DailyLogin;
