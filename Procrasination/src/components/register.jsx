import React, { useState } from "react";
import { registerUser } from "../logic/auth_services";
import { useNavigate } from "react-router-dom";

const Register = ({ toggleLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser(email, password);
            navigate("/username-setup"); // Redirect to username setup instead of /main
        } catch (err) {
            setError("Registration failed. Try again.");
        }
    };

    return (
        <div className="form-box register">
            <div className="logreg-title text-center">
                <h2>Register</h2>
                <p>Create an account to join us</p>
            </div>

            {error && <p className="error-text">{error}</p>}

            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <button type="submit" className="btn btn-success w-100">Register</button>

                <div className="text-center mt-3">
                    <p>Already have an account? <a href="#" onClick={toggleLogin}>Login</a></p>
                </div>
            </form>
        </div>
    );
};

export default Register;