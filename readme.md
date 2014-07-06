# sonoshue

> A command line tool (daemon) that changes the color of hue bulbs to the currently playing album art from a sonos player.

## Warning

This is just a small project of mine. It is only tested with my setup and there is no guaranty that it will work for you.

## Install
```
git clone https://github.com/aslansky/sonoshue.git
cd sonoshue
npm install
```

## Usage
```
// help
./bin/sonoshue --help
./bin/sonoshue info --help
./bin/sonoshue listen --help

// show info about your hue
./bin/sonoshue info

// start listening
./bin/sonoshue listen -b 1 -b 2 -b 3 -l <your local ip address>
```
