'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();
var ip = "";
var path = require("path");

var add_to_response = "";

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }
    if (alias >= 1) {
      ip = iface.address;
    } else {
      ip = iface.address;
    }
    ++alias;
  });
});


// webserver variables
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
const exec = require('child_process').exec;


// get movie list
const folder = '/Volumes/Movies/';
fs.readdir(folder, (err, files) => {
  files.forEach(file => {
    if ( file[0] != '.' ) {
      add_to_response = add_to_response + "<div class='file-item'>" + file + "</div>";
    }
  });
})


// handle post form submission
function processPost(request, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function') return null;

    if(request.method == 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            request.post = querystring.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}


// handle button events
function trigger_command(obj, query, file) {
  switch (obj) {
    case "sleep":
      var z = exec('osascript -e \'tell application "Finder" to sleep\'');
      process.stdout.write("sleep.");
      break;
    case "wake":
      var z = exec('caffeinate -u -t 1');
      process.stdout.write("wake.");
      break;
    case "up":
      var z = exec('osascript -e \'set currentVolume to output volume of (get volume settings)\' -e \'set volume output volume (currentVolume + 10)\'');
      // osascript -e 'set currentVolume to output volume of (get volume settings)' -e 'set volume output volume (currentVolume + 10)'
      process.stdout.write("volume up.");
      break;
    case "down":
      var z = exec('osascript -e \'set currentVolume to output volume of (get volume settings)\' -e \'set volume output volume (currentVolume - 10)\'');
      process.stdout.write("volume down.");
      break;
    case "mute":
      var z = exec('osascript -e "set Volume 0"');
      process.stdout.write("mute.");
      break;
    case "tab":
      var z = exec('osascript -e "tell application \"Firefox\" to activate keystroke {tab} using {command down}"');
      process.stdout.write("tab.");
      break;
    case "pause":
      var z = exec('osascript -e \'tell application "VLC" to play\'');
      process.stdout.write("pause.");
      break;
    case "vlckill":
      var z = exec('osascript -e \'tell application "VLC" to quit\'');
      process.stdout.write("quit vlc.");
      break;
    case "vlcfull":
      var z = exec('osascript -e \'tell application "VLC" to fullscreen\'');
      process.stdout.write("fullscreen.");
      break;
    case "file":
      var exec_path = "/Applications/VLC.app/Contents/MacOS/VLC";
      file = file.replace(/ /g, "\ ");
      var file_path = '/Volumes/Movies/' + file;
      var script = '' + exec_path + ' \"' + file_path + '"';
      var z = exec(script);

      console.log(file_path);
      console.log(script);

      process.stdout.write("play file:" + file_path + "|");
      break;
    default:
      break;
  }
}


var server = http.createServer(function(req, res) {

    if(req.method == 'POST') {
        processPost(req, res, function() {
            //console.log(req.post);
            if ( req.post != null ) {
              trigger_command(req.post.c, req.post.query, req.post.file);
            }

            // return page
            var index = fs.readFileSync(__dirname + '/index.html');
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.end(index + "<div class='container-fluid'><div class='row pad'><div class='file-list'>" + add_to_response + "</div></div></div></body></html>");

          }
        );
    } else {
      // return page
      var index = fs.readFileSync(__dirname + '/index.html');
      res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
      res.end(index + "<div class='container-fluid'><div class='row pad'><div class='file-list'>" + add_to_response + "</div></div></div></body></html>");
    }

});

server.listen(80, ip);

console.log("Server Running on http://" + ip + ":80");
console.log("Server Running on http://" + os.hostname() + ":80");
