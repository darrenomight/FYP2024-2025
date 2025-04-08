import { db, auth } from "../firebaseConfig";
import {
    collection,
    doc,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    setDoc,
    serverTimestamp
} from "firebase/firestore";
import { addXP } from "./xp_manager";



await addXP(50); // or any amount based on logic


// Fetch all user tasks
export const fetchUserTasks = async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const tasksRef = collection(db, "users", user.uid, "tasks");
    const snapshot = await getDocs(tasksRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add task with document ID as task title
export const addUserTask = async (title, isDaily = false) => {
    const user = auth.currentUser;
    if (!user) return null;

    const idSafeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "_");

    const taskRef = doc(db, "users", user.uid, "tasks", idSafeTitle);
    await setDoc(taskRef, {
        title,
        completed: false,
        type: isDaily ? "daily" : "basic",
        createdAt: serverTimestamp()
    });

    return { id: idSafeTitle, title, completed: false, type: isDaily ? "daily" : "basic" };
};


// Delete task
export const deleteUserTask = async (taskId) => {
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = doc(db, "users", user.uid, "tasks", taskId);
    await deleteDoc(taskRef);
};

export const completeUserTask = async (task) => {
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = doc(db, "users", user.uid, "tasks", task.id);
    const archiveId = `${task.id}_${Date.now()}`;
    const archiveRef = doc(db, "users", user.uid, "completedTasks", archiveId);
    const now = new Date().toISOString();

    if (task.type === "daily") {
        // Mark daily task as completed (don't delete)
        await updateDoc(taskRef, {
            completed: true,
            completedToday: true,
            completedAt: now
        });

        //  Award XP
        await addXP(30);
        

        await setDoc(archiveRef, {
            ...task,
            completedAt: now,
            type: "daily"
        });
    } else {
        // Archive and delete basic task
        await setDoc(archiveRef, {
            ...task,
            completedAt: now,
            type: "basic"
        });

        await deleteDoc(taskRef);

        // Award XP
        await addXP(20);
        
    }
};
