import { verifyToken } from "../utils/jwt.js";
import User from "../models/user.model.js";

// This allows: import { authenticate } from ...
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = verifyToken(token);

    // fetch current user to enforce active status and existence
    const user = await User.findByPk(decoded.id, { paranoid: false });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (user.status && user.status !== "active") {
      return res.status(401).json({ error: "Account is deactivated" });
    }

    req.user = { ...decoded, status: user.status };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
    next();
  };
};

// This allows: import auth from ...
export default authenticate;
