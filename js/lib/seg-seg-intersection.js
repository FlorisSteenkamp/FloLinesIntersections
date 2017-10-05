'use strict'


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
function segSegIntersection(ab, cd, delta) {
	if (delta === undefined) { delta = 1e-10; }
	
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


module.exports = segSegIntersection;
