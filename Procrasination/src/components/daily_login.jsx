import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import UserMetrics from "./user_metrics";
import { addXP } from "../logic/xp_manager";
import XPToast from "./xp_toast";

const DailyLogin = () => {
    const [userId, setUserId] = useState(null);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestLogin, setBestLogin] = useState(0);
    const [lastLogin, setLastLogin] = useState(null);
    const [nextLoginTime, setNextLoginTime] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [buttonColor, setButtonColor] = useState("btn-danger");
    const [timeLeft, setTimeLeft] = useState("");
    const [toastOpen, setToastOpen] = useState(false);
    const [toastXP, setToastXP] = useState(0);


    // Track login status and user ID
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

    // Calculate next reset time (1 AM)
    const getNextResetTime = () => {
        const now = new Date();
        const resetTime = new Date();
        resetTime.setHours(1, 0, 0, 0);
        if (now >= resetTime) {
            resetTime.setDate(resetTime.getDate() + 1);
        }
        return resetTime;
    };

    // Load streak data from Firestore
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

            const now = new Date();
            if (now.toDateString() === lastLoginDate.toDateString()) {
                setButtonDisabled(true);
                setButtonColor("btn-success");
            } else {
                setButtonDisabled(false);
                setButtonColor("btn-danger");
            }
        } else {
            await setDoc(userRef, {
                streak: {
                    currentStreak: 0,
                    bestStreak: 0,
                    lastLogin: new Date().toISOString(),
                }
            });
        }

        setNextLoginTime(getNextResetTime());
    };

    // Reload streak data when user changes
    useEffect(() => {
        if (userId) loadStreakData();
    }, [userId]);

    // Handle Login Click
    const handleLogin = async () => {
        if (!userId || buttonDisabled) return;

        const now = new Date();
        const timeDiff = lastLogin ? (now - lastLogin) / (1000 * 60 * 60) : 0;

        const newStreak = timeDiff < 25 ? currentStreak + 1 : 1;
        const newBestStreak = Math.max(newStreak, bestLogin);

        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            "streak.currentStreak": newStreak,
            "streak.bestStreak": newBestStreak,
            "streak.lastLogin": now.toISOString(),
        });

        setCurrentStreak(newStreak);
        setBestLogin(newBestStreak);
        setLastLogin(now);
        setNextLoginTime(getNextResetTime());
        setButtonColor("btn-success");
        setButtonDisabled(true);

        // xp
        await addXP(50);
        setToastXP(50);              
        setToastOpen(true);          
    };

    // Auto-unlock button after 1 AM
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            if (lastLogin && nextLoginTime && now >= nextLoginTime) {
                setButtonDisabled(false);
                setButtonColor("btn-danger");
                setNextLoginTime(getNextResetTime());
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [lastLogin, nextLoginTime]);

    //  Countdown Timer
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            if (!nextLoginTime) return;

            const diff = nextLoginTime - now;
            if (diff <= 0) {
                setTimeLeft("Available now!");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        };

        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [nextLoginTime]);

    return (
        <div className="card p-4 text-center">
            <h5><strong> Building Your login Streaks</strong></h5>
            <p><strong>You've checked in for:</strong> {currentStreak} days</p>
            <p><strong>Your best so far? Also</strong> {bestLogin} days</p>
            <p><strong>Next Login day:</strong> {nextLoginTime ? nextLoginTime.toLocaleString() : "Loading..."}</p>
            <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                ⏱ Time until next login: <strong>{timeLeft}</strong>
            </p>
            <button
                className={`btn ${buttonColor} w-100`}
                onClick={handleLogin}
                disabled={buttonDisabled}
            >
                {buttonDisabled ? "Logged In ✅" : "Login Now"}
            </button>
            <XPToast open={toastOpen} xpAmount={toastXP} onClose={() => setToastOpen(false)} />
        </div>
        
    );
};

export default DailyLogin;
