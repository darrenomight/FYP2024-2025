import { auth, db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export const resetDailyTasks = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const tasksRef = collection(db, "users", user.uid, "tasks");
  const snapshot = await getDocs(tasksRef);

  const updates = snapshot.docs
    .filter(doc => doc.data().type === "daily")
    .map(docSnap => updateDoc(doc(db, "users", user.uid, "tasks", docSnap.id), {
      completed: false,
      completedToday: false,
    }));

  await Promise.all(updates);
};
