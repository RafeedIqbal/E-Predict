"use client";

import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Chip,
} from "@mui/material";
import { CsvContext } from "@/context/CsvContext";
import { useRouter } from "next/navigation";
import BugReportIcon from "@mui/icons-material/BugReport";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const steps = ["Generate Dataset", "Train Models", "Detect Anomalies"];

export default function AnomalyDetectionPage() {
  const { csvData } = useContext(CsvContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvData || (!csvData.xgb && !csvData.lstm)) {
      setError("No model results found. Please run the analysis first.");
      return;
    }

    setLoading(true);
    setError("");

    const csvString = csvData.xgb || csvData.lstm;
    const blob = new Blob([csvString!], { type: "text/csv" });
    const formData = new FormData();
    formData.append("file", blob, "anomaly_data.csv");

    try {
      const res = await fetch("http://localhost:5000/anomaly_detection", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setError("");
      } else {
        setError(data.error || "An error occurred during detection.");
      }
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    router.push("/dataset/create");
  };

  const plots = [
    { label: "Anomaly Scatter Plot", key: "scatter_plot" },
    { label: "Anomalies by Month", key: "month_plot" },
    { label: "Longest Anomalous Streak", key: "longest_anomalous_plot" },
    { label: "Longest Clean Streak", key: "longest_clean_plot" },
  ];

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", py: 4 }}>
      <Container maxWidth="xl">
        {/* Progress Stepper */}
        <Stepper activeStep={2} sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Anomaly Detection
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            Identify unusual patterns in your energy consumption data
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
            {error}
          </Alert>
        )}

        {/* Run Detection Button */}
        {!result && (
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <form onSubmit={handleSubmit}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading || (!csvData?.xgb && !csvData?.lstm)}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <BugReportIcon />}
                sx={{ px: 5, py: 1.5 }}
              >
                {loading ? "Detecting Anomalies..." : "Run Anomaly Detection"}
              </Button>
            </form>
            {!csvData?.xgb && !csvData?.lstm && (
              <Typography variant="body2" sx={{ color: "grey.500", mt: 2 }}>
                Please train at least one model first
              </Typography>
            )}
          </Box>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Summary Card */}
            <Paper
              sx={{
                p: 3,
                mb: 4,
                backgroundColor: "background.paper",
                maxWidth: 800,
                mx: "auto",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Detection Complete
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <Chip
                      label={`${result.num_anomalies} Anomalies Detected`}
                      color="warning"
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      label={`Target: ${result.inferred_target}`}
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<RestartAltIcon />}
                  onClick={handleStartOver}
                >
                  Start New Analysis
                </Button>
              </Box>
            </Paper>

            {/* Top Anomalies Table */}
            <Paper sx={{ p: 3, mb: 4, backgroundColor: "background.paper" }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Top 10 Anomalies
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#0a0a0a",
                  p: 2,
                  borderRadius: 2,
                  overflowX: "auto",
                  fontFamily: "monospace",
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    color: "#10b981",
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                  }}
                >
                  {String(result.best_ten_anomalies)}
                </pre>
              </Box>
            </Paper>

            {/* Visualization Grid */}
            <Grid container spacing={3}>
              {plots.map((plot) => {
                const plotData = result[plot.key] as string | undefined;
                if (!plotData) return null;

                return (
                  <Grid item xs={12} md={6} key={plot.key}>
                    <Card
                      sx={{
                        backgroundColor: "background.paper",
                        height: "100%",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 2 }}
                        >
                          {plot.label}
                        </Typography>
                        <Box
                          component="img"
                          src={`data:image/png;base64,${plotData}`}
                          alt={plot.label}
                          sx={{
                            width: "100%",
                            borderRadius: 2,
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 6 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => router.push("/dataset/analysis")}
                sx={{
                  borderColor: "rgba(255,255,255,0.2)",
                  "&:hover": { borderColor: "rgba(255,255,255,0.4)" },
                }}
              >
                ← Back to Analysis
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartOver}
                size="large"
              >
                Start New Analysis
              </Button>
            </Box>
          </>
        )}

        {/* Navigation when no results yet */}
        {!result && (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="text"
              color="inherit"
              onClick={() => router.push("/dataset/analysis")}
              sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}
            >
              ← Back to Model Training
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
