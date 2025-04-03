import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

/** Add XP to user's account */
export const addXP = async (amount) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const currentXP = userSnap.exists() ? (userSnap.data().xp || 0) : 0;

    await updateDoc(userRef, {
        xp: currentXP + amount
    });
};

export const getXP = async () => {
    const user = auth.currentUser;
    if (!user) return 0;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    return userSnap.exists() ? (userSnap.data().xp || 0) : 0;
};
