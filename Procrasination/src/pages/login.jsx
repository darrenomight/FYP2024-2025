import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="logreg-box">
                    {/* Toggle Between Login & Register */}
                    {isLogin ? (
                        // Login Form
                        <div className="form-box login">
                            <div className="logreg-title text-center">
                                <h2>Login</h2>
                                <p>Please login to use our platform</p>
                            </div>

                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" required />
                                </div>

                                <button type="submit" className="btn btn-primary w-100">Login</button>

                                <div className="text-center mt-3">
                                    <p>Don't have an account? <a href="#" onClick={() => setIsLogin(false)}>Register</a></p>
                                    <p>Sign in with Google? google icon "--- firebase login/auth" </p>
                                </div>
                            </form>
                        </div>
                    ) : (
                        // Register Form
                        <div className="form-box register">
                            <div className="logreg-title text-center">
                                <h2>Register</h2>
                                <p>Please provide the following to join our platform!</p>
                            </div>

                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
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
                                    <p>Sign in with Google? google icon "--- firebase login/auth" </p>
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
