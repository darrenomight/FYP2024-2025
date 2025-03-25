import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const taskDBSetup = async (userId) => {
    const exampleTasks = [
        {
            title: "Drink Water",
            type: "daily",
            isCompleted: false,
            lastCompleted: "",
            xpValue: 20,
            createdAt: serverTimestamp(),
            notes: "Daily hydration"
        },
        {
            title: "Read 10 pages",
            type: "normal",
            isCompleted: false,
            lastCompleted: "",
            xpValue: 50,
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
