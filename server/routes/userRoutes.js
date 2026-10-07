const express = require("express");
const {
  getEmployees,
  updateEmployee,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, getEmployees);
router.put("/:id", protect, adminOnly, updateEmployee);
module.exports = router;
