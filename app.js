//express.js
var express = require('express');
var app = express();
//socket.io
var io  = require('socket.io')(server);

// functions
var css       = function(req, res) { res.sendFile(__dirname+'/public/css/demo.css'); },
    raphael   = function(req, res) { res.sendFile(__dirname+'/public/js/raphael.js'); },
    hammer    = function(req, res) { res.sendFile(__dirname+'/public/js/hammer.min.js'); },
    graffle   = function(req, res) { res.sendFile(__dirname+'/public/js/graffle.js'); },
    menu      = function(req, res) { res.sendFile(__dirname+'/public/js/menu.js'); },
    person    = function(req, res) { res.sendFile(__dirname+'/public/js/person.js'); },
    relation  = function(req, res) { res.sendFile(__dirname+'/public/js/relation.js'); },
    socket    = function(req, res) { res.sendFile(__dirname+'/public/js/socket.io.js'); };


var home = function(req, res) {};
var workspace = function(req, res){ res.sendFile(__dirname+'/public/html/workspace.html'); };

// routing
app.get('/demo.css', css);
app.get('/raphael.js', raphael);
app.get('/graffle.js', graffle);
app.get('/menu.js', menu);
app.get('/hammer.min.js', hammer);
app.get('/person.js', person);
app.get('/relation.js', relation);
app.get('/socket.io.js', socket);


// app.get('/', home);
app.get('/', workspace);

io.sockets.on('connection', function(socket) {
  //Cleaning when User is disconnected
  socket.on('disconnect', function() {

  });
});

//server start
var server = app.listen(3000, function(){
  console.log("node up and running");
});
