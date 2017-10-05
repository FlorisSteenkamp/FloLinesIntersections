'use strict'

let LinkedList         = require('./linked-list.js');
let segSegIntersection = require('./seg-seg-intersection.js');

// The slope tolerance at which two lines are considered either parallel 
// or colinear
const DELTA = 1e-10; 

const EVENT_LEFT  = 0;
const EVENT_RIGHT = 1;


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
function ignoreIntersectionIfEndpointsCoincide(l1,l2) {
	let [p1,p2] = l1;
	let [p3,p4] = l2;
	return ((p1[0] === p3[0] && p1[1] === p3[1]) || 
			(p2[0] === p3[0] && p2[1] === p3[1]) ||
			(p1[0] === p4[0] && p1[1] === p4[1]) || 
			(p2[0] === p4[0] && p2[1] === p4[1]));
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
	let events = [];
	for (let i=0; i<ls.length; i++) {
		let l = ls[i];
		let ol = orient(l);
		events.push(new Event(0, l, ol[0]));
		events.push(new Event(1, l, ol[1]));
	}

	events.sort(Event.compare);
	
	
	let activeLines = new LinkedList(); 
	
	let intersections = [];
	for (let i=0; i<events.length; i++) {
		let event = events[i];
		
    	let l = event.l;
    	
   		if (event.type === EVENT_LEFT) {
   			
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
   			
   			LinkedList.insertAtBack(activeLines, l);
   		} else if (event.type === EVENT_RIGHT) {
   			let l = event.l;
   			
   			LinkedList.remove(activeLines, l);   			
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
Event.compare = function(a,b) {
	let pA = a.p;
	let pB = b.p;
	
	let res = deltaCompare(pA[0] - pB[0]);
	if (res !== 0) { 
		return res; 
	}
	
	return deltaCompare(pA[1] - pB[1]);
}


let deltaCompare = x => Math.abs(x) < DELTA ? 0 : x;


/**
 * Orients the line so that it goes from left to right and if vertical 
 * from bottom to top.
 * 
 * @ignore 
 * @param {number[][]} l - A line.
 * @returns {number[][]} - An oriented line.
 */
function orient(l) {
	let [[x0, y0],[x1,y1]] = l;
	
	if (x0 < x1) { 
		return l; 
	} else if (x0 > x1) {
		return [[x1,y1],[x0,y0]];
	}
	
	if (y0 < y1) {
		return l;
	} else if (y0 > y1) {
		return [[x1,y1],[x0,y0]];
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
	this.l    = l;
	this.p    = p;
}


module.exports = { 
		modifiedBentleyOttmann, 
		ignoreIntersectionIfEndpointsCoincide		
}
