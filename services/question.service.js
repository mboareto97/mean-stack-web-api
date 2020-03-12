var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('questions');

var service = {};

service.getAll = getAll;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function create(questionParam) {
    var deferred = Q.defer();

    // validation
    db.questions.findOne(
        { question: questionParam.question },
        function (err, question) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (question) {
                // username already exists
                deferred.reject('Question "' + questionParam.question + '" is already taken');
            } else {
                createQuestion();
            }
        });

    function createQuestion() {
        db.questions.insert(
            question,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.questions.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function update(_id, questionParam) {
    var deferred = Q.defer();

    // validation
    db.questions.findById(_id, function (err, q) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if ( q.question !== questionParam.username) {
            // username has changed so check if the new username is already taken
            db.questions.findOne(
                { question: questionParam.question },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (q) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateQuestion();
                    }
                });
        } else {
            updateQuestion();
        }
    });

    function updateQuestion() {
        // fields to update
        var set = {
            question: questionParam.question
        };

        db.question.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function getAll(){
    db.questons.find({}).toArray(function(err, questions){
        if(err) deferred.reject(err.name + ': ' + err.message);

        if(questions) return deferred.promise;
    })
}