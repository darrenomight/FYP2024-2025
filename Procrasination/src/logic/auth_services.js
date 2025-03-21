import { auth, db } from "../firebaseConfig";
import { 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

/** 🔥 Handle Email Registration */
export const registerUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Create Firestore entry
    await setDoc(doc(db, "users", user.uid), {
        username: "", // Will be set in UsernameSetup.jsx
        email,
        profilePic: "",
        streak: { currentStreak: 0, bestStreak: 0, lastLogin: "" } // Optional: initialize streaks here
    });

    return user;
};

/** 🔥 Handle Email Login */
export const loginUser = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, requiresUsername: false }; // Will always redirect to username setup by default logic
};

/** 🔥 Handle Google Sign-In */
export const loginWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let requiresUsername = true;

    if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData.streak?.currentStreak >= 1) {
            requiresUsername = false;
        }
    } else {
        // ✅ Create Firestore entry for new users
        await setDoc(userRef, {
            username: "",
            email: user.email,
            profilePic: user.photoURL || "",
            streak: { currentStreak: 0, bestStreak: 0, lastLogin: "" }
        });
    }

    return { user, requiresUsername };
};
