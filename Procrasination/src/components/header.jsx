import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = auth.currentUser;

    const isLoggedIn = !!user;

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#212529", color: "white" }}>
            <Toolbar className="d-flex justify-content-between container py-2">
                {/* Momentum Logo links to Landing */}
                <Typography
                    variant="h5"
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        fontWeight: 600,
                        '&:hover': { color: '#bbb' }
                    }}
                >
                    Momentum
                </Typography>

                {/* Navigation Buttons */}
                <Box className="d-flex gap-3">
                    {isLoggedIn && (
                        <>
                            <Button
                                component={Link}
                                to="/main"
                                variant={location.pathname === "/main" ? "contained" : "outlined"}
                                sx={{
                                    minWidth: "100px",
                                    color: "white",
                                    borderColor: "white",
                                    '&:hover': { borderColor: "#ccc" }
                                }}
                            >
                                Main
                            </Button>

                            <Button
                                component={Link}
                                to="/user_profile"
                                variant={location.pathname === "/user_profile" ? "contained" : "outlined"}
                                sx={{
                                    minWidth: "100px",
                                    color: "white",
                                    borderColor: "white",
                                    '&:hover': { borderColor: "#ccc" }
                                }}
                            >
                                Profile
                            </Button>
                        </>
                    )}

                    {!isLoggedIn ? (
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            color="primary"
                            sx={{ minWidth: "100px" }}
                        >
                            Login
                        </Button>
                    ) : (
                        <Button
                            onClick={handleLogout}
                            variant="contained"
                            color="error"
                            sx={{ minWidth: "100px" }}
                        >
                            Logout
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
