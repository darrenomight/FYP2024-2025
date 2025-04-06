import React, { useState, useEffect } from "react";
import { Modal, Button, Form, ListGroup, Spinner } from "react-bootstrap";
import {
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    declineFriendRequest
} from "../logic/friend_handler";

const FriendModal = ({ show, onHide }) => {
    const [emailInput, setEmailInput] = useState("");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const loadRequests = async () => {
        setLoading(true);
        try {
            const data = await getFriendRequests();
            setRequests(data);
        } catch (err) {
            console.error("Failed to load requests", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (show) {
            loadRequests();
        }
    }, [show]);

    const handleSend = async () => {
        if (!emailInput.trim()) return;

        setSending(true);
        setError("");

        try {
            await sendFriendRequest(emailInput);
            setEmailInput("");
        } catch (err) {
            setError(err.message || "Failed to send request");
        }

        setSending(false);
    };

    const handleAccept = async (id) => {
        await acceptFriendRequest(id);
        await loadRequests();
    };

    const handleDecline = async (id) => {
        await declineFriendRequest(id);
        await loadRequests();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add / Manage Friends</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Find Friend by Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="example@email.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                    </Form.Group>
                    {error && <div className="text-danger mt-2">{error}</div>}
                    <div className="d-grid mt-3">
                        <Button variant="primary" onClick={handleSend} disabled={sending}>
                            {sending ? "Sending..." : "Send Friend Request"}
                        </Button>
                    </div>
                </Form>

                <hr />

                <h6>Pending Requests</h6>
                {loading ? (
                    <Spinner animation="border" />
                ) : requests.length === 0 ? (
                    <p className="text-muted">No friend requests</p>
                ) : (
                    <ListGroup>
                        {requests.map((req) => (
                            <ListGroup.Item key={req.id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <img
                                        src={req.profilePic || "/default.png"}
                                        alt="profile"
                                        className="rounded-circle me-2"
                                        style={{ width: 35, height: 35, objectFit: "cover" }}
                                    />
                                    {req.username || req.email}
                                </div>
                                <div>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleAccept(req.id)}
                                        className="me-2"
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDecline(req.id)}
                                    >
                                        Decline
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default FriendModal;
