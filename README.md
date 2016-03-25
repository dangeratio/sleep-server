# sleep-server
#

This is a simple nodejs webserver that triggers a "sleep" command in osx.  I use it to "sleep" my computer from my phone via a web server.

##To Install##

* First install <a href="https://nodejs.org/en/">node.js</a>
* Next download the scripts into the current osx users directory under a "sleep" folder (if the user is joe the folder you put the scripts in will be /Users/joe/sleep/, alternately you can modify trigger_sleep_server.js)
* Run start_server.command and press ⌘H to hide

##Optionally, to run on startup##

* Add start_server.command to the users "login items" under  -> System Preferences -> Users & Groups -> Select User -> Login Items tab
