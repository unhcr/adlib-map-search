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
`grunt build` - Builds the application into the dist folder (minifies and merges assets). 


## Application Structure

The application was developed using a Yeoman webapp scaffold. It uses grunt as a local websever and to run tasks including minifiyng and merging assets on build. 


**app/** - development folder.

**app/index.html** - main html page.

**app/scripts/main.js** - application javascript file.


**bower_components/*** - external assets installed through bower, e.g. d3.js



**dist/** - distribution folder 



## External Assets
* d3.js - https://github.com/d3/d3/wiki/Gallery
* select2 - https://select2.github.io/
* jquery - https://github.com/jquery/jquery
* modernizer - https://github.com/Modernizr/Modernizr
* svg-pan-zoom - https://github.com/ariutta/svg-pan-zoom
