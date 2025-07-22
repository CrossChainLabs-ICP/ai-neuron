import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Divider
} from "@mui/material";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { decode as base64Decode } from 'base-64';

import { ClientICP } from "../client-icp.js";

function formatDate(isoDate) {
  const date = new Date(isoDate);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export default function Dashboard() {
  const navigate = useNavigate();
  
  const COLORS = ["#FF6666", "#FFA500", "#4CAF50"];

  // Custom severity label styles
  const severityStyles = {
    High: {
      backgroundColor: "#FF6666",
      color: "white",
      padding: "2px 4px",
      borderRadius: "4px",
      fontWeight: "bold"
    },
    Medium: {
      backgroundColor: "#FFA500",
      color: "white",
      padding: "2px 4px",
      borderRadius: "4px",
      fontWeight: "bold"
    },
    Low: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "2px 4px",
      borderRadius: "4px",
      fontWeight: "bold"
    }
  };


    useEffect(() => {
        const loadReports = async () => {
            try {
                const client = new ClientICP();
                const latest_reports = await client.get_full_reports(0, 10);
                console.log('latest_reports', latest_reports);



            } catch (err) {
                console.log(err);
            }
        };
        loadReports();
    }, []);


return (
    <Box sx={{ minHeight: "100vh", p: { xs: 2, md: 3 }, background: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)" }}>


  </Box>
);
}
