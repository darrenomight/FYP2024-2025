import { db, auth } from "../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

/** Send a friend request to a user by email */
export const sendFriendRequest = async (targetEmail) => {
  const user = auth.currentUser;
  if (!user) return;

  const senderRef = doc(db, "users", user.uid);
  const senderSnap = await getDoc(senderRef);
  const senderData = senderSnap.data();

  // Find user by email
  const usersQuery = query(collection(db, "users"), where("email", "==", targetEmail));
  const results = await getDocs(usersQuery);

  if (results.empty) throw new Error("User not found");

  const recipientDoc = results.docs[0];
  const recipientId = recipientDoc.id;

  const requestRef = doc(db, "users", recipientId, "friendRequests", user.uid);
  await setDoc(requestRef, {
    from: user.uid,
    email: user.email,
    username: senderData.username || "User",
    profilePic: senderData.profilePic || "",
    timestamp: Date.now()
  });
};

/** Get all friend requests received */
export const getFriendRequests = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const requestSnap = await getDocs(collection(db, "users", user.uid, "friendRequests"));
  return requestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/** Accept a friend request */
export const acceptFriendRequest = async (requestId) => {
  const user = auth.currentUser;
  if (!user) return;

  // Add each other as friends
  const requesterRef = doc(db, "users", requestId);
  const requesterSnap = await getDoc(requesterRef);
  const requesterData = requesterSnap.data();

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const myFriendRef = doc(db, "users", user.uid, "friends", requestId);
  const theirFriendRef = doc(db, "users", requestId, "friends", user.uid);

  await setDoc(myFriendRef, {
    uid: requestId,
    username: requesterData.username || "User",
    profilePic: requesterData.profilePic || "",
    email: requesterData.email || "",
    addedAt: Date.now()
  });

  await setDoc(theirFriendRef, {
    uid: user.uid,
    username: userData.username || "User",
    profilePic: userData.profilePic || "",
    email: user.email || "",
    addedAt: Date.now()
  });

  // Remove the request
  const requestRef = doc(db, "users", user.uid, "friendRequests", requestId);
  await deleteDoc(requestRef);
};

/** Decline a friend request */
export const declineFriendRequest = async (requestId) => {
  const user = auth.currentUser;
  if (!user) return;

  const requestRef = doc(db, "users", user.uid, "friendRequests", requestId);
  await deleteDoc(requestRef);
};

/** Get friend list */
/** Listen to friend list changes in real-time */
export const listenToFriends = (callback) => {
  const user = auth.currentUser;
  if (!user) return () => {};

  const friendsRef = collection(db, "users", user.uid, "friends");

  const unsubscribe = onSnapshot(friendsRef, async (snapshot) => {
    const baseFriends = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Fetch live data from each friend's user document
    const enrichedFriends = await Promise.all(
      baseFriends.map(async (friend) => {
        const userDoc = await getDoc(doc(db, "users", friend.uid));
        const userData = userDoc.data() || {};
        return {
          ...friend,
          username: userData.username || "User",
          profilePic: userData.profilePic || "",
          email: userData.email || ""
        };
      })
    );

    callback(enrichedFriends);
  });

  return unsubscribe;
};


