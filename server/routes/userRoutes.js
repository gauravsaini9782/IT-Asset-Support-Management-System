const express = require("express");

const {
  getEmployees,
  updateEmployee,
  getAdmins,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all active administrators
router.get("/admins", protect, adminOnly, getAdmins);

// Get all employees
router.get("/", protect, adminOnly, getEmployees);

// Update an employee
router.put("/:id", protect, adminOnly, updateEmployee);

module.exports = router;
