"use client";

import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import BoltIcon from "@mui/icons-material/Bolt";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isHome = pathname === "/";

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        router.push("/login");
    };

    const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("access_token");

    if (isAuthPage) return null;

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: "rgba(10, 10, 10, 0.8)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                        }}
                        onClick={() => router.push("/")}
                    >
                        <BoltIcon sx={{ color: "primary.main", fontSize: 32 }} />
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #6366f1 0%, #10b981 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            E-Predict
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        {!isHome && (
                            <Button
                                color="inherit"
                                onClick={() => router.push("/")}
                                sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
                            >
                                Home
                            </Button>
                        )}
                        {isLoggedIn ? (
                            <>
                                <Button
                                    color="inherit"
                                    onClick={() => router.push("/dataset/create")}
                                    sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
                                >
                                    New Analysis
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleLogout}
                                    size="small"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="inherit"
                                    onClick={() => router.push("/login")}
                                    sx={{ opacity: 0.8, "&:hover": { opacity: 1 } }}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => router.push("/register")}
                                    size="small"
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
