const User = require("../models/User");

// Get all employee accounts
const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update an employee account
const updateEmployee = async (req, res) => {
  try {
    const { name, department, accountStatus } = req.body;

    const employee = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "employee",
      },
      {
        name,
        department,
        accountStatus,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getEmployees,
  updateEmployee,
};
