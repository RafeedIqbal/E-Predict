"use client";

import React, { useState, useContext } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CsvContext } from "@/context/CsvContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Options for zonal dataset
const zonalOptions = [
  "Northwest",
  "Northeast",
  "Ottawa",
  "East",
  "Toronto",
  "Essa",
  "Bruce",
  "Southwest",
  "Niagara",
  "West",
  "Zone Total",
];

// Options for FSA dataset
const fsaOptions = ['Toronto', 'Ottawa', 'Hamilton', 'Mississauga', 'Brampton', 'Kitchener', 'London', 'Markham', 'Oshawa', 'Vaughan', 'Windsor', 'St. Catharines', 'Oakville', 'Richmond Hill', 'Burlington', 'Sudbury', 'Barrie', 'Guelph', 'Whitby', 'Cambridge', 'Milton', 'Ajax', 'Waterloo', 'Thunder Bay', 'Brantford', 'Chatham', 'Clarington', 'Pickering', 'Niagara Falls', 'Newmarket', 'Peterborough', 'Kawartha Lakes', 'Caledon', 'Belleville', 'Sarnia', 'Sault Ste. Marie', 'Welland', 'Halton Hills', 'Aurora', 'North Bay'];

const steps = ["Configure Dataset", "Generate Data", "Proceed to Analysis"];

const CreateDatasetPage: React.FC = () => {
  const { csvData, setCsvData } = useContext(CsvContext);
  const router = useRouter();

  // Form state
  const [datasetType, setDatasetType] = useState<string>("Zonal");
  const [target, setTarget] = useState<string>(zonalOptions[0]);
  const [startMonthFSA, setStartMonthFSA] = useState<string>("2018-01");
  const [endMonthFSA, setEndMonthFSA] = useState<string>("2024-12");
  const [startYearZonal, setStartYearZonal] = useState<string>("2018");
  const [endYearZonal, setEndYearZonal] = useState<string>("2024");

  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);

  const handleDatasetTypeChange = (event: { target: { value: string } }) => {
    const newType = event.target.value;
    setDatasetType(newType);
    if (newType === "FSA") {
      setTarget(fsaOptions[0]);
    } else {
      setTarget(zonalOptions[0]);
    }
  };

  const handleGenerateCSV = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    setActiveStep(1);

    try {
      let postData: Record<string, string | number> = {
        dataset_type: datasetType.toLowerCase(),
        predictor_repo: "climate",
      };

      if (datasetType === "FSA") {
        const [sYear, sMonth] = startMonthFSA.split("-");
        const [eYear, eMonth] = endMonthFSA.split("-");
        postData = {
          ...postData,
          target_city: target,
          start_year: parseInt(sYear),
          start_month: parseInt(sMonth),
          end_year: parseInt(eYear),
          end_month: parseInt(eMonth),
        };
      } else {
        postData = {
          ...postData,
          target_zone: target,
          start_year: parseInt(startYearZonal),
          end_year: parseInt(endYearZonal),
        };
      }

      const response = await axios.post(
        "http://localhost:5000/generate_csv",
        postData,
        { responseType: "text" }
      );

      setCsvData({ original: response.data, target });
      setSuccess("Dataset generated successfully!");
      setActiveStep(2);
    } catch (err: unknown) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : "Failed to generate dataset. Please try again.";
      setError(errorMsg);
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    router.push("/dataset/analysis");
  };

  const handleDownloadCSV = () => {
    if (!csvData?.original) return;
    const blob = new Blob([csvData.original], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${target.replace(/\s+/g, "_")}_dataset.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", py: 4 }}>
      <Container maxWidth="md">
        {/* Progress Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Configure Dataset
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400", mb: 4 }}>
            Select your data source and parameters to generate a merged energy and climate dataset.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              icon={<CheckCircleIcon />}
              sx={{ mb: 3 }}
            >
              {success}
            </Alert>
          )}

          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Dataset Type */}
            <FormControl fullWidth>
              <InputLabel id="dataset-type-label">Dataset Type</InputLabel>
              <Select
                labelId="dataset-type-label"
                value={datasetType}
                label="Dataset Type"
                onChange={handleDatasetTypeChange}
                disabled={loading || !!success}
              >
                <MenuItem value="Zonal">Zonal (Ontario Zones)</MenuItem>
                <MenuItem value="FSA">FSA (Forward Sortation Area / City)</MenuItem>
              </Select>
            </FormControl>

            {/* Target Selection */}
            <FormControl fullWidth>
              <InputLabel id="target-label">
                {datasetType === "FSA" ? "City" : "Zone"}
              </InputLabel>
              <Select
                labelId="target-label"
                value={target}
                label={datasetType === "FSA" ? "City" : "Zone"}
                onChange={(e) => setTarget(e.target.value as string)}
                disabled={loading || !!success}
              >
                {(datasetType === "FSA" ? fsaOptions : zonalOptions).map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date Range */}
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
              {datasetType === "FSA" ? (
                <>
                  <TextField
                    label="Start Month"
                    type="month"
                    fullWidth
                    value={startMonthFSA}
                    onChange={(e) => setStartMonthFSA(e.target.value)}
                    disabled={loading || !!success}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="End Month"
                    type="month"
                    fullWidth
                    value={endMonthFSA}
                    onChange={(e) => setEndMonthFSA(e.target.value)}
                    disabled={loading || !!success}
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    label="Start Year"
                    type="number"
                    fullWidth
                    value={startYearZonal}
                    onChange={(e) => setStartYearZonal(e.target.value)}
                    disabled={loading || !!success}
                    InputProps={{ inputProps: { min: 2003, max: 2024 } }}
                  />
                  <TextField
                    label="End Year"
                    type="number"
                    fullWidth
                    value={endYearZonal}
                    onChange={(e) => setEndYearZonal(e.target.value)}
                    disabled={loading || !!success}
                    InputProps={{ inputProps: { min: 2003, max: 2024 } }}
                  />
                </>
              )}
            </Box>

            {/* Generate Button */}
            {!success && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateCSV}
                disabled={loading}
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CircularProgress size={24} color="inherit" />
                    Generating Dataset...
                  </Box>
                ) : (
                  "Generate Dataset"
                )}
              </Button>
            )}

            {/* Success Actions */}
            {success && (
              <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleProceed}
                  fullWidth
                  size="large"
                >
                  Continue to Analysis →
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleDownloadCSV}
                  fullWidth
                  size="large"
                >
                  Download CSV
                </Button>
              </Box>
            )}
          </Box>

          {/* Dataset Info */}
          {success && csvData?.original && (
            <Box sx={{ mt: 4, p: 3, backgroundColor: "rgba(16, 185, 129, 0.1)", borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "secondary.main", mb: 1 }}>
                Dataset Ready
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip label={`Target: ${target}`} size="small" />
                <Chip label={`Type: ${datasetType}`} size="small" />
                <Chip
                  label={`Rows: ${csvData.original.split("\n").length - 1}`}
                  size="small"
                />
              </Box>
            </Box>
          )}
        </Paper>

        {/* Back Button */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="text"
            color="inherit"
            onClick={() => router.push("/dataset")}
            sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}
          >
            ← Back to Dataset Options
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CreateDatasetPage;
