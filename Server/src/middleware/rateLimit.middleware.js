import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import SystemLog from '../models/systemLog.model.js';
import logger from '../utils/logger.js';

const logViolation = async (req, type) => {
    const userId = req.user?.id || null;
    const ip = req.ip;
    const message = `Rate limit exceeded for ${type} by ${userId ? `user ${userId}` : `IP ${ip}`}`;
    
    logger.warn(message);
    
    try {
        await SystemLog.create({
            user_id: userId,
            action: message
        });
    } catch (err) {
        logger.error(`Failed to log rate limit violation: ${err.message}`);
    }
};

export const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    message: { message: "Too many login attempts, please try again after a minute" },
    handler: (req, res, next, options) => {
        logViolation(req, 'Auth');
        res.status(options.statusCode).send(options.message);
    }
});

export const messageLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30,
    message: { message: "Message rate limit exceeded. Please slow down." },
    keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
    handler: (req, res, next, options) => {
        logViolation(req, 'Messages');
        res.status(options.statusCode).send(options.message);
    }
});

export const caseCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { message: "Case creation limit reached. Please try again in an hour." },
    keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
    handler: (req, res, next, options) => {
        logViolation(req, 'Case Creation');
        res.status(options.statusCode).send(options.message);
    }
});
