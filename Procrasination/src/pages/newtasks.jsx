import React, { useEffect, useState } from "react";
import {
    fetchUserTasks,
    addUserTask,
    deleteUserTask,
    completeUserTask
} from "../logic/task_manager";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Material UI
import { Modal, Box, Button, TextField, Typography, FormControlLabel, Switch } from "@mui/material";

const modalStyle = {
    position: "absolute",
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400, bgcolor: "background.paper",
    boxShadow: 24, p: 4, borderRadius: "10px"
};

const NewTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newTask, setNewTask] = useState("");
    const [isDaily, setIsDaily] = useState(false);

    useEffect(() => {
        const loadTasks = async () => {
            const data = await fetchUserTasks();
            setTasks(data);
        };
        loadTasks();
    }, []);

    const handleAddTask = async () => {
        if (!newTask.trim()) return;

        const task = await addUserTask(newTask, isDaily);
        if (task) setTasks([...tasks, task]);

        setNewTask("");
        setIsDaily(false);
        setModalOpen(false);
    };

    const handleDelete = async (taskId) => {
        await deleteUserTask(taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
    };

    const handleComplete = async (task) => {
        await completeUserTask(task);
        setTasks(tasks.filter(t => t.id !== task.id));
    };

    // Presets
    const handlePreset = (preset) => {
        setNewTask(preset);
        setIsDaily(true);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">New Task List</h2>

            <div className="d-flex justify-content-end mb-4">
                <button className="btn btn-success" onClick={() => setModalOpen(true)}>
                    <i className="bi bi-plus-circle me-1"></i> Let's Add
                </button>
            </div>

            <ul className="list-group">
                {tasks.map((task) => (
                    <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span className={task.completed ? "text-decoration-line-through" : ""}>
                            {task.title} {task.isDaily && <span className="badge bg-warning ms-2">Daily</span>}
                        </span>
                        <div>
                            <button className="btn btn-success btn-sm me-2" onClick={() => handleComplete(task)}>
                                <i className="bi bi-check2-circle"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id)}>
                                <i className="bi bi-trash3-fill"></i>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2}>Create New Task</Typography>

                    <TextField
                        fullWidth
                        label="Task Name"
                        variant="outlined"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={isDaily}
                                onChange={(e) => setIsDaily(e.target.checked)}
                            />
                        }
                        label="Mark as Daily Task"
                    />

                    <Button variant="contained" fullWidth onClick={handleAddTask} sx={{ mt: 2 }}>
                        Submit Task
                    </Button>

                    <Typography variant="subtitle1" sx={{ mt: 3 }}>Need Some Help?</Typography>
                    <div className="d-flex justify-content-between mt-2">
                        <Button size="small" variant="outlined" onClick={() => handlePreset("Meditation")} color="secondary">
                            Mental Health
                        </Button>
                        <Button size="small" variant="outlined" onClick={() => handlePreset("Go for a jog")} color="primary">
                            Sports
                        </Button>
                        <Button size="small" variant="outlined" onClick={() => handlePreset("Make your bed")} color="success">
                            General
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default NewTasks;
