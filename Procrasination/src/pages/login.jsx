import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import googleIcon from "../assets/fav_48.png"; 


const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Handle Email/Password Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/main"); // Redirect after login
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    // Google Login
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate("/main"); // Redirect after login
        } catch (err) {
            setError("Google sign-in failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="logreg-box">
                    {isLogin ? (
                        // Login Form
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
                                    <p>Don't have an account? <a href="#" onClick={() => setIsLogin(false)}>Register</a></p>
                                    
                                    {/* Google Sign-In Button */}
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
                    ) : (
                        // Register Form
                        <div className="form-box register">
                            <div className="logreg-title text-center">
                                <h2>Register</h2>
                                <p>Create an account to join us</p>
                            </div>

                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control" required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" required />
                                </div>

                                <button type="submit" className="btn btn-success w-100">Register</button>

                                <div className="text-center mt-3">
                                    <p>Already have an account? <a href="#" onClick={() => setIsLogin(true)}>Login</a></p>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
