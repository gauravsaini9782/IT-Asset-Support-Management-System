const Ticket = require("../models/Ticket");
const Asset = require("../models/Asset");
const User = require("../models/User");
const Comment = require("../models/Comment");

// Employee creates a support ticket
const createTicket = async (req, res) => {
  try {
    const { title, description, category, relatedAsset } = req.body;

    // Validate required fields
    if (!title || !description || !category || !relatedAsset) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // Check that the asset belongs to the logged-in employee
    const asset = await Asset.findOne({
      _id: relatedAsset,
      assignedTo: req.user.id,
      status: "assigned",
    });

    if (!asset) {
      return res.status(403).json({
        message: "You can only create tickets for your assigned assets",
      });
    }

    // Create the ticket
    const ticket = await Ticket.create({
      title,
      description,
      category,
      relatedAsset: asset._id,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get tickets created by the logged-in employee
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      createdBy: req.user.id,
    })
      .populate("relatedAsset", "assetName assetTag category")
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Admin views all support tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("createdBy", "name email department")
      .populate("relatedAsset", "assetName assetTag category")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Assign a support ticket to an IT administrator
const assignTicket = async (req, res) => {
  try {
    const { adminId } = req.body;

    // Allow an administrator to unassign a ticket
    if (adminId === null) {
      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        { $set: { assignedTo: null } },
        { returnDocument: "after", runValidators: true },
      );

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      return res.status(200).json({
        message: "Ticket unassigned successfully",
        ticket,
      });
    }

    // Require an administrator ID for assigning a ticket
    if (!adminId) {
      return res.status(400).json({
        message: "Administrator ID is required",
      });
    }

    // Check that the selected user is an active administrator
    const admin = await User.findOne({
      _id: adminId,
      role: "admin",
      accountStatus: "active",
    });

    if (!admin) {
      return res.status(404).json({
        message: "Active administrator not found",
      });
    }

    // Assign the ticket
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedTo: admin._id },
      { returnDocument: "after", runValidators: true },
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      message: "Ticket assigned successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Admin updates the priority of a support ticket
const updateTicketPriority = async (req, res) => {
  try {
    const { priority } = req.body;

    // Validate the priority
    const allowedPriorities = ["low", "medium", "high"];

    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Priority must be low, medium, or high",
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: { priority } },
      { returnDocument: "after", runValidators: true },
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      message: "Ticket priority updated successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Admin updates the status of a support ticket
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["open", "in progress", "resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be open, in progress, or resolved",
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status,
          resolvedAt: status === "resolved" ? new Date() : null,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      message: "Ticket status updated successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Add a comment to a support ticket
const addTicketComment = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate comment text
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "Comment message is required",
      });
    }

    // Find the support ticket
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // Employees can only comment on their own tickets
    if (
      req.user.role === "employee" &&
      ticket.createdBy.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You cannot comment on another employee's ticket",
      });
    }

    // Save the comment
    const comment = await Comment.create({
      ticket: ticket._id,
      author: req.user.id,
      message: message.trim(),
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get all comments for a support ticket
const getTicketComments = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // Employees can only view comments on their own tickets
    if (
      req.user.role === "employee" &&
      ticket.createdBy.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        message: "You cannot view another employee's ticket comments",
      });
    }

    const comments = await Comment.find({
      ticket: ticket._id,
    })
      .populate("author", "name role")
      .sort({ createdAt: 1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getAllTickets,
  assignTicket,
  updateTicketPriority,
  updateTicketStatus,
  addTicketComment,
  getTicketComments,
};
