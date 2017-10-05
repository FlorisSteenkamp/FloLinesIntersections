(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FloLinesIntersections = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var FloLinesIntersections = require('./lib/modified-bentley-ottmann.js');

module.exports = exports = FloLinesIntersections;

},{"./lib/modified-bentley-ottmann.js":3}],2:[function(require,module,exports){
'use strict';

/**
 * Representation of a linked list node.
 *
 * @ignore
 * @constructor
 * @param {LinkedList} list - The linked list this node belongs to.
 * @param {*} item - The actual data stored at a node.
 * @param {ListNode} prev - The previous item or undefined if there is 
 * none.
 * @param {ListNode} next - The next item or undefined if there is none.
 */

function ListNode(list, item, prev, next) {
	this.list = list;
	this.item = item;
	this.prev = prev;
	this.next = next;
}

/**
 * Represents a two-way linked list.
 * @ignore 
 * @constructor 
 */
function LinkedList(items) {
	this.head = undefined;
	this.tail = undefined;

	if (!items || !items.length) {
		return;
	}

	addAllFromScratch(this, items);
}

LinkedList.isEmpty = function (list) {
	return !list.head;
};

/**
 * Insert an item.
 * 
 * @ignore
 * @param item {*} - Item to insert.
 * @param prev_ - Insert new item right after this item or if undefined
 * insert it in the front.
 */
LinkedList.insert = function (list, item, prev_) {

	var node = new ListNode(list, item, undefined, undefined);

	if (!list.head) {
		// List is empty
		list.head = node;
		list.tail = node;
		return node;
	}

	var prev = void 0;
	var next = void 0;
	if (!prev_) {
		next = list.head;
		list.head = node;
	} else {
		prev = prev_;
		next = prev_.next;
	}

	if (next) {
		next.prev = node;
	} else {
		list.tail = node;
	}
	if (prev) {
		prev.next = node;
	}
	node.prev = prev;
	node.next = next;

	return node;
};

LinkedList.insertInFront = function (list, item) {
	LinkedList.insert(list, item, undefined);
};

LinkedList.insertAtBack = function (list, item) {
	var tail = list.tail;

	var node = new ListNode(list, item, tail, undefined);

	if (!tail) {
		list.head = node;
		list.tail = node;
		return;
	}

	tail.next = node;
	list.tail = node;
};

LinkedList.removeFromFront = function (list, item) {
	// TODO - finish
};

LinkedList.removeFromBack = function (list) {
	var tail = list.tail;
	if (!tail) {
		return;
	}

	var prev = tail.prev;
	if (!prev) {
		// List is now empty.
		list.head = undefined;
		list.tail = undefined;

		return;
	}

	prev.next = undefined;
	list.tail = prev;
};

LinkedList.remove = function (list, item) {
	var node = LinkedList.find(list, item);

	if (!node) {
		return;
	}

	LinkedList.removeNode(list, node);
};

LinkedList.removeNode = function (list, node) {
	var prev = node.prev;
	var next = node.next;

	if (prev) {
		if (next) {
			prev.next = next;
			next.prev = prev;
			return;
		}
		prev.next = undefined;
		list.tail = prev;
		return;
	}

	if (next) {
		next.prev = undefined;
		list.head = next;
		return;
	}

	// Delete the only item.
	list.head = undefined;
	list.tail = undefined;
};

/**
 * Find a node in the list by === on node.item.
 * @ignore
 * @returns The found node.
 */
LinkedList.find = function (list, item) {
	var head = list.head;

	if (!head) {
		return undefined;
	}

	var node = head;
	while (node) {
		if (node.item === item) {
			return node;
		}
		node = node.next;
	}

	return undefined;
};

LinkedList.getAsArray = function (list) {
	var nodes = [];

	var node = list.head;
	do {
		nodes.push(node.item);

		node = node.next;
	} while (node);

	return nodes;
};

LinkedList.forEach = function (list, f) {
	var node = list.head;
	do {
		f(node);

		node = node.next;
	} while (node);
};

LinkedList.addAllFromScratch = function (list, items) {

	var prevNode = void 0;
	for (var i = 0; i < items.length; i++) {

		var node = new ListNode(list, items[i], prevNode, undefined);

		if (prevNode) {
			prevNode.next = node;
		}
		prevNode = node;

		if (i === 0) {
			list.head = node;
		}
	}
};

module.exports = LinkedList;

},{}],3:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var LinkedList = require('./linked-list.js');
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
 * @param {number[][][]} ls - An array of lines.
 * @param {function} ignoreIntersectionFunc - A function taking 2 lines
 * and returns true if the intersection between those two lines should
 * be ignored. The default is ignoreIntersectionIfEndpointsCoincide.
 * If not supplied (i.e. undefined) no intersections will be ignored.
 * @returns {object} An array of objects of the form {p: number[], 
 * l1: number[][], l2: number[][]} where p is a point of intersection
 * and l1 and l2 are the two lines that intersect.
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

  // Initialize event queue to equal all segment endpoints.
  var events = [];
  for (var i = 0; i < ls.length; i++) {
    var l = ls[i];
    var ol = orient(l);
    events.push(new Event(0, l, ol[0]));
    events.push(new Event(1, l, ol[1]));
  }

  events.sort(Event.compare);

  var activeLines = new LinkedList();

  var intersections = [];
  for (var _i = 0; _i < events.length; _i++) {
    var event = events[_i];

    var _l3 = event.l;

    if (event.type === EVENT_LEFT) {

      if (activeLines.head) {
        var node = activeLines.head;
        while (node) {
          var activeLine = node.item;

          var p = segSegIntersection(_l3, activeLine, DELTA);

          if (!p || ignoreIntersectionFunc && ignoreIntersectionFunc(_l3, activeLine)) {
            node = node.next;
            continue;
          }

          intersections.push({ p: p, l1: _l3, l2: activeLine });

          node = node.next;
        }
      }

      LinkedList.insertAtBack(activeLines, _l3);
    } else if (event.type === EVENT_RIGHT) {
      var _l4 = event.l;

      LinkedList.remove(activeLines, _l4);
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
Event.compare = function (a, b) {
  var pA = a.p;
  var pB = b.p;

  var res = deltaCompare(pA[0] - pB[0]);
  if (res !== 0) {
    return res;
  }

  return deltaCompare(pA[1] - pB[1]);
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

module.exports = {
  modifiedBentleyOttmann: modifiedBentleyOttmann,
  ignoreIntersectionIfEndpointsCoincide: ignoreIntersectionIfEndpointsCoincide
};

},{"./linked-list.js":2,"./seg-seg-intersection.js":4}],4:[function(require,module,exports){
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