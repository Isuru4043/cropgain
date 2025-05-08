const express = require('express');
const router = express.Router();
const { getSalaries, addSalary, updateSalary, deleteSalary } = require('../controllers/salaryController');

router.get('/', getSalaries);
router.post('/', addSalary);
router.put('/:id', updateSalary);
router.delete('/:id', deleteSalary);

module.exports = router;