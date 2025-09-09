import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ClientICP } from "../client-icp.js";

/**
 * Decode a Base64 JSON string into an object.
 */
function base64ToObject(str) {
  let json;
  if (typeof atob === "function") {
    json = atob(str);
  } else {
    json = Buffer.from(str, "base64").toString("utf8");
  }
  return JSON.parse(json);
}

export default function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const client = new ClientICP();
        const all = await client.get_full_reports(0, 100);
        const found = all.find(r => r.proposalID === id);
        if (!found) throw new Error("Report not found");

        const payload = base64ToObject(found.report);
        const titleObj = base64ToObject(found.proposalTitle);
        setReport({ ...payload, title: titleObj });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!report) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        Report not found.
      </Typography>
    );
  }

  const { title, timestamp, audit } = report;
  const issues = audit.issues || [];

  // Aggregate severities
  const counts = issues.reduce((acc, { severity }) => {
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {});
  const data = [
    { name: 'High', value: counts.high || 0 },
    { name: 'Medium', value: counts.medium || 0 },
    { name: 'Low', value: counts.low || 0 }
  ];
  const COLORS = { High: '#FF6666', Medium: '#fd7e00', Low: '#299f2e' };

  const severityStyles = {
    high: {
      backgroundColor: COLORS.High,
      color: "#fff",
      padding: "2px 6px",
      borderRadius: 4,
      textTransform: "capitalize"
    },
    medium: {
      backgroundColor: COLORS.Medium,
      color: "#fff",
      padding: "2px 6px",
      borderRadius: 4,
      textTransform: "capitalize"
    },
    low: {
      backgroundColor: COLORS.Low,
      color: "#fff",
      padding: "2px 6px",
      borderRadius: 4,
      textTransform: "capitalize"
    }
  };
  // Filter out zero-value slices to prevent overlapping labels
  const filteredData = data.filter(entry => entry.value > 0);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: '#f9fafb', minHeight: '100vh' }}>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
          Proposal {id} 
        </Typography>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {new Date(Number(timestamp) * 1000).toLocaleString()}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom fontWeight="bold">
          Severity Overview
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={filteredData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
              >
                {filteredData.map(entry => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const { name, value, payload: sliceData } = payload[0];
                    return (
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 500,
                          color: COLORS[sliceData.name],
                          background: "#fff",
                          border: `1px solid ${COLORS[sliceData.name]}`,
                          borderRadius: "6px",
                          padding: "4px 8px",
                        }}
                      >
                        {name}: {value}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={32}
                wrapperStyle={{ marginTop: 12 }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Audit Findings
        </Typography>
        {issues.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Line</strong></TableCell>
                  <TableCell><strong>Severity</strong></TableCell>
                  <TableCell><strong>File</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {issues.map((iss, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{iss.line}</TableCell>
                      <TableCell>
                        <span style={severityStyles[iss.severity]}>
                          {iss.severity}
                        </span>
                      </TableCell>
                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {iss.file}
                    </TableCell>
                    <TableCell>{iss.issue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No issues found.</Typography>
        )}
      </Paper>
    </Box>
  );
}
