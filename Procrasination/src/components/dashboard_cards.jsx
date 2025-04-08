import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DailyLogin from "./daily_login";
import { Modal, Button, Form } from "react-bootstrap";
import { addUserTask, fetchUserTasks, completeUserTask, deleteUserTask } from "../logic/task_manager";
import { resetDailyTasks } from "../logic/reset_daily_tasks";
import TaskModal from "./new_modal"
import XPToast from "./xp_toast";
import UserMetrics from "./user_metrics";
import { onSnapshot, collection } from "firebase/firestore";
import {db, auth} from "../firebaseConfig"

const DashboardCards = () => {
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState("");
    const [isDaily, setIsDaily] = useState(false);
    const [completedToday, setCompletedToday] = useState([]);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastXP, setToastXP] = useState(0);
    const {username} = UserMetrics();
    


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
        const user = auth.currentUser;
        if (!user) return;
    
        const tasksRef = collection(db, "users", user.uid, "tasks");
    
        const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
            const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
            // Filter logic: keep dailies and active basics
            const filteredTasks = tasks.filter(task => {
                return task.type === "daily" || !task.completed;
            });
    
            setUserTasks(filteredTasks);
    
            // Update completed dailies
            const completed = filteredTasks
                .filter(task => task.type === "daily" && task.completed)
                .map(task => task.id);
    
            setCompletedToday(completed);
        });
    
        return () => unsubscribe(); // cleanup listener
    }, []);



    return (
        <div className="container">
            <div className="row g-4">

                <div className="col-md-12">
                    <DailyLogin />
                </div>


                {/* New Task Modal Trigger */}
                <div className="card p-4 shadow-sm text-center mx-auto" style={{ maxWidth: "800px" }}>

                    <div className="card p-4 shadow-sm text-center">
                        <h5>Your Daily Tasks</h5>
                        <p>
                            Feeling ready to get something done?
                            <br />
                            Add a simple goal for today — no pressure, and manage them below. 
                            <br />
                            ✅ means you did it, 🗑️ means it’s not the vibe anymore.
                        </p>
                        <div className="mt-1">
                            <button className="btn btn-secondary" onClick={() => setShowModal(true)}>Let's add!</button>
                        </div>
                    </div>
                </div>


                {/* My Tasks Table */}
                <div className="mt-4 text-center container-fluid px-3 " >
                    <h4> {username}'s Tasks</h4>
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
                                                    const xp = isDaily ? 30 : 20;
                                                    await completeUserTask(task);  // Still performs all DB logic

                                                    // Show toast
                                                    setToastXP(xp);
                                                    setToastOpen(true);

                                                    // Update UI
                                                    if (isDaily) {
                                                        const updatedTasks = userTasks.map(t =>
                                                            t.id === task.id ? { ...t, completed: true } : t
                                                        );
                                                        setUserTasks(updatedTasks);
                                                        setCompletedToday([...completedToday, task.id]);
                                                    } else {
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
            <XPToast open={toastOpen} xpAmount={toastXP} onClose={() => setToastOpen(false)} />

        </div>
    );
};

export default DashboardCards;
