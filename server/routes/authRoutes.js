const express = require("express");
const adminOnly = require("../middleware/roleMiddleware");
const {
  registerUser,
  loginUser,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});
router.get("/admin-test", protect, adminOnly, (req, res) => {
  res.status(200).json({
    message: "Admin access successful",
  });
});

module.exports = router;