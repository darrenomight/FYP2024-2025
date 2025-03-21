import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const UserMetrics = () => {
    const [username, setUsername] = useState("User"); // ✅ Added username state
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [lastLogin, setLastLogin] = useState(null);
    const [nextLoginTime, setNextLoginTime] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserStats = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                setUsername(userData.username || "User"); // ✅ Fetch username
                setCurrentStreak(userData.streak?.currentStreak || 0);
                setBestStreak(userData.streak?.bestStreak || 0);
                setLastLogin(new Date(userData.streak?.lastLogin || 0));
            }

            setNextLoginTime(getNextResetTime());
            setLoading(false);
        };

        fetchUserStats();
    }, []);

    // ✅ Get next reset time (1 AM)
    const getNextResetTime = () => {
        let now = new Date();
        let resetTime = new Date();
        resetTime.setHours(1, 0, 0, 0);
        if (now >= resetTime) {
            resetTime.setDate(resetTime.getDate() + 1);
        }
        return resetTime;
    };

    // ✅ Update streak when user logs in
    const updateLoginStreak = async () => {
        const user = auth.currentUser;
        if (!user) return;

        let now = new Date();
        let timeDiff = lastLogin ? (now - lastLogin) / (1000 * 60 * 60) : 0; // Hours since last login

        let newStreak = currentStreak;
        if (timeDiff < 25) {
            newStreak += 1;
        } else {
            newStreak = 1;
        }

        let newBestStreak = Math.max(newStreak, bestStreak);

        // ✅ Update Firestore with new streak data
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            "streak.currentStreak": newStreak,
            "streak.bestStreak": newBestStreak,
            "streak.lastLogin": now.toISOString()
        });

        // ✅ Update local state
        setCurrentStreak(newStreak);
        setBestStreak(newBestStreak);
        setLastLogin(now);
        setNextLoginTime(getNextResetTime());
    };

    return { username, currentStreak, bestStreak, nextLoginTime, updateLoginStreak, loading };
};

export default UserMetrics;
