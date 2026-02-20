import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';
import Message from '../models/message.model.js';
import Case from '../models/case.model.js';
import VideoSession from '../models/videoSession.model.js';
import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';
import Vet from '../models/vet.model.js';

let io;

const socketService = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    try {
      const decoded = verifyToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id} (${socket.user.role})`);
    
    // Join a private room for the user to receive direct notifications
    socket.join(`user_${socket.user.id}`);

    socket.on('join_case', async ({ case_id }) => {
      try {
        const caseRecord = await Case.findByPk(case_id, {
          include: [{ model: Vet, as: 'vet', attributes: ['user_id'] }]
        });
        if (!caseRecord) {
          return socket.emit('error', { message: 'Case not found' });
        }

        if (socket.user.role === 'farmer' && caseRecord.farmer_id !== socket.user.id) {
          return socket.emit('error', { message: 'Unauthorized access to this case' });
        }
        if (socket.user.role === 'vet' && caseRecord.vet?.user_id !== socket.user.id) {
          return socket.emit('error', { message: 'Unauthorized access to this case' });
        }
        
        socket.join(`case_${case_id}`);
        console.log(`User ${socket.user.id} joined case_${case_id}`);
      } catch (error) {
        socket.emit('error', { message: 'Internal server error' });
      }
    });

    socket.on('send_message', async ({ receiver_id, case_id, message }) => {
      try {
        let target_receiver_id = receiver_id;

        if (case_id && !target_receiver_id) {
          const caseRecord = await Case.findByPk(case_id, {
            include: [{ model: Vet, as: 'vet', attributes: ['user_id'] }]
          });
          if (caseRecord) {
            if (socket.user.role === 'farmer') target_receiver_id = caseRecord.vet?.user_id;
            else if (socket.user.role === 'vet') target_receiver_id = caseRecord.farmer_id;
          }
        }

        if (!target_receiver_id) return;

        // Access validation
        if (socket.user.role === 'farmer') {
          const isAssigned = await Case.findOne({ 
            include: [{
              model: Vet,
              as: 'vet',
              where: { user_id: target_receiver_id }
            }],
            where: { farmer_id: socket.user.id } 
          });
          if (!isAssigned) {
            return socket.emit('error', { message: 'You can only message assigned vets' });
          }
        } else if (socket.user.role === 'vet') {
          const isAssigned = await Case.findOne({ 
            include: [{
              model: Vet,
              as: 'vet',
              where: { user_id: socket.user.id }
            }],
            where: { farmer_id: target_receiver_id } 
          });
          if (!isAssigned) {
            return socket.emit('error', { message: 'You can only message farmers assigned through cases' });
          }
        }

        const newMessage = await Message.create({
          case_id: case_id || null,
          sender_id: socket.user.id,
          receiver_id: target_receiver_id,
          message: message.substring(0, 1000),
          is_read: false
        });

        // Add sender info for UI
        const sender = await User.findByPk(socket.user.id, { attributes: ['id', 'name', 'profile_pic'] });
        const messageWithSender = { ...newMessage.toJSON(), sender };

        // Emit to the specific case room if exists
        if (case_id) {
          io.to(`case_${case_id}`).emit('receive_message', messageWithSender);
        }
        
        // Always emit to individual user rooms for global chat/notifications
        io.to(`user_${target_receiver_id}`).emit('receive_message', messageWithSender);
        socket.emit('receive_message', messageWithSender); // Echo back to sender

        // Create and emit notification
        const notification = await Notification.create({
          receiver_id: target_receiver_id,
          type: "chat",
          reference_id: newMessage.id,
          is_read: false
        });

        io.to(`user_${target_receiver_id}`).emit('receive_notification', notification);
        
        // Update unread count
        const unreadCount = await Message.count({ where: { receiver_id: target_receiver_id, is_read: false } });
        io.to(`user_${target_receiver_id}`).emit('update_unread_count', { count: unreadCount });

      } catch (error) {
        console.error('Socket send_message error:', error);
      }
    });

    socket.on('typing', ({ case_id, isTyping }) => {
      socket.to(`case_${case_id}`).emit('typing', {
        user_id: socket.user.id,
        isTyping
      });
    });

    // WebRTC signaling
    socket.on('video_call_start', async ({ case_id }) => {
      try {
        const caseRecord = await Case.findByPk(case_id);
        if (!caseRecord) return;

        // Only allow assigned vet or farmer to start call
        if (socket.user.id !== caseRecord.farmer_id && socket.user.id !== caseRecord.vet_id) return;

        const session = await VideoSession.create({
          case_id,
          farmer_id: caseRecord.farmer_id,
          vet_id: caseRecord.vet_id,
          status: 'active'
        });

        socket.video_session_id = session.id;
        io.to(`case_${case_id}`).emit('video_call_started', { session_id: session.id, caller_id: socket.user.id });
      } catch (error) {
        console.error('Video call start error:', error);
      }
    });

    socket.on('video_offer', ({ case_id, offer }) => {
      socket.to(`case_${case_id}`).emit('video_offer', { offer, sender_id: socket.user.id });
    });

    socket.on('video_answer', ({ case_id, answer }) => {
      socket.to(`case_${case_id}`).emit('video_answer', { answer, sender_id: socket.user.id });
    });

    socket.on('ice_candidate', ({ case_id, candidate }) => {
      socket.to(`case_${case_id}`).emit('ice_candidate', { candidate, sender_id: socket.user.id });
    });

    socket.on('end_call', async ({ case_id, session_id }) => {
      try {
        const sid = session_id || socket.video_session_id;
        if (sid) {
          await VideoSession.update({
            ended_at: new Date(),
            status: 'ended'
          }, { where: { id: sid } });
        }
        io.to(`case_${case_id}`).emit('end_call', { sender_id: socket.user.id });
      } catch (error) {
        console.error('End call error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export default socketService;