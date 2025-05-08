const express = require('express');
const router = express.Router();
const { getWorkers, addWorker, getRecentWorkers } = require('../controllers/workerController');

router.get('/', getWorkers);
router.post('/', addWorker);
router.get('/recent', getRecentWorkers);

module.exports = router;