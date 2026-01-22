"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import BoltIcon from "@mui/icons-material/Bolt";
import TimelineIcon from "@mui/icons-material/Timeline";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <TimelineIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Advanced ML Models",
      description:
        "Leverage XGBoost and LSTM neural networks for accurate energy consumption predictions.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      title: "Anomaly Detection",
      description:
        "Identify unusual patterns and potential issues in energy usage with statistical analysis.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Real-time Analysis",
      description:
        "Process IESO Ontario energy data with climate correlations for comprehensive insights.",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0a 50%, #0a0a0a 100%)",
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            pt: { xs: 8, md: 12 },
            pb: { xs: 8, md: 12 },
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
              px: 3,
              py: 1,
              borderRadius: "50px",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
            }}
          >
            <BoltIcon sx={{ color: "primary.main", fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: "primary.light" }}>
              AI-Powered Energy Analytics
            </Typography>
          </Box>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              background: "linear-gradient(135deg, #ffffff 0%, #a5a5a5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Predict Energy Consumption.
            <br />
            Detect Anomalies.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "grey.400",
              mb: 5,
              maxWidth: 600,
              mx: "auto",
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Analyze Ontario energy consumption patterns using machine learning.
            Generate datasets from IESO data, train predictive models, and
            identify anomalies.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/login")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
                },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push("/login")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                borderColor: "rgba(255,255,255,0.2)",
                color: "white",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.4)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ pb: 12 }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              mb: 6,
              fontWeight: 600,
            }}
          >
            Powerful Features
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "rgba(99, 102, 241, 0.3)",
                      boxShadow: "0 8px 30px rgba(99, 102, 241, 0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "grey.400" }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Ready to analyze your energy data?
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400", mb: 4 }}>
            Start with our pre-configured IESO Ontario datasets and climate
            data.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => router.push("/register")}
            sx={{ px: 5, py: 1.5 }}
          >
            Create Free Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
