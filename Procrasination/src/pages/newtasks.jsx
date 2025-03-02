import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";

const NewTasks = () => {
    // Sample hardcoded tasks
    const [tasks, setTasks] = useState([
        { id: 1, title: "Finish React Project", completed: false },
        { id: 2, title: "Read a book", completed: true },
        { id: 3, title: "Go for a walk", completed: false },
    ]);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">New Task List</h2>

            {/* Add Task Section (Mock Button) */}
            <div className="mb-3 d-flex">
                <input type="text" className="form-control me-2" placeholder="Enter new task..." />
                <button className="btn btn-primary">Add Task</button>
            </div>

            {/* Task List */}
            <ul className="list-group" >
                {tasks.map((task) => (
                    <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span className={task.completed ? "text-decoration-line-through" : ""}>
                            {task.title}
                        </span>

                        <div>
                            {/* Mock Edit Button */}
                            <button className="btn btn-sm btn-warning me-2">Edit</button>

                            {/* Mock Delete Button */}
                            <button className="btn btn-sm btn-danger mt-1">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NewTasks;
