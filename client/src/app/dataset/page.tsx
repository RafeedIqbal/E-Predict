"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DatasetIcon from "@mui/icons-material/Dataset";

export default function DatasetPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <DatasetIcon
            sx={{ fontSize: 64, color: "primary.main", mb: 2 }}
          />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Create Your Dataset
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400", maxWidth: 500, mx: "auto" }}>
            Generate a custom dataset using IESO Ontario energy data combined with
            climate information for your analysis.
          </Typography>
        </Box>

        <Card
          sx={{
            maxWidth: 500,
            mx: "auto",
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              borderColor: "primary.main",
              boxShadow: "0 8px 30px rgba(99, 102, 241, 0.2)",
            },
          }}
        >
          <CardActionArea onClick={() => router.push("/dataset/create")}>
            <CardContent
              sx={{
                p: 5,
                textAlign: "center",
              }}
            >
              <AddCircleOutlineIcon
                sx={{ fontSize: 56, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Create New Dataset
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.400" }}>
                Select data type, region, and date range to generate a merged
                energy and climate dataset
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            variant="text"
            color="inherit"
            onClick={() => router.back()}
            sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}
          >
            ← Go Back
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
