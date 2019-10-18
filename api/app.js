const express = require('express');
const app = express();

const {mongoose} = require('./db/mogoose');

const bodyParser = require('body-parser');

const { List, Task } = require('./db/models');
// const { List } = require('./db/models/list.model');
// const { Task } = require('./db/models/list.task');

app.use(bodyParser.json());

// app.get('/lists', (req, res) => {
//     // res.send('henlo');
// })

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
/*
*/
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
/*
*/
app.patch('/lists/:id', (req, res) => {
    List.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body 
    }).then(() => {
            res.sendStatus(200);
    });
});
//  DELETE
/*
*/
app.delete('/lists/:id', (req, res) => {
    List.findOneAndRemove({ 
        _id: req.params.id 
    }).then((removedListDoc) => {
            res.sendStatus(removedListDoc);
    });
});
/*
*/
app.listen(3000, ()=> {
    console.log("server is listening on port 3000");
})