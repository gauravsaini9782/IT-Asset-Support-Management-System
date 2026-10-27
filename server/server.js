const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);

const PORT = process.env.PORT || 5000;

// Test route
app.get("/", (req, res) => {
  res.send("IT Asset & Support Management System API is running");
});

// Handle unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || err.statusCode || 500).json({
    message:
      err.status === 400 || err.statusCode === 400
        ? "Invalid request"
        : "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
