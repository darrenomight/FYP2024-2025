import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DailyLogin from "./daily_login";
import { Modal, Button, Form } from "react-bootstrap";
import { addUserTask, fetchUserTasks, completeUserTask, deleteUserTask } from "../logic/task_manager";
import { resetDailyTasks } from "../logic/reset_daily_tasks";
import TaskModal from "./new_modal"

const DashboardCards = () => {
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState("");
    const [isDaily, setIsDaily] = useState(false);
    const [completedToday, setCompletedToday] = useState([]);

    const handleSubmit = async () => {
        if (!newTask.trim()) return;

        await addUserTask(newTask, isDaily);
        setNewTask("");
        setIsDaily(false);
        setShowModal(false);
    };

    const handlePreset = (task) => {
        setNewTask(task);
        setIsDaily(true);
    };

    const [userTasks, setUserTasks] = useState([]);

    useEffect(() => {
        const initialize = async () => {
            await resetDailyTasks(); // Unlock dailies at 1 AM
            const tasks = await fetchUserTasks();
    
            // Filter logic: keep dailies, hide completed basics
            const filteredTasks = tasks.filter(task => {
                return task.type === "daily" || !task.completed;
            });
    
            setUserTasks(filteredTasks);
    
            // Track completed daily tasks
            const completed = filteredTasks
                .filter(task => task.type === "daily" && task.completed)
                .map(task => task.id);
    
            setCompletedToday(completed);
        };
    
        initialize();
    }, []);
    


    return (
        <div className="container">
            <div className="row g-4">

                <div className="col-md-12">
                    <DailyLogin />
                </div>


                {/* New Task Modal Trigger */}
                <div className="col-md-12">
                    <div className="card p-4 shadow-sm text-center">
                        <h5>Your Daily Tasks</h5>
                        <p>
                            Need to Add new items to your task list?
                            <br />
                            Just press the button and select your goals, and manage them below. The ✅ is for completion and 🗑️ for mistakes.
                        </p>
                        <div className="mt-1">
                            <button className="btn btn-secondary" onClick={() => setShowModal(true)}>Let's add!</button>
                        </div>
                    </div>
                </div>


                {/* My Tasks Table */}
                <div className="mt-4 text-center" >
                    <h4>My Tasks</h4>
                    <table className="table table-striped table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Task</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userTasks.map((task) => {
                                const isCompleted = task.completed;
                                const isDaily = task.type === "daily";

                                return (
                                    <tr key={task.id}>
                                        <td className={isCompleted ? "text-decoration-line-through text-muted" : ""}>
                                            {task.title}
                                        </td>
                                        <td>
                                            <span className={`badge ${isDaily ? "bg-primary" : "bg-secondary"}`}>
                                                {task.type || "basic"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={async () => {
                                                    await completeUserTask(task);
                                                    if (isDaily) {
                                                        // Mark as completed for locking
                                                        const updatedTasks = userTasks.map(t =>
                                                            t.id === task.id ? { ...t, completed: true } : t
                                                        );
                                                        setUserTasks(updatedTasks);
                                                        setCompletedToday([...completedToday, task.id]);
                                                    } else {
                                                        // Basic tasks are deleted after completion
                                                        setUserTasks(userTasks.filter((t) => t.id !== task.id));
                                                    }
                                                }}
                                                disabled={isDaily && completedToday.includes(task.id)}
                                            >
                                                <i className="bi bi-check-circle"></i>
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={async () => {
                                                    await deleteUserTask(task.id);
                                                    setUserTasks(userTasks.filter((t) => t.id !== task.id));
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Modal Component */}

            <TaskModal
                show={showModal}
                onClose={() => setShowModal(false)}
                newTask={newTask}
                setNewTask={setNewTask}
                isDaily={isDaily}
                setIsDaily={setIsDaily}
                handleSubmit={handleSubmit}
                handlePreset={handlePreset}
            />

        </div>
    );
};

export default DashboardCards;
