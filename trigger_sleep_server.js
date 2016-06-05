'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();
var ip = "";

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

var http = require('http');
var fs = require('fs');
var url = require('url');
const exec = require('child_process').exec;

var server = http.createServer( function (req, res) {
  // if (req.method == 'POST') {
  //   console.log("Sleep Triggered");
  //   const child = exec('~/sleep/sleep.command');
  //   res.end();
  // }

  var queryData = url.parse(req.url, true).query;

  if (queryData.c) {
    switch (queryData.c) {
      case "sleep":
        var z = exec('osascript -e \'tell application "Finder" to sleep\'');
        console.log("Sleep");
        break;

        case "wake":
          var z = exec('caffeinate -u -t 1');
          console.log("Wake");
          break;

        case "up":
          var z = exec('osascript -e \'set currentVolume to output volume of (get volume settings)\' -e \'set volume output volume (currentVolume + 10)\'');
          console.log("Volume Up");
          break;

        case "down":
          var z = exec('osascript -e \'set currentVolume to output volume of (get volume settings)\' -e \'set volume output volume (currentVolume - 10)\'');
          console.log("Volume Down");
          break;

        case "mute":
          var z = exec('osascript -e "set Volume 0"');
          console.log("Mute");
          break;

        case "tab":
          var z = exec('osascript -e "tell application \"Firefox\" to activate keystroke {tab} using {command down}"');
          console.log("Tab");
          break;

        case "pause":
          var z = exec('osascript -e \'tell application "VLC" to play\'');
          // var z = exec('osascript -e \'if isAppLoaded("VLC") then tell application "VLC" to play\'');
          // var z = exec('osascript -e \'if isAppLoaded("iTunes") then tell application "iTunes" to playpause\'');
          console.log("Pause");
          break;

      default:
        break;
    }

    // return page
    var index = fs.readFileSync('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);

  } else {
    // console.log("Web Page Triggered");

    // return page
    var index = fs.readFileSync('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
  }

});

server.listen(8080);

console.log("Server Running on http://" + ip + ":8080");
