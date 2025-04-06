// leaderboard_handler.js
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, onSnapshot } from "firebase/firestore";

// Helper to fetch all friends + self
const fetchUserAndFriends = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const selfData = { id: user.uid, ...userSnap.data() };

  const friendsRef = collection(db, "users", user.uid, "friends");
  const friendDocs = await getDocs(friendsRef);

  const friendData = await Promise.all(
    friendDocs.docs.map(async (docSnap) => {
      const friendRef = doc(db, "users", docSnap.id);
      const friendSnap = await getDoc(friendRef);
      return { id: docSnap.id, ...friendSnap.data() };
    })
  );

  return [selfData, ...friendData];
};

// Sort helper
const sortDescending = (arr, key) => {
  return arr
    .filter((user) => typeof key(user) === "number")
    .sort((a, b) => key(b) - key(a));
};

// Leaderboard fetchers
export const getLeaderboardByStreak = async () => {
  const users = await fetchUserAndFriends();
  return sortDescending(users, (u) => u.streak?.bestStreak || 0);
};

export const getLeaderboardByTasksCompleted = async () => {
    const user = auth.currentUser;
    if (!user) return [];
  
    const selfId = user.uid;
    const users = await fetchUserAndFriends();
  
    // Map over each user and fetch the count from their completedTasks
    const tasksWithCount = await Promise.all(
      users.map(async (u) => {
        const completedRef = collection(db, "users", u.id, "completedTasks");
        const snapshot = await getDocs(completedRef);
        return {
          ...u,
          value: snapshot.size, 
        };
      })
    );
  
    // Sort by count descending
    return tasksWithCount.sort((a, b) => b.value - a.value);
  };
  

export const getLeaderboardByLevel = async () => {
  const users = await fetchUserAndFriends();
  return sortDescending(users, (u) => Math.floor((u.xp || 0) / 100));
};

export const getLeaderboardData = (setLeaders) => {
    const fetchAndUpdate = async () => {
      const [level, streak, tasks] = await Promise.all([
        getLeaderboardByLevel(),
        getLeaderboardByStreak(),
        getLeaderboardByTasksCompleted()
      ]);
  
      // Map each set to add a display 
      const format = (list, key) =>
        list.map((u) => ({
          id: u.id,
          username: u.username || "User",
          profilePic: u.profilePic || "",
          value: key(u),
        }));
  
      setLeaders({
        level: format(level, (u) => Math.floor((u.xp || 0) / 100)),
        streak: format(streak, (u) => u.streak?.bestStreak || 0),
        tasks: tasks.map((u) => ({
            id: u.id,
            username: u.username || "User",
            profilePic: u.profilePic || "",
            value: u.value, 
          })),
      });
    };
  
    // Initial fetch
    fetchAndUpdate();
  
    // Add live snapshot listener for future improvements
    // For now, just return empty unsubscribe
    return () => {};
  };
  
