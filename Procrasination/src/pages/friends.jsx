import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card } from "react-bootstrap";
import FriendModal from "../components/friend_modal";
import { listenToFriends } from "../logic/friend_handler";
import defaultProfilePic from "../assets/sampleUserPf.jpg";
import { getLeaderboardByStreak, getLeaderboardByTasksCompleted, getLeaderboardByLevel } from "../logic/leaderboard_handler";
import Leaderboard from "../components/leaderboard";


const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let unsubscribe;
  
    const startListening = async () => {
      unsubscribe = listenToFriends((updatedList) => {
        setFriends(updatedList);
      });
    };
  
    startListening();
  
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  

  return (
    <div className="container py-4">
      <h3 className="text-center mb-4">Your Social Dashboard</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Friends List</h5>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add / Manage Friends
        </Button>
      </div>

      {friends.length === 0 ? (
        <p className="text-muted">You haven't added any friends yet.</p>
      ) : (
        <div className="row">
          {friends.map((friend) => (
            <div className="col-md-4 mb-3" key={friend.id}>
              <Card className="shadow-sm">
                <Card.Body className="d-flex align-items-center">
                  <img
                    src={friend.profilePic || defaultProfilePic}
                    alt="friend"
                    className="rounded-circle me-3"
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                  <div>
                    <Card.Title className="mb-0">{friend.username || "Unnamed"}</Card.Title>
                    <Card.Text className="text-muted" style={{ fontSize: "0.85rem" }}>
                      {friend.email}
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      <hr className="my-4" />

      <h5 className="text-center mb-3">🏆 Leaderboard</h5>
      <div className="text-center text-muted">
        <em>Track how your XP and streaks stack up against your friends.</em>
      </div>

      <Leaderboard/>

      {/* Modal */}
      <FriendModal show={showModal} onHide={() => setShowModal(false)} />
    </div>
  );
};

export default FriendsPage;
