import React, { useEffect, useState } from "react";
import { getLeaderboardData } from "../logic/leaderboard_handler";
import { Table } from "@mui/material";
import { auth } from "../firebaseConfig";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState({
    streak: [],
    tasks: [],
    level: [],
  });

  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const unsubscribe = getLeaderboardData(setLeaders);
    return () => unsubscribe && unsubscribe();
  }, []);

  const renderTable = (data, label) => (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm rounded-4 p-3">
        <h6 className="text-center mb-3">{label}</h6>
        <Table size="small">
          <thead>
            <tr>
              <th>#</th>
              <th>Profile</th>
              <th>Username</th>
              <th>
                {label.includes("Level")
                  ? "Level"
                  : label.includes("Streak")
                    ? "Streak"
                    : "Tasks"}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr
                key={user.id}
                style={
                  user.id === currentUserId
                    ? {
                      backgroundColor: "#fff9db", // light gold
                      fontWeight: "bold",
                      borderRadius: "6px",
                    }
                    : {}
                }
              >
                <td>{index + 1}</td>
                <td>
                  <img
                    src={user.profilePic || "/default.jpg"}
                    alt="pf"
                    className="rounded-circle"
                    style={{ width: 35, height: 35, objectFit: "cover" }}
                  />
                </td>
                <td>
                  {user.username}
                  {user.id === currentUserId && (
                    <span className="text-muted ms-1" style={{ fontSize: "0.8rem" }}>
                      (You)
                    </span>
                  )}
                </td>
                <td>{user.value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="row mt-4">
      {renderTable(leaders.level, "Highest Level")}
      {renderTable(leaders.streak, "Longest Streak")}
      {renderTable(leaders.tasks, "Most Tasks Completed")}
    </div>
  );
};

export default Leaderboard;
