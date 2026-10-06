const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// Test route
app.get("/", (req, res) => {
  res.send("IT Asset & Support Management System API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
