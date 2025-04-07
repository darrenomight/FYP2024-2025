import { auth, db } from "../firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export const achievementDefinitions = [
  { id: "streak_1", title: "First Streak", description: "Log in 1 day in a row.", type: "streak", requirement: 1, icon: "🔥" },
  { id: "streak_7", title: "Consistency Champ", description: "Reach a 7-day login streak.", type: "streak", requirement: 7, icon: "📆" },
  { id: "streak_30", title: "Master of Habit", description: "Maintain a 30-day login streak.", type: "streak", requirement: 30, icon: "🏆" },

  { id: "xp_100", title: "XP Newbie", description: "Earn 100 XP.", type: "xp", requirement: 100, icon: "✨" },
  { id: "xp_500", title: "XP Grinder", description: "Earn 500 XP.", type: "xp", requirement: 500, icon: "⚡" },
  { id: "xp_1000", title: "XP Legend", description: "Earn 1000 XP.", type: "xp", requirement: 1000, icon: "🌟" },

  { id: "tasks_5", title: "Task Initiate", description: "Complete 5 tasks.", type: "tasks", requirement: 5, icon: "✅" },
  { id: "tasks_25", title: "Productive Beast", description: "Complete 25 tasks.", type: "tasks", requirement: 25, icon: "🚀" },
  { id: "tasks_50", title: "Goal Slayer", description: "Complete 50 tasks.", type: "tasks", requirement: 50, icon: "💪" },
];

export const getAchievements = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const streak = userData?.streak?.bestStreak || 0;
  const xp = userData?.xp || 0;

  const completedRef = collection(db, "users", user.uid, "completedTasks");
  const completedSnap = await getDocs(completedRef);
  const tasksCompleted = completedSnap.size;

  return achievementDefinitions.map((achv) => {
    let progress = 0;
    if (achv.type === "streak") progress = streak;
    else if (achv.type === "xp") progress = xp;
    else if (achv.type === "tasks") progress = tasksCompleted;

    return {
      ...achv,
      unlocked: progress >= achv.requirement,
    };
  });
};
