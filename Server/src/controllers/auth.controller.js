import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/jwt.js";
import User from "../models/user.model.js";
import Farmer from "../models/farmer.model.js";
import Vet from "../models/vet.model.js";
import PasswordResetToken from "../models/passwordResetToken.model.js";
import { logAction } from "../utils/dbLogger.js";
import { sendEmail } from "../services/email.service.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userInstance = await User.findOne({
      where: { email: email.trim().toLowerCase() }
    });

    if (!userInstance) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = userInstance.get({ plain: true });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    await logAction(user.id, `User ${user.name} (${user.email}) logged in`);

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_image: user.profile_image
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
};

export const logout = async (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role || 'farmer'
    });

    if (user.role === 'vet') {
      await Vet.create({
        user_id: user.id,
        specialization: null,
        license_number: null,
        experience_years: 0
      });
    } else if (user.role === 'farmer') {
      await Farmer.create({
        user_id: user.id,
        farm_name: null,
        location: null,
        livestock_count: 0
      });
    }

    await logAction(user.id, `New user ${user.name} (${user.email}) registered with role ${user.role}`);

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("REGISTER ERROR", err);
    return res.status(500).json({
      message: "Registration failed",
      error: err.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, sms_opt_in } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ name, phone, sms_opt_in });

    await logAction(user.id, `User ${user.name} updated their profile`);

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        sms_opt_in: user.sms_opt_in,
        profile_image: user.profile_image
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    await logAction(userId, `User ${user.name} changed their password`);

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR", err);
    res.status(500).json({ error: err.message });
  }
};

const normalizeBaseUrl = (value) => String(value || "").trim().replace(/\/+$/, "");

const isLocalhostUrl = (value) => {
  const v = String(value || "").toLowerCase();
  return v.includes("localhost") || v.includes("127.0.0.1");
};

const getFrontendBaseUrl = (req) => {
  const configuredFrontend = normalizeBaseUrl(process.env.FRONTEND_URL);
  if (configuredFrontend) {
    return configuredFrontend;
  }

  const origins = String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((v) => normalizeBaseUrl(v))
    .filter(Boolean);
  const nonLocalOrigin = origins.find((origin) => !isLocalhostUrl(origin));
  if (nonLocalOrigin) {
    return nonLocalOrigin;
  }
  if (origins.length > 0) {
    return origins[0];
  }

  const reqOrigin = normalizeBaseUrl(req?.headers?.origin);
  if (reqOrigin) {
    return reqOrigin;
  }

  const host = normalizeBaseUrl(req?.headers?.["x-forwarded-host"] || req?.headers?.host);
  const proto = normalizeBaseUrl(req?.headers?.["x-forwarded-proto"]) || "https";
  if (host) {
    return `${proto}://${host}`;
  }

  return "http://localhost:5173";
};

export const forgotPassword = async (req, res) => {
  const genericMessage = "If the email is registered, a password reset link has been sent.";
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(200).json({ message: genericMessage });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({ message: genericMessage });
    }

    await PasswordResetToken.destroy({ where: { user_id: user.id } });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await PasswordResetToken.create({
      user_id: user.id,
      token,
      expires_at: expiresAt
    });

    const frontendBase = getFrontendBaseUrl(req);
    const resetLink = `${frontendBase}/reset-password?token=${encodeURIComponent(token)}`;
    const subject = "CVET Password Reset";
    const message = `You requested a password reset. Use this link within 1 hour: ${resetLink}`;
    const html = `
      <p>You requested a password reset.</p>
      <p>This link expires in 1 hour.</p>
      <p><a href="${resetLink}">Reset Password</a></p>
      <p>If you did not request this, ignore this email.</p>
    `;
    const emailResult = await sendEmail({
      user_id: user.id,
      to: user.email,
      subject,
      message,
      html
    });

    if (!emailResult?.messageId && !emailResult?.mocked) {
      throw new Error("Email transport did not confirm delivery.");
    }

    if (process.env.NODE_ENV !== "production" && emailResult?.mocked) {
      console.warn(`DEV RESET LINK for ${user.email}: ${resetLink}`);
    }
    if (process.env.NODE_ENV !== "production" && String(process.env.EXPOSE_RESET_LINK_IN_DEV || "").toLowerCase() === "true") {
      return res.status(200).json({ message: genericMessage, dev_reset_link: resetLink });
    }
    return res.status(200).json({ message: genericMessage });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR", err);
    return res.status(200).json({ message: genericMessage });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = String(req.body?.token || "").trim();
    const newPassword = String(req.body?.newPassword || "");
    const confirmPassword = String(req.body?.confirmPassword || "");

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Token and password fields are required." });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const resetRow = await PasswordResetToken.findOne({ where: { token } });
    if (!resetRow) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }
    if (new Date(resetRow.expires_at) <= new Date()) {
      await resetRow.destroy();
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    const user = await User.findByPk(resetRow.user_id);
    if (!user) {
      await resetRow.destroy();
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
    await PasswordResetToken.destroy({ where: { user_id: user.id } });
    await logAction(user.id, `User ${user.email} reset password via email token`);

    return res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    console.error("RESET PASSWORD ERROR", err);
    return res.status(500).json({ message: "Failed to reset password." });
  }
};
