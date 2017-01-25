
//
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var mysql = require('mysql');
//var connection = require("express-myconnection");
var dbconfig = require('./dbconfig.js');
var conn = mysql.createConnection(dbconfig.connection);
conn.query('USE ' + dbconfig.database);

server.listen(process.env.PORT || 5000);

/*app.use(connection(mysql, {
	host: "localhost",
	user: "root",
	password: "",
	database: "stlmetroinfo",
	}, 'request')); */

	//commands to access database


//location getting
io.sockets.on('connection', function (socket) {
  socket.on('location', function (data) {
    io.sockets.emit('location', data);
  });
  socket.on('getBusStop', function() {
  	var query = 'SELECT * FROM bus_stop ';
        //console.log('Getting Past ' + numFrames + ' Frames For System ID: ' + systemID);
        //var frames = [];
        conn.query(query, function(err, rows) {
            if (err)
                console.log(err);
            // NOT GOOD, pass socket into method and send data back.
            // GOOD, return code from method and use socket from app.js
            //socket.emit('returnFrames', rows); 
            socket.emit('returnBusStop', rows);
        });
    });
  socket.on('returnTime', function(data) {
  	var query = 'INSERT INTO time(time, location) VALUES('+data.time+','+data.location+')';
  })
});

// For serving static files inside ./client
app.use(require('express').static(__dirname + '/client'));

// For hosing on Heroku 
/*   io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
  io.set('log level', 1)
});   */