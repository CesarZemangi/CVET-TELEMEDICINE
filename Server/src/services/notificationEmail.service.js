import User from "../models/user.model.js";
import { sendEmail } from "./email.service.js";

export const sendNotificationEmail = async (notification) => {
  try {
    const receiverId = notification?.receiver_id;
    if (!receiverId) return;

    const receiver = await User.findByPk(receiverId, {
      attributes: ["id", "email", "name", "status"]
    });
    if (!receiver?.email || receiver.status !== "active") return;

    const subject = notification?.title || `CVET Notification (${notification?.type || "update"})`;
    const message = notification?.message || `You have a new ${notification?.type || "system"} notification in CVET.`;

    await sendEmail({
      user_id: receiver.id,
      to: receiver.email,
      subject,
      message
    });
  } catch (err) {
    console.error("NOTIFICATION EMAIL ERROR", err?.message || err);
  }
};
