const express = require("express");

const {
  createTicket,
  getMyTickets,
  getAllTickets,
  assignTicket,
  updateTicketPriority,
  updateTicketStatus,
  addTicketComment,
  getTicketComments,
} = require("../controllers/ticketController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

const router = express.Router();

// Allow only employees
const employeeOnly = (req, res, next) => {
  if (req.user.role !== "employee") {
    return res.status(403).json({
      message: "Access denied. Employees only.",
    });
  }

  next();
};

// Employee creates a support ticket
router.post("/", protect, employeeOnly, createTicket);

// Employee views their own tickets
router.get("/my-tickets", protect, employeeOnly, getMyTickets);

// Admin views all support tickets
router.get("/", protect, adminOnly, getAllTickets);

// Admin assigns a support ticket to an IT administrator
router.patch("/:id/assign", protect, adminOnly, assignTicket);

// Admin updates ticket priority
router.patch("/:id/priority", protect, adminOnly, updateTicketPriority);
// Admin updates ticket status
router.patch("/:id/status", protect, adminOnly, updateTicketStatus);

// Employees and administrators can comment on tickets
router.post("/:id/comments", protect, addTicketComment);

// Employees and administrators can view ticket comments
router.get("/:id/comments", protect, getTicketComments);

module.exports = router;
