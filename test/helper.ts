
import { segSegIntersection } from 'flo-vector2d';


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
 * @param seed
 * @returns A quasi-random number to be used as the next input to this function
 */
function random(seed: number) {
	const a = 134775813;
	
	return (a * seed + 1) % RANGE;
}


/**
 * Generates a random array of numbers picked from a bounded flat 
 * distribution (i.e. a rectangular distribution) with specified odds of 
 * duplication of consecutive values.
 *   
 * @private
 * @param n The number of values to generate.
 * @param a The lower bound of the distribution - defaults to 0
 * @param b The upper bound of the distribution - defaults to 1
 * @param seed A seed value for generating random values (so that the results 
 * are reproducable)
 * @returns The random array
 */
function randomArray(n: number, a: number, b: number, seed: number) {
	seed = (seed === undefined) ? SEED : seed;
	
	let vs: number[] = [];
	for (let i=0; i<n; i++) {
		seed = random(seed);
		let v = ((seed/RANGE) * (b-a)) + a;
		vs.push(v);
	}

	return { vs, seed };
}


function naive(ls: number[][][]) {
	let intersections: number[][] = [];
	for (let i=0; i<ls.length; i++) {
		for (let j=i; j<ls.length; j++) {
			let p = segSegIntersection(ls[i], ls[j]);
			if (!p) { continue; }
			
			intersections.push(p);
		}
	}
	
	return intersections;
}


export {
	random,
	randomArray,
	naive
}