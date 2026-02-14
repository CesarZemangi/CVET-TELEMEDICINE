import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';
import Message from '../models/message.model.js';
import Case from '../models/case.model.js';
import VideoSession from '../models/videoSession.model.js';

const socketService = (server) => {
  const io = new Server(server, {
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

    socket.on('join_case', async ({ case_id }) => {
      try {
        const caseRecord = await Case.findByPk(case_id);
        if (!caseRecord) {
          return socket.emit('error', { message: 'Case not found' });
        }

        if (socket.user.role === 'farmer' && caseRecord.farmer_id !== socket.user.id) {
          return socket.emit('error', { message: 'Unauthorized access to this case' });
        }
        if (socket.user.role === 'vet' && caseRecord.vet_id !== socket.user.id) {
          return socket.emit('error', { message: 'Unauthorized access to this case' });
        }
        if (socket.user.role === 'admin') {
          return socket.emit('error', { message: 'Admins cannot join chat rooms' });
        }

        socket.join(`case_${case_id}`);
        console.log(`User ${socket.user.id} joined case_${case_id}`);
      } catch (error) {
        socket.emit('error', { message: 'Internal server error' });
      }
    });

    socket.on('send_message', async ({ case_id, message }) => {
      try {
        const caseRecord = await Case.findByPk(case_id);
        if (!caseRecord) return;

        if (socket.user.role === 'farmer' && caseRecord.farmer_id !== socket.user.id) return;
        if (socket.user.role === 'vet' && caseRecord.vet_id !== socket.user.id) return;

        const receiver_id = socket.user.role === 'farmer' ? caseRecord.vet_id : caseRecord.farmer_id;

        const newMessage = await Message.create({
          case_id,
          sender_id: socket.user.id,
          receiver_id,
          message: message.substring(0, 1000)
        });

        io.to(`case_${case_id}`).emit('receive_message', newMessage);
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

export default socketService;