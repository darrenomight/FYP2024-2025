import React, { useEffect, useState } from "react";
import { getAchievements } from "../logic/achievements";
import "bootstrap/dist/css/bootstrap.min.css";

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAchievements();
      setAchievements(data);
    };
    fetchData();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">🏆 Your Achievements</h2>

      <div className="row">
        {achievements.map((achv, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div
              className={`card shadow-sm h-100 text-center ${
                achv.unlocked ? "border-success" : "border-secondary bg-light text-muted"
              }`}
            >
              <div className="card-body">
                <div style={{ fontSize: "2rem" }}>
                  {achv.unlocked ? achv.icon : "❓"}
                </div>
                <h5 className="card-title mt-2">{achv.title}</h5>
                <p className="card-text">{achv.description}</p>
                <span className={`badge ${achv.unlocked ? "bg-success" : "bg-secondary"}`}>
                  {achv.unlocked ? "Unlocked" : "Locked"}
                </span>
                <p className="mt-2">
                  🏁 Requirement: {achv.requirement} {achv.type.toUpperCase()}
                </p>
                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                  {achv.unlocked
                    ? `You earned: ${achv.icon}`
                    : "Earn this reward by reaching the goal!"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;
