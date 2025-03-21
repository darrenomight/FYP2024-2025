import React, { useState } from "react";
import { loginUser, loginWithGoogle } from "../logic/auth_services";
import { useNavigate } from "react-router-dom";
import googleIcon from "../assets/fav_48.png"; 

const Login = ({ toggleRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginUser(email, password);
            navigate("/main");
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { user, requiresUsername } = await loginWithGoogle();
    
            if (requiresUsername) {
                navigate("/username-setup"); 
            } else {
                navigate("/main"); // 
            }
        } catch (err) {
            setError("Google sign-in failed");
        }
    };
    

    return (
        <div className="form-box login">
            <div className="logreg-title text-center">
                <h2>Login</h2>
                <p>Please login to use our platform</p>
            </div>

            {error && <p className="error-text">{error}</p>}

            <form onSubmit={handleLogin}>
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

                <button type="submit" className="btn btn-primary w-100">Login</button>

                <div className="text-center mt-3">
                    <p>Don't have an account? <a href="#" onClick={toggleRegister}>Register</a></p>

                    <button 
                        type="button" 
                        className="btn btn-light w-100 mt-2 d-flex align-items-center justify-content-center"
                        onClick={handleGoogleLogin}
                    >
                        <img src={googleIcon} alt="Google Logo" style={{ width: "20px", marginRight: "10px" }} />
                        Sign in with Google
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
