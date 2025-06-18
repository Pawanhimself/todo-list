const express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

var items = []

app.get('/', function(req, res){
    res.render('list',{items});
});

app.post('/',function(req, res){
    let taskVal = req.body.task;
    let item = {task: taskVal, status:"pending"}
    items.push(item);
    res.redirect('/');     
});

app.get('/delete-task', function(req, res){
    items.splice( req.query.item, 1);
    res.redirect('/');
});

app.get('/update-task-status', function(req, res){
    let taskIndex  = req.query.index
    let taskStatus = items[taskIndex].status;
    
    if( taskStatus == 'completed'){
        items[taskIndex].status = 'pending';
    } else {
        items[taskIndex].status = 'completed';
    }

    res.redirect('/');
});

app.post('/update-task', function(req,res){
    let taskUpdatedVal = req.body.task;
    let taskIndex = parseInt(req.body.index);
    console.log(taskUpdatedVal);
    console.log(taskIndex);
    items[taskIndex].task = taskUpdatedVal;
    res.redirect('/');
});

app.listen(3000, function(){
    console.log('server is running perfectly');
});