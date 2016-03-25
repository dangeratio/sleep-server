var http = require('http');
var fs = require('fs');
const exec = require('child_process').exec;

var server = http.createServer( function (req, res) {
  if (req.method == 'POST') {
    console.log("Sleep Triggered");
    const child = exec('~/sleep/sleep.command');
    res.end();
  }
  else if(req.method == 'GET') {
    console.log("Web Page Triggered");
    var index = fs.readFileSync('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
  }
});

server.listen(8080);

console.log("Server Running on Port 8080");
