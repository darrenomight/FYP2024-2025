import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export const taskDBSetup = async (userId) => {
    //  Set up user profile with XP and streaks
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            username: "New User",
            xp: 10,                      
            streak: {
                currentStreak: 0,
                bestStreak: 0,
                lastLogin: null
            },
            customization: {
                darkMode: false
            },
            profilePic: ""
        });
    }

    const exampleTasks = [
        {
            title: "Drink Water",
            type: "daily",
            completed: false,
            completedToday: false,
            createdAt: serverTimestamp(),
            notes: "Daily hydration"
        },
        {
            title: "Read 10 pages",
            type: "basic",
            completed: false,
            createdAt: serverTimestamp(),
            notes: "Start with something small"
        }
    ];

    for (const task of exampleTasks) {
        const id = task.title.replace(/\s+/g, "_").toLowerCase();
        const taskRef = doc(db, "users", userId, "tasks", id);
        await setDoc(taskRef, task);
    }
};
