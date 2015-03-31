var socket = require('socket.io'); 
var express = require('express'); 
var http = require('http'); 

var app = express(); 
var server = http.createServer(app);

var io = socket.listen(server); 

// functions
var css       = function(req, res) { res.sendFile(__dirname+'/public/css/demo.css'); },
    raphael   = function(req, res) { res.sendFile(__dirname+'/public/js/raphael.js'); },
    hammer    = function(req, res) { res.sendFile(__dirname+'/public/js/hammer.min.js'); },
    graffle   = function(req, res) { res.sendFile(__dirname+'/public/js/graffle.js'); },
    menu      = function(req, res) { res.sendFile(__dirname+'/public/js/menu.js'); },
    person    = function(req, res) { res.sendFile(__dirname+'/public/js/person.js'); },
    relation  = function(req, res) { res.sendFile(__dirname+'/public/js/relation.js'); };
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
	console.log('a user is connected')
  //Cleaning when User is disconnected
  
  socket.on('newPerson', function(person) {
	console.log('newPerson');   
	console.log(person); 
	socket.broadcast.emit('newPerson', person);
  }); 
  
  socket.on('newRelation', function(relation) {
  	console.log('newRelation'); 
  	console.log(relation);
  	socket.broadcast.emit('newRelation', relation);
  }); 
  
  socket.on('deleteElement', function(elementID) {
	  console.log('deleteElement'); 
	  console.log(elementID);
	  socket.broadcast.emit('deleteElement', elementID); 
  }); 
  
  socket.on('disconnect', function() {
  	console.log('a user is disconnected');
  });
});

//server start
server.listen(3000, '127.0.0.1', function(){
  console.log("node up and running");
});
