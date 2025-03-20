import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import useUserStats from "./user_metrics";

const DailyLogin = () => {
    const { currentStreak, bestStreak, nextLoginTime, updateLoginStreak, loading } = useUserStats();
    const [buttonColor, setButtonColor] = useState("btn-danger");
    const [isDisabled, setIsDisabled] = useState(false);

    // ✅ Prevent re-login if already logged in for the day
    useEffect(() => {
        let now = new Date();
        if (nextLoginTime && now < nextLoginTime) {
            setIsDisabled(true);
            setButtonColor("btn-success");
        }
    }, [nextLoginTime]);

    // ✅ Handle Login Button Click
    const handleLogin = async () => {
        if (isDisabled) return;

        setIsDisabled(true);
        setButtonColor("btn-success");

        await updateLoginStreak(); // 
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="card p-4 text-center">
            <h5>Login Streak:</h5>
            <p><strong>Current Streak:</strong> {currentStreak} days</p>
            <p><strong>Best Streak:</strong> {bestStreak} days</p>
            <p><strong>Next Login:</strong> {nextLoginTime ? nextLoginTime.toLocaleString() : "Loading..."}</p>

            {/* Login Button */}
            <button 
                className={`btn ${buttonColor} w-100`} 
                onClick={handleLogin} 
                disabled={isDisabled}
            >
                {isDisabled ? "Logged In ✅" : "Login Now"}
            </button>
        </div>
    );
};

export default DailyLogin;
