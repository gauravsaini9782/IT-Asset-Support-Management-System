const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.accountStatus !== "active") {
      return res.status(403).json({
        message: "Account is inactive or no longer exists",
      });
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      accountStatus: user.accountStatus,
    };

    next();
  } catch (error) {
    res.status(401).json({
      message: "Not authorized, invalid token",
    });
  }
};

module.exports = protect;
