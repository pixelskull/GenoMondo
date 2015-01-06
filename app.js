//express.js
var express = require('express');
var app = express();
//socket.io
var io  = require('socket.io')(server);

// functions
var css       = function(req, res) { res.sendFile(__dirname+'/public/css/demo.css'); };
var printCss  = function(req, res) { res.sendFile(__dirname+'/public/css/demo-print.css'); };
var raphael   = function(req, res) { res.sendFile(__dirname+'/public/js/raphael.js'); };
var graffle   = function(req, res) { res.sendFile(__dirname+'/public/js/graffle.js'); };
var menu      = function(req, res) { res.sendFile(__dirname+'/public/js/menu.js'); };

var home = function(req, res) {};
var workspace = function(req, res){ res.sendFile(__dirname+'/public/html/workspace.html'); };

// routing
app.get('/demo.css', css);
app.get('/demo-print.css', printCss);
app.get('/raphael.js', raphael);
app.get('/graffle.js', graffle);
app.get('/menu.js', menu); 

app.get('/', home);
app.get('/workspace', workspace);

io.sockets.on('connection', function(socket) {
  //Cleaning when User is disconnected
  socket.on('disconnect', function() {

  });
});

//server start
var server = app.listen(3000, function(){
  console.log("node up and running");
});
