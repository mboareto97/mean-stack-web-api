var config = require('config.json');
var express = require('express');
var router = express.Router();
var questionService = require('services/question.service');

// routes
router.post('/register', registerQuestion);
router.get('/', getAll);
router.put('/:_id', updateQuestion);
router.delete('/:_id', deleteQuestion);

module.exports = router;