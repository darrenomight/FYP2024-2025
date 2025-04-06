import React, { useEffect, useState } from "react";
import { getLeaderboardData } from "../logic/leaderboard_handler";
import { Table } from "@mui/material";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState({
    streak: [],
    tasks: [],
    level: [],
  });

  useEffect(() => {
    const unsubscribe = getLeaderboardData(setLeaders);
    return () => unsubscribe && unsubscribe();
  }, []);

  const renderTable = (data, label) => (
    <div className="col-md-4 mb-4">
      <h6 className="text-center">{label}</h6>
      <Table size="small">
        <thead>
          <tr>
            <th>#</th>
            <th>Profile</th>
            <th>Username</th>
            <th>{label.includes("Level") ? "Level" : label.includes("Streak") ? "Streak" : "Tasks"}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={user.profilePic || "/default.jpg"}
                  alt="pf"
                  style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }}
                />
              </td>
              <td>{user.username}</td>
              <td>{user.value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
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
