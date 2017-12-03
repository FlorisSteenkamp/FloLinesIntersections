[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/FlorisSteenkamp/FloLinesIntersections.svg?branch=master)](https://travis-ci.org/FlorisSteenkamp/FloPoly)
[![Coverage Status](https://coveralls.io/repos/github/FlorisSteenkamp/FloLinesIntersections/badge.svg?branch=master)](https://coveralls.io/github/FlorisSteenkamp/FloLinesIntersections?branch=master)

Find real polynomial roots from degree 2 (quadratic) up to about degree 20 as
accurately and as fast as possible, e.g.  
```javascript
let ls = [
	[[1,1],     [0,0]], 
	[[0,1],     [1,0]],
	[[0.1,0],   [0.1,1]]
];
FloLinesIntersections(ls); //=> [
	{p: [0.5, 0.5], l1, l2}, {p: [0.1, 0.09999999999999998], l1, l2}, {p: [0.1, 0.9], l1, l2}	
```

# Features
* Fast
* Results preserves 
* Functional

# Documentation, Benchmarks and more
Please visit [the site](http://mat-demo.appspot.com/#!/lines-intersections).

# Installation

## Node (or the browser) 

```cli
npm install flo-lines-intersections
```

## Browser

### Direct
Download the [minified script file](https://github.com/FlorisSteenkamp/FloPoly/blob/master/dist/flo-poly.min.js) and include it in your project:
```html 
<script src='[path-to-file]/flo-poly.min.js'></script>
```
There is also a [map file](https://github.com/FlorisSteenkamp/FloPoly/blob/master/dist/flo-poly.min.js.map) and a [non-minified version](https://github.com/FlorisSteenkamp/FloPoly/blob/master/dist/flo-poly.js) available.

### Bower

From the command line, navigate to your project root and type:
```cli
bower install flo-poly --save
```
Include the script in your project:
```html
<script src='bower_components/flo-poly/dist/flo-poly.min.js'></script>
```

# Usage

## Node
```javascript
var FloPoly = require("flo-poly");
```

## Browser

After having included the script file in your HTML there will be a new global viariable available called `FloPoly` that represents the library. See the [docs](http://mat-demo.appspot.com/#!/test-polynomials#docs).

# License

[MIT](https://opensource.org/licenses/MIT)
