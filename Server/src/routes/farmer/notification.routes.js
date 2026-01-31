const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const notificationController = require('../controllers/notification.controller');

router.get('/', auth, notificationController.getNotifications);
router.put('/:id/seen', auth, notificationController.markAsSeen);
router.post('/', auth, notificationController.createNotification);

module.exports = router;
