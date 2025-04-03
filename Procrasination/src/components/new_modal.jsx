import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const TaskModal = ({
    show,
    onClose,
    newTask,
    setNewTask,
    isDaily,
    setIsDaily,
    handleSubmit,
    handlePreset
}) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create New Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="taskName">
                        <Form.Label>Task Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter task..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Check
                        type="switch"
                        id="daily-task-switch"
                        label="Mark as Daily Task"
                        checked={isDaily}
                        onChange={() => setIsDaily(!isDaily)}
                        className="my-3"
                    />

                    <div className="d-grid gap-2 mb-3">
                        <Button variant="primary" onClick={handleSubmit}>
                            Submit Task
                        </Button>
                    </div>

                    <div className="text-center mb-2 fw-bold">Need Some Help?</div>
                    <div className="d-flex justify-content-between">
                        <Button variant="outline-danger" onClick={() => handlePreset("Meditate")}>
                            Mental Health
                        </Button>
                        <Button variant="outline-primary" onClick={() => handlePreset("Go for a jog")}>
                            Sports
                        </Button>
                        <Button variant="outline-success" onClick={() => handlePreset("Drink water")}>
                            General
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default TaskModal;
