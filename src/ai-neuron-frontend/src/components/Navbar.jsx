import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";


import logoAINeuron from "/logo2.svg";

export default function AINeuronNavbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#2c3e50" }}>
      <Toolbar>

        {/* Left: Logo and Title */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            mr: 2,
          }}
        >
          <Box
            component="img"
            src={logoAINeuron}
            alt="AI Neuron Logo"
            sx={{
              height: { xs: 30, md: 40 },
              mr: { xs: 1, md: 2 },
              ml: { xs: 1, md: 2 },
            }}
          />
          <Typography
            variant="h4"
            sx={{
              textDecoration: "none",
              color: "white",
              fontSize: { xs: "1rem", md: "1.5rem" },
            }}
          >
            AI Neuron
          </Typography>
        </Box>

        {/* Center Links for Desktop Only */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Button component={Link} to="/" sx={{ color: "#e0e0e0", fontWeight: 600, fontSize: "17px", textTransform: "none" }}>
            Reports
          </Button>
          {/*<Button component={Link} to="/about" sx={{ color: "#e0e0e0", fontWeight: 600, fontSize: "17px", textTransform: "none" }}>
            About
          </Button>
          <Button component={Link} to="/contact" sx={{ color: "#e0e0e0", fontWeight: 600, fontSize: "17px", textTransform: "none" }}>
            Contact
          </Button>*/}
        </Box>


      </Toolbar>

    </AppBar>
  );
}
