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

// Fetch all user tasks
export const fetchUserTasks = async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const tasksRef = collection(db, "users", user.uid, "tasks");
    const snapshot = await getDocs(tasksRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add task with document ID as task title
export const addUserTask = async (title) => {
    const user = auth.currentUser;
    if (!user) return null;

    const idSafeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "_");

    const taskRef = doc(db, "users", user.uid, "tasks", idSafeTitle);
    await setDoc(taskRef, {
        title,
        completed: false,
        createdAt: serverTimestamp()
    });

    return { id: idSafeTitle, title, completed: false };
};

// Delete task
export const deleteUserTask = async (taskId) => {
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = doc(db, "users", user.uid, "tasks", taskId);
    await deleteDoc(taskRef);
};

// Mark task complete and archive
export const completeUserTask = async (task) => {
    const user = auth.currentUser;
    if (!user) return;

    const taskRef = doc(db, "users", user.uid, "tasks", task.id);
    const archiveRef = doc(db, "users", user.uid, "completedTasks", task.id);

    // Archive then delete
    await setDoc(archiveRef, {
        ...task,
        completedAt: serverTimestamp()
    });
    await deleteDoc(taskRef);
    // If for dailies 
};
