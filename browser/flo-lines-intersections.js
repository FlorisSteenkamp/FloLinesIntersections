(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FloLinesIntersections = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var FloLinesIntersections = require('./lib/modified-bentley-ottmann.js');

module.exports = exports = FloLinesIntersections;

},{"./lib/modified-bentley-ottmann.js":2}],2:[function(require,module,exports){
'use strict';

//let LinkedList         = require('./linked-list.js');

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var segSegIntersection = require('./seg-seg-intersection.js');

// The slope tolerance at which two lines are considered either parallel 
// or colinear
var DELTA = 1e-10;

var EVENT_LEFT = 0;
var EVENT_RIGHT = 1;

/**
 * <p>
 * Returns true if the two given lines have an endpoint in common..
 * </p>
 * <p>
 * It is the default function for checking if the intersection between 
 * two lines should be ignored.
 * </p> 
 * @ignore
 * @param {number[][]} l1 - A line.
 * @param {number[][]} l2 - Another line.
 * @returns {boolean} True if any endpoints between the supplied lines 
 * coincide, false otherwise.
 */
function ignoreIntersectionIfEndpointsCoincide(l1, l2) {
  var _l = _slicedToArray(l1, 2),
      p1 = _l[0],
      p2 = _l[1];

  var _l2 = _slicedToArray(l2, 2),
      p3 = _l2[0],
      p4 = _l2[1];

  return p1[0] === p3[0] && p1[1] === p3[1] || p2[0] === p3[0] && p2[1] === p3[1] || p1[0] === p4[0] && p1[1] === p4[1] || p2[0] === p4[0] && p2[1] === p4[1];
}

/**
 * <p>
 * Find segment-segment intersections via a very fast modified version  
 * of the Bentley-Ottmann algorithm.
 * </p>
 * <p> 
 * In practice it almost always runs much much faster than 
 * Bentley-Ottmann. Even when there are tens of thousands
 * of line segments with hundreds of thousands of intersection the  
 * Bentley-Ottmann algorithm still do not come close even though it has
 * a better asymptotic O((n+k)log-n) run time (where k is the 
 * number of intersections and n is the number of lines).
 * </p>
 * <p>
 * The algorithm is the same as Bentley-Ottmann except that it replaces
 * a binary tree in the implementation with a flat linked list. 
 * </p>
 * <p>
 * See http://geomalgorithms.com/a09-_intersect-3.html
 * </p>
 * @param {number[][][]} ls - An array of line segments.
 * @param {function|boolean} ignoreIntersectionFunc - If set to true
 * line segments with coinciding endpoints' intersection will be 
 * ignored. If falsey, all intersections will be returned. If a function 
 * is provided (taking as parameters 2 lines and returns true if the 
 * intersection between those two lines should be ignored) then those
 * intersections for which the function returns true will be ignored.
 * @returns {object} An array of objects of the form {p: number[], 
 * l1, l2} where p is a point of intersection and l1 and l2 are the two 
 * line segments that intersect. Note that l1 and l2 reference the same
 * line segment objects passed in to this function. This allows for the
 * attachedment of additional properties to the line segment objects
 * that won't be lost.
 * @example
 * modifiedBentleyOttmann([
 * 			[[0,0],     [1,1]], 
 *			[[0,1],     [1,0]],
 *			[[0.6,1],   [0.7,0.1]],
 *			[[0,0.4],   [1,0.4]],
 *			[[0.2,0],   [0.2,1]]
 * ]); //=>
 */
function modifiedBentleyOttmann(ls, ignoreIntersectionFunc) {
  if (ignoreIntersectionFunc === true) {
    ignoreIntersectionFunc = ignoreIntersectionIfEndpointsCoincide;
  }

  // Initialize event queue to equal all segment endpoints.
  var events = [];
  for (var i = 0; i < ls.length; i++) {
    var l = ls[i];
    var ol = orient(l);
    events.push(new Event(0, l, ol[0]));
    events.push(new Event(1, l, ol[1]));
  }

  events.sort(Event.compare);

  //let activeLines = new LinkedList();
  var activeLines = new Set();

  var intersections = [];
  for (var _i = 0; _i < events.length; _i++) {
    var event = events[_i];

    var _l3 = event.l;

    if (event.type === EVENT_LEFT) {

      /*
      if (activeLines.head) {
      	let node = activeLines.head;
      	while (node) {
      		let activeLine = node.item;
      	
      		let p = segSegIntersection(
       						l, activeLine, DELTA
       				);
      		
       				if (!p || (ignoreIntersectionFunc && 
       						ignoreIntersectionFunc(l,activeLine))) { 
       					node = node.next;		
       					continue;
       				}
       				
       				intersections.push({p, l1: l, l2: activeLine });
       			
      		node = node.next;
      	}
      }
      */

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = activeLines.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var activeLine = _step.value;

          var p = segSegIntersection(_l3, activeLine, DELTA);

          if (!p || ignoreIntersectionFunc && ignoreIntersectionFunc(_l3, activeLine)) {
            continue;
          }

          intersections.push({ p: p, l1: _l3, l2: activeLine });
        }

        //LinkedList.insertAtBack(activeLines, l);
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      activeLines.add(_l3);
    } else if (event.type === EVENT_RIGHT) {
      var _l4 = event.l;

      //LinkedList.remove(activeLines, l);
      activeLines.delete(_l4);
    }
  }

  return intersections;
}

/**
 * Returns zero if the two given event points coincide else return > 0 
 * if the first point has a greater x coordinate or, if x coordinates 
 * are equal if the first point's y is greater.
 * @ignore
 */
/*
Event.compare = function(a,b) {
	let pA = a.p;
	let pB = b.p;
	
	let res = deltaCompare(pA[0] - pB[0]);
	if (res !== 0) { 
		return res; 
	}
	
	return deltaCompare(pA[1] - pB[1]);
}
*/
Event.compare = function (a, b) {
  var pA = a.p;
  var pB = b.p;

  var res = pA[0] - pB[0];
  if (res !== 0) {
    return res;
  }

  return pA[1] - pB[1];
};

var deltaCompare = function deltaCompare(x) {
  return Math.abs(x) < DELTA ? 0 : x;
};

/**
 * Orients the line so that it goes from left to right and if vertical 
 * from bottom to top.
 * 
 * @ignore 
 * @param {number[][]} l - A line.
 * @returns {number[][]} - An oriented line.
 */
function orient(l) {
  var _l5 = _slicedToArray(l, 2),
      _l5$ = _slicedToArray(_l5[0], 2),
      x0 = _l5$[0],
      y0 = _l5$[1],
      _l5$2 = _slicedToArray(_l5[1], 2),
      x1 = _l5$2[0],
      y1 = _l5$2[1];

  if (x0 < x1) {
    return l;
  } else if (x0 > x1) {
    return [[x1, y1], [x0, y0]];
  }

  if (y0 < y1) {
    return l;
  } else if (y0 > y1) {
    return [[x1, y1], [x0, y0]];
  }

  return l; // Line has degenerated into a point.
}

/**
 * Event class
 * 
 * @ignore
 * @constructor
 * @param {number} type - 0 -> left endpoint, 1 -> right endpoint
 * @param {number[][]} l - A line.
 * @param {number[]} p - A point.
 */
function Event(type, l, p) {
  this.type = type;
  this.l = l;
  this.p = p;
}

module.exports = modifiedBentleyOttmann;

},{"./seg-seg-intersection.js":3}],3:[function(require,module,exports){
'use strict';

/**
 * <p>
 * Finds the point where two line segments intersect.
 * </p>
 * <p>
 * See <a href="http://algs4.cs.princeton.edu/91primitives">Geometric primitves</a>
 * </p> 
 * @param {number[][]} ab - The first line 
 * @param {number[][]} cd - The second line
 * @param {number} delta - The slope tolerance at which two lines are
 * considered either parallel or colinear - defaults to 1e-10 
 * @returns {number[]} The point where the two line segments intersect  
 * or undefined if they don't or if they intersect at infinitely many 
 * points. 
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function segSegIntersection(ab, cd, delta) {
	if (delta === undefined) {
		delta = 1e-10;
	}

	var _ab = _slicedToArray(ab, 2),
	    a = _ab[0],
	    b = _ab[1];

	var _cd = _slicedToArray(cd, 2),
	    c = _cd[0],
	    d = _cd[1];

	var denom = (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0]);

	var rNumer = (a[1] - c[1]) * (d[0] - c[0]) - (a[0] - c[0]) * (d[1] - c[1]);
	var sNumer = (a[1] - c[1]) * (b[0] - a[0]) - (a[0] - c[0]) * (b[1] - a[1]);

	if (Math.abs(denom) <= delta) {
		// parallel
		if (Math.abs(rNumer) <= delta) {
			// colinear
			// TODO Check if x-projections and y-projections intersect
			// and return the line of intersection if they do.
			return undefined;
		}
		return undefined;
	}

	var r = rNumer / denom;
	var s = sNumer / denom;

	if (0 <= r && r <= 1 && 0 <= s && s <= 1) {
		return [a[0] + r * (b[0] - a[0]), a[1] + r * (b[1] - a[1])];
	}

	return undefined;
}

module.exports = segSegIntersection;

},{}]},{},[1])(1)
});