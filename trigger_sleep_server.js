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
        console.log("Sleep Triggered");
        break;

        case "wake":
          var z = exec('caffeinate -u -t 1');
          console.log("Wake Triggered");
          break;

        case "up":
          var z = exec('osascript -e \'set currentVolume to output volume of (get volume settings)\' -e \'set volume output volume (currentVolume + 10)\'');
          console.log("Volume Up Triggered");
          break;

        case "down":
          var z = exec('osascript -e \'set currentVolume to output volume of (get volume settings)\' -e \'set volume output volume (currentVolume - 10)\'');
          console.log("Volume Down Triggered");
          break;

        case "mute":
          var z = exec('osascript -e "set Volume 0"');
          console.log("Mute Triggered");
          break;

        case "tab":
          var z = exec('osascript -e "tell application \"Firefox\" to activate keystroke {tab} using {command down}"');



          console.log("Tab Switch Triggered");
          break;

      default:
        break;
    }

    // return page
    var index = fs.readFileSync('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);

  } else {
    console.log("Web Page Triggered");

    // return page
    var index = fs.readFileSync('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
  }

  console.log("Done\n");
});

server.listen(8080);


console.log("Server Running on Port 8080");
