'use strict'

var helper = {
	random: predictiveRandom,
	randomArray,
	naive,
	segSegIntersection,
	scale,
	fromTo
}


/**
 * Some seed value for the simple random number generator.
 */
const SEED = 123456789;

/**
 * The range for the simple random number generator, i.e. the generated
 * numbers will be in [0,RANGE].
 */
const RANGE = 4294967296;


/**
 * https://stackoverflow.com/questions/3062746/special-simple-random-number-generator
 * 
 * @param {number} seed
 * @returns {number} A quasi-random number to be used as the next input 
 * to this function.
 */
function predictiveRandom(seed) {
	const a = 134775813;
	
	return (a * seed + 1) % RANGE;
}


/**
 * Generates a random array of numbers picked from a bounded flat 
 * distribution (i.e. a rectangular distribution) with specified odds of 
 * duplication of consecutive values.
 *   
 * @ignore
 * @param {number} n - The number of values to generate.
 * @param {number} a - The lower bound of the distribution - defaults 
 * to 0
 * @param {number} b - The upper bound of the distribution - defaults 
 * to 1
 * @param {number} seed - A seed value for generating random values (so
 * that the results are reproducable)
 * @returns {number[]} - The random array.
 */
function randomArray(n, a, b, seed) {
	seed = (seed === undefined) ? SEED : seed;
	
	let vs = [];
	for (let i=0; i<n; i++) {
		seed = predictiveRandom(seed);
		let v = ((seed/RANGE) * (b-a)) + a;
		vs.push(v);
	}

	return { vs, seed };
}


/**
 * Vector scale
 */ 
function scale(p, factor) {
	return [p[0] * factor, p[1] * factor];
}


/**
 * Vector subtract
 */
function fromTo(p1, p2) {
	return [p2[0] - p1[0], p2[1] - p1[1]];
}


function naive(ls) {
	let intersections = [];
	for (let i=0; i<ls.length; i++) {
		for (let j=i; j<ls.length; j++) {
			let p = segSegIntersection(ls[i], ls[j]);
			if (!p /*|| f(ls[i], ls[j])*/) { continue; }
			
			intersections.push(p);
		}
	}
	
	return intersections;
}


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


if (typeof require !== 'undefined') {
	module.exports = helper;	
}

