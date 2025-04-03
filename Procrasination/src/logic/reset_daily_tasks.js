import { db, auth } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export const resetDailyTasks = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const now = new Date();
    const today = now.toDateString();

    const tasksRef = collection(db, "users", user.uid, "tasks");
    const snapshot = await getDocs(tasksRef);

    for (let taskDoc of snapshot.docs) {
        const task = taskDoc.data();

        if (task.daily && task.completed && task.lastCompleted) {
            const lastDate = new Date(task.lastCompleted).toDateString();

            if (lastDate !== today) {
                await updateDoc(doc(db, "users", user.uid, "tasks", taskDoc.id), {
                    completed: false
                });
            }
        }
    }
};
