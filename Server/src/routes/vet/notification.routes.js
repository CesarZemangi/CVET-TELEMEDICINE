const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const notificationVetController = require('../controllers/notificationVet.controller');

router.get('/', auth, role('vet'), notificationVetController.getVetNotifications);
router.put('/:id/seen', auth, role('vet'), notificationVetController.markVetNotificationAsSeen);

module.exports = router;
