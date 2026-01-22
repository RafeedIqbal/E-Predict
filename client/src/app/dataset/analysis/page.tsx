"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Container,
  Alert,
  Chip,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { CsvContext } from "@/context/CsvContext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface ModelResult {
  train_loss: number;
  test_loss: number;
  train_accuracy: number;
  test_accuracy: number;
  loss_curve: string;
  performance_plot: string;
  anomaly_csv: string;
  target_column_used: string;
}

const steps = ["Generate Dataset", "Train Models", "Detect Anomalies"];

export default function AnalysisPage() {
  const { csvData, setCsvData } = useContext(CsvContext);
  const [xgbResult, setXgbResult] = useState<ModelResult | null>(null);
  const [lstmResult, setLstmResult] = useState<ModelResult | null>(null);
  const [loadingXgb, setLoadingXgb] = useState(false);
  const [loadingLstm, setLoadingLstm] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRunXGB = async () => {
    if (!csvData || !csvData.original) {
      setError("No dataset found. Please generate data first.");
      return;
    }
    setError("");
    setLoadingXgb(true);
    setXgbResult(null);

    try {
      const blob = new Blob([csvData.original], { type: "text/csv" });
      const formData = new FormData();
      formData.append("file", blob, "input_data.csv");

      const response = await axios.post<ModelResult>(
        "http://localhost:5000/xgb",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setXgbResult(response.data);
      setCsvData((prev) => ({ ...prev, xgb: response.data.anomaly_csv }));
    } catch (err: unknown) {
      console.error("XGBoost Error:", err);
      const errorMsg = err instanceof Error ? err.message : "Error running XGBoost model.";
      setError(errorMsg);
    } finally {
      setLoadingXgb(false);
    }
  };

  const handleRunLSTM = async () => {
    if (!csvData || !csvData.original) {
      setError("No dataset found. Please generate data first.");
      return;
    }
    setError("");
    setLoadingLstm(true);
    setLstmResult(null);

    try {
      const blob = new Blob([csvData.original], { type: "text/csv" });
      const formData = new FormData();
      formData.append("file", blob, "input_data.csv");

      const response = await axios.post<ModelResult>(
        "http://localhost:5000/lstm",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setLstmResult(response.data);
      setCsvData((prev) => ({ ...prev, lstm: response.data.anomaly_csv }));
    } catch (err: unknown) {
      console.error("LSTM Error:", err);
      const errorMsg = err instanceof Error ? err.message : "Error running LSTM model.";
      setError(errorMsg);
    } finally {
      setLoadingLstm(false);
    }
  };

  const handleNext = () => {
    if (!csvData?.xgb && !csvData?.lstm) {
      setError("Please run at least one model before proceeding.");
      return;
    }
    setError("");
    router.push("/dataset/anomaly");
  };

  const isLoading = loadingXgb || loadingLstm;
  const hasResults = xgbResult || lstmResult;

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", py: 4 }}>
      <Container maxWidth="xl">
        {/* Progress Stepper */}
        <Stepper activeStep={1} sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Model Training & Analysis
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            Train XGBoost and LSTM models on your generated dataset
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
            {error}
          </Alert>
        )}

        {/* Model Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            mb: 4,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleRunXGB}
            disabled={isLoading}
            startIcon={loadingXgb ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
            sx={{ minWidth: 180 }}
          >
            {loadingXgb ? "Training..." : "Run XGBoost"}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleRunLSTM}
            disabled={isLoading}
            startIcon={loadingLstm ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
            sx={{ minWidth: 180 }}
          >
            {loadingLstm ? "Training..." : "Run LSTM"}
          </Button>
        </Box>

        {/* Results Grid */}
        <Grid container spacing={3}>
          {/* Left Column: Graphs */}
          <Grid item xs={12} lg={8}>
            <Grid container spacing={3}>
              {xgbResult && (
                <>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, backgroundColor: "background.paper" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          XGBoost Loss Curve
                        </Typography>
                        <Chip label={xgbResult.target_column_used} size="small" color="primary" />
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Image
                          src={`data:image/png;base64,${xgbResult.loss_curve}`}
                          alt="XGB Loss Curve"
                          unoptimized
                          width={650}
                          height={350}
                          style={{ objectFit: "contain", borderRadius: 8 }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, backgroundColor: "background.paper" }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        XGBoost Performance
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Image
                          src={`data:image/png;base64,${xgbResult.performance_plot}`}
                          alt="XGB Performance Plot"
                          unoptimized
                          width={650}
                          height={350}
                          style={{ objectFit: "contain", borderRadius: 8 }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </>
              )}

              {lstmResult && (
                <>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, backgroundColor: "background.paper" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          LSTM Loss Curve
                        </Typography>
                        <Chip label={lstmResult.target_column_used} size="small" color="secondary" />
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Image
                          src={`data:image/png;base64,${lstmResult.loss_curve}`}
                          alt="LSTM Loss Curve"
                          unoptimized
                          width={650}
                          height={350}
                          style={{ objectFit: "contain", borderRadius: 8 }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, backgroundColor: "background.paper" }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        LSTM Performance
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Image
                          src={`data:image/png;base64,${lstmResult.performance_plot}`}
                          alt="LSTM Performance Plot"
                          unoptimized
                          width={650}
                          height={350}
                          style={{ objectFit: "contain", borderRadius: 8 }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </>
              )}

              {!hasResults && !isLoading && (
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 6,
                      backgroundColor: "background.paper",
                      textAlign: "center",
                      border: "2px dashed rgba(255,255,255,0.1)",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "grey.500" }}>
                      Run a model to view results here
                    </Typography>
                    <Typography variant="body2" sx={{ color: "grey.600", mt: 1 }}>
                      Choose XGBoost for speed or LSTM for time-series patterns
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Right Column: Metrics */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              {xgbResult && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: "background.paper" }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
                      XGBoost Metrics
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "grey.400" }}>Target Column</Typography>
                        <Typography variant="body2">{xgbResult.target_column_used}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "grey.400" }}>Train RMSE</Typography>
                        <Typography variant="body2">{xgbResult.train_loss.toFixed(4)}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "grey.400" }}>Test RMSE</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{xgbResult.test_loss.toFixed(4)}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "grey.400" }}>Train R²</Typography>
                        <Typography variant="body2">{xgbResult.train_accuracy.toFixed(4)}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "grey.400" }}>Test R²</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "success.main" }}>
                          {xgbResult.test_accuracy.toFixed(4)}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              )}

              {lstmResult && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, backgroundColor: "background.paper" }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "secondary.main" }}>
                      LSTM Metrics
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "grey.400" }}>Target Column</Typography>
                        <Typography variant="body2">{lstmResult.target_column_used}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "grey.400" }}>Train RMSE</Typography>
                        <Typography variant="body2">{lstmResult.train_loss.toFixed(4)}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "grey.400" }}>Test RMSE</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{lstmResult.test_loss.toFixed(4)}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "grey.400" }}>Train R²</Typography>
                        <Typography variant="body2">{lstmResult.train_accuracy.toFixed(4)}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "grey.400" }}>Test R²</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "success.main" }}>
                          {lstmResult.test_accuracy.toFixed(4)}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              )}

              {!hasResults && !isLoading && (
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 4,
                      backgroundColor: "background.paper",
                      textAlign: "center",
                      border: "2px dashed rgba(255,255,255,0.1)",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "grey.500" }}>
                      Metrics will appear here
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Navigation */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 6 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => router.push("/dataset/create")}
            sx={{
              borderColor: "rgba(255,255,255,0.2)",
              "&:hover": { borderColor: "rgba(255,255,255,0.4)" },
            }}
          >
            ← Back
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleNext}
            disabled={!csvData?.xgb && !csvData?.lstm}
            size="large"
          >
            Continue to Anomaly Detection →
          </Button>
        </Box>
      </Container>
    </Box>
  );
}