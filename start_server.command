#!/bin/bash

SCRIPT="trigger_sleep_server.js"
SCRIPT_PATH="$( dirname "${BASH_SOURCE[0]}" )/$SCRIPT"
SSID="$( /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID/ {print substr($0, index($0, $2))}' )"

clear
echo "SSID:$SSID"
sudo node $SCRIPT_PATH
