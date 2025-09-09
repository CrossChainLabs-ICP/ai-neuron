import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Link
} from "@mui/material";
import { decode as base64Decode } from "base-64";
import { ClientICP } from "../client-icp.js";

function formatDate(unixTimestamp) {
  // your timestamp is seconds since epoch
  const date = new Date(Number(unixTimestamp) * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function base64ToObject(base64Str) {
  let jsonStr;
  if (typeof atob === "function") {
    jsonStr = atob(base64Str);
  } else {
    jsonStr = Buffer.from(base64Str, "base64").toString("utf8");
  }
  return JSON.parse(jsonStr);
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);     // accumulated list
  const [page, setPage] = useState(0);            // which “page” we’re on
  const [hasMore, setHasMore] = useState(true);   // whether more pages exist
  const [loading, setLoading] = useState(false);  // show spinner while fetching

  const COLORS = ["#FF6666", "#fd7e00", "#299f2e"];

  const severityStyles = {
    high: {
      backgroundColor: COLORS[0],
      color: "#fff",
      padding: "2px 6px",
      borderRadius: 4,
      textTransform: "capitalize"
    },
    medium: {
      backgroundColor: COLORS[1],
      color: "#fff",
      padding: "2px 6px",
      borderRadius: 4,
      textTransform: "capitalize"
    },
    low: {
      backgroundColor: COLORS[2],
      color: "#fff",
      padding: "2px 6px",
      borderRadius: 4,
      textTransform: "capitalize"
    }
  };

  useEffect(() => {
    async function load() {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const client = new ClientICP();
        const pageSize = 10;

        const offset = page * pageSize;
        const raw = await client.get_full_reports(offset, pageSize);

        if (raw.length < pageSize) {
          setHasMore(false);
        }

        const items = raw.map(r => {
          const decodedTitle = base64ToObject(r.proposalTitle);
          const decodedReport = base64ToObject(r.report);
          return {
            ...decodedReport,
            title: decodedTitle
          };
        });

        setReports(prev => [...prev, ...items]);
        setPage(prev => prev + 1);

      } catch (err) {
        console.error("Error loading reports:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, loading, hasMore]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 3 },
        background: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)"
      }}
    >
      <Typography variant="h4" color="white" mb={3} sx={{ mx: { xs: 0, sm: 4, md: 8 }, p: 0 }}>
        Latest Proposal Audits
      </Typography>

      {loading ? (
        <CircularProgress color="inherit" />
      ) : reports && reports.length > 0 ? (
        <Paper 
          elevation={4} 
          sx={{ mx: { xs: 0, sm: 4, md: 8 }, p: 2 }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Issues</strong></TableCell>
                  <TableCell><strong>Top Severity</strong></TableCell>
                  <TableCell align="right"><strong>Report</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map(r => {
                  const sevs = r.audit.issues.map(i => i.severity);
                  const top = sevs.includes("high")
                    ? "high"
                    : sevs.includes("medium")
                    ? "medium"
                    : "low";

                  return (
                    <TableRow key={r.id} hover>
                      <TableCell>
                        <Link
                          href={`https://nns.ic0.app/proposal/?u=qoctq-giaaa-aaaaa-aaaea-cai&proposal=${r.id}`}
                          target="_blank"
                          rel="noopener"
                          color="inherit"
                        >
                          {r.id}
                        </Link>
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 300,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {r.title}
                      </TableCell>
                      <TableCell>{formatDate(r.timestamp)}</TableCell>
                      <TableCell>{r.audit.issues.length}</TableCell>
                      <TableCell>
                        <span style={severityStyles[top]}>
                          {top}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => navigate(`/reports/${r.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Typography color="white">No reports found.</Typography>
      )}
    </Box>
  );
}
