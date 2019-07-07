var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
    var todo = new Todo({
        text: request.body.text
    });

    todo.save().then((doc) => {
        response.send(doc);
    }, (e) => {
        response.status(400).send(e);
    }); 

});

app.get('/todos', (request, response) => {
    Todo.find().then((todos) => {
        response.send({todos});
    }, (e) => {
        response.status(400).send(e);
    });
});

app.get('/todos/:id', (request, response) => {
    var id = request.params.id;

    if(!ObjectID.isValid(id)) {
        return response.status(400).send();
    }

    Todo.findById(id).then((todo) => {
        if(!todo) {
           return response.status(400).send();
        }

        response.status(200).send({todo});
    }).catch((e) => {
        response.status(400).send();
    })
})

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};