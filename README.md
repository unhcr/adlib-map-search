# adlib-map-search
Project initiated by Alwyn Greer. Map search component developed by Matthew Smawfield.

## Setup (mac)
1. clone repository
2. `npm install`
3. `bower install`


## Grunt 

### How to run the local server

`grunt serve` - Runs a local server and opens the browser automatically. 

### Build into a distributable
`grunt build` - This builds the application into the dist folder. See gruntfile.js for more details on the tasks and configuation. (minifies and merges assets). 


## Application Structure

The application was developed using a Yeoman webapp scaffold. It uses grunt as a local websever and to run tasks including minifiyng and merging assets on build. 


**app/** - this is the main development folder. this is where you should work. 

**app/index.html** - main index html page

**app/scripts/main.js** - this contains the main application javascript code for the map and slider.


**bower_components/*** - external assets installed through bower, e.g. d3.js. see below for details. 



**dist/** - distribution folder. this is where all the minified and merged js and css files are placed after the `grunt build` task is executed on the terminal. 



## External Assets
* d3.js - https://github.com/d3/d3/wiki/Gallery
* select2 - https://select2.github.io/
* jquery - https://github.com/jquery/jquery
* modernizer - https://github.com/Modernizr/Modernizr
* svg-pan-zoom - https://github.com/ariutta/svg-pan-zoom
