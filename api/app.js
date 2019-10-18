const express = require('express');
const app = express();

const {mongoose} = require('./db/mogoose');

const bodyParser = require('body-parser');

const { List, Task } = require('./db/models');

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  

// GET
app.get('/lists', (req, res) => {
    // res.send('henlo');
    List.find().then((lists) => {
        res.send(lists);
    }).catch((e) => {
        res.send(e);
    });
})

// POST

app.post('/lists', (req, res) => {
    let title = req.body.title;
    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        res.send(listDoc);
    })
});
//  UPDATE

app.patch('/lists/:id', (req, res) => {
    List.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body 
    }).then(() => {
            res.sendStatus(200);
    });
});
//  DELETE

app.delete('/lists/:id', (req, res) => {
    List.findOneAndRemove({ 
        _id: req.params.id 
    }).then((removedListDoc) => {
            res.sendStatus(removedListDoc);
    });
});

app.get('/lists/:listId/tasks', (req, res) => {
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});

app.post('/lists/:listId/tasks', (req, res) => {
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    })
});

app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId,
    }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    })
});

app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndDelete({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDoc) => {
        res.sendStatus(removedTaskDoc);
    })
});

app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task);
    })
});

app.listen(3000, ()=> {
    console.log("server is listening on port 3000");
})