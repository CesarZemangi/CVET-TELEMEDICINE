import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

// Safety check: Stop the server if the secret is missing in production
if (!SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const FINAL_SECRET = SECRET || "dev_secret_only";

export const generateToken = (payload) => {
  return jwt.sign(payload, FINAL_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, FINAL_SECRET);
  } catch (error) {
    // Re-throwing allows your middleware to catch it, 
    // but you could log the specific error here for debugging
    throw error;
  }
};