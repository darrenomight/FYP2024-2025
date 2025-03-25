import React, { useEffect, useState } from "react";
import {
    fetchUserTasks,
    addUserTask,
    deleteUserTask,
    completeUserTask
} from "../logic/task_manager";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const NewTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        const loadTasks = async () => {
            const data = await fetchUserTasks();
            setTasks(data);
        };
        loadTasks();
    }, []);

    const handleAddTask = async () => {
        if (!newTask.trim()) return;
        const task = await addUserTask(newTask);
        if (task) setTasks([...tasks, task]);
        setNewTask("");
    };

    const handleDelete = async (taskId) => {
        await deleteUserTask(taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
    };

    const handleComplete = async (task) => {
        await completeUserTask(task);
        setTasks(tasks.filter(t => t.id !== task.id));
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">New Task List</h2>

            <div className="mb-4 d-flex">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Enter new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleAddTask}>
                    <i className="bi bi-plus-circle me-1"></i> Add Task
                </button>
            </div>

            <ul className="list-group">
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <span className={task.completed ? "text-decoration-line-through" : ""}>
                            {task.title}
                        </span>
                        <div>
                            <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => handleComplete(task)}
                            >
                                <i className="bi bi-check2-circle"></i>
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(task.id)}
                            >
                                <i className="bi bi-trash3-fill"></i>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NewTasks;
