const express = require('express');
const router = express.Router();
const { getWorkers, addWorker, getRecentWorkers, updateWorker, deleteWorker } = require('../controllers/workerController');

router.get('/', getWorkers);
router.post('/', addWorker);
router.get('/recent', getRecentWorkers);
router.put('/:epfNumber', updateWorker);
router.delete('/:epfNumber', deleteWorker);

module.exports = router;