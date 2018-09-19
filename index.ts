
// The slope tolerance at which two lines are considered either parallel or 
// colinear.

const DELTA = 1e-10; 

const EVENT_LEFT  = 0;
const EVENT_RIGHT = 1;


/**
 * Returns true if the two given lines have an endpoint in common.
 * 
 * It is the default function for checking if the intersection between 
 * two lines should be ignored.
 * 
 * @private
 * @param l1 - A line.
 * @param l2 - Another line.
 * @returns {boolean} True if any endpoints between the supplied lines 
 * coincide, false otherwise.
 */
function ignoreIntersectionIfEndpointsCoincide(
            l1: number[][],
            l2: number[][]) {

	let [p1,p2] = l1;
	let [p3,p4] = l2;
	return ((p1[0] === p3[0] && p1[1] === p3[1]) || 
			(p2[0] === p3[0] && p2[1] === p3[1]) ||
			(p1[0] === p4[0] && p1[1] === p4[1]) || 
			(p2[0] === p4[0] && p2[1] === p4[1]));
}


/**
 * Find segment-segment intersections via a very fast modified version of the 
 * Bentley-Ottmann algorithm.
 *  
 * In practice it almost always runs much much faster than Bentley-Ottmann. Even 
 * when there are tens of thousands of line segments with hundreds of thousands 
 * of intersection the Bentley-Ottmann algorithm still do not come close even 
 * though it has a better asymptotic O((n+k)log-n) run time (where k is the 
 * number of intersections and n is the number of lines).
 * 
 * The algorithm is the same as Bentley-Ottmann except that it replaces a binary 
 * tree in the implementation with a flat linked list. 
 * 
 * See http://geomalgorithms.com/a09-_intersect-3.html
 * 
 * Returns an array of objects of the form {p: number[], l1, l2} where p is a 
 * point of intersection and l1 and l2 are the two line segments that intersect. 
 * Note that l1 and l2 reference the same line segment objects passed in to this 
 * function. This allows for the attachedment of additional properties to the 
 * line segment objects that won't be lost.
 * 
 * @param ls - An array of line segments.
 * @param ignoreIntersectionFunc - If set to true line segments with coinciding 
 * endpoints' intersection will be ignored. If falsey, all intersections will be 
 * returned. If a function is provided (taking as parameters 2 lines and returns 
 * true if the intersection between those two lines should be ignored) then 
 * those intersections for which the function returns true will be ignored.
 * @example
 * modifiedBentleyOttmann([
 * 			[[0,0],     [1,1]], 
 *			[[0,1],     [1,0]],
 *			[[0.6,1],   [0.7,0.1]],
 *			[[0,0.4],   [1,0.4]],
 *			[[0.2,0],   [0.2,1]]
 * ]); //=>
 */ 
function modifiedBentleyOttmann(
        ls: number[][][], 
		ignoreIntersectionFunc: ((l1: number[][], l2: number[][]) => boolean) | boolean): {
			p: number[];
			l1: number[][];
			l2: number[][];
		}[] {

	if (ignoreIntersectionFunc === true) { 
		ignoreIntersectionFunc = ignoreIntersectionIfEndpointsCoincide;
	}
	
	// Initialize event queue to equal all segment endpoints.
	let events = [];
	for (let i=0; i<ls.length; i++) {
		let l = ls[i];
		let ol = orient(l);
		events.push(new Event(0, l, ol[0]));
		events.push(new Event(1, l, ol[1]));
	}

	events.sort(Event.compare);
	
	
	let activeLines = new Set();
	
	let intersections = [];
	for (let i=0; i<events.length; i++) {
		let event = events[i];
		
    	let l = event.l;
    	
   		if (event.type === EVENT_LEFT) {
   			
   			for (let activeLine of activeLines.values()) {
				let p = segSegIntersection(
   						l, activeLine, DELTA
   				);
				
   				if (!p || (ignoreIntersectionFunc && 
   						ignoreIntersectionFunc(l,activeLine))) { 
   					continue;
   				}
   				
   				intersections.push({p, l1: l, l2: activeLine });
   			}

   			
   			activeLines.add(l);
   		} else if (event.type === EVENT_RIGHT) {
   			let l = event.l;
   			
   			activeLines.delete(l);
   		}
	}
	
	return intersections;
}


let deltaCompare = (x: number) => Math.abs(x) < DELTA ? 0 : x;


/**
 * Orients the line so that it goes from left to right and if vertical 
 * from bottom to top. Returns the oriented line.
 * 
 * @private
 * @param l - A line.
 */
function orient(l: number[][]) {
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
class Event {
    type: number;
    l: number[][];
    p: number[];

    constructor(type: number, l: number[][], p: number[]) {
	    this.type = type;
	    this.l    = l;
        this.p    = p;
    }


    static compare(a: { p: number[] }, b: { p: number[] }) {
        let pA = a.p;
        let pB = b.p;
        
        let res = pA[0] - pB[0];
        if (res !== 0) { 
            return res; 
        }
        
        return pA[1] - pB[1];
    }
}


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
function segSegIntersection(
            ab: number[][], 
            cd: number[][], 
            delta: number = 1e-10) {

	let [a,b] = ab;
	let [c,d] = cd;
	 
	let denom = 
		(b[0] - a[0])*(d[1] - c[1]) - (b[1] - a[1])*(d[0] - c[0]);
	
	let rNumer = 
		(a[1] - c[1])*(d[0] - c[0]) - (a[0] - c[0])*(d[1] - c[1]);
	let sNumer = 
		(a[1] - c[1])*(b[0] - a[0]) - (a[0] - c[0])*(b[1] - a[1]); 
	
	
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
	
	let r = rNumer / denom;
	let s = sNumer / denom;
	
	if (0 <= r && r <= 1 && 0 <= s && s <= 1) {
		return [a[0] + r*(b[0]-a[0]), a[1] + r*(b[1]-a[1])];
	} 
	
	return undefined;
}


export default modifiedBentleyOttmann;
