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

function registerQuestion(req, res) {
    questionService.create(req.body)
        .then(function () {
            res.sendStatus(200);
            res._id;
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteQuestion(req, res) {
    questionService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
            res._id;
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}