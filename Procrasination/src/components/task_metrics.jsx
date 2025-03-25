import { auth, db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const getGoalsCompletedCount = async () => {
    const user = auth.currentUser;
    if (!user) return 0;

    const completedRef = collection(db, "users", user.uid, "completedTasks");
    const snapshot = await getDocs(completedRef);
    return snapshot.size;
};
