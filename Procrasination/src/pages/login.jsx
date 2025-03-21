import React, { useState, useEffect } from "react";
import Login from "../components/login";
import Register from "../components/register";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [userChecked, setUserChecked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                navigate("/username-setup"); // ✅ Always redirect new users
            }
            setUserChecked(true);
        });

        return () => unsubscribe();
    }, []);

    if (!userChecked) return <p>Loading...</p>; // ✅ Prevents redirect before user check is complete

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="logreg-box">
                    {isLogin ? <Login toggleRegister={() => setIsLogin(false)} /> : <Register toggleLogin={() => setIsLogin(true)} />}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
