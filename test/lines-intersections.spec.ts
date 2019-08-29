
//import { describe } from 'mocha';
import 'mocha';
import { assert, expect } from 'chai';
import { scale, fromTo } from 'flo-vector2d';
import { naive, randomArray } from './helper';
import { linesIntersections } from '../src/index';


let ls = [
	[[1,1],     [0,0]], 
	[[0,1],     [1,0]],
	[[0.1,0],   [0.1,1]]
];

let square = [
	[[0,0],[0,1]],
	[[0,1],[1,1]],
	[[1,1],[1,0]],
	[[1,0],[0,0]],
];

let edgeCaseLs = [
	[[0,0],     [1,1]], 
	[[0,1],     [1,0]],
	[[0.6,1],   [0.7,0.1]],
	[[0,0.4],   [1,0.4]],
	[[0.2,0],   [0.2,1]],
	[[0,0.1],   [1,0.9000000001]],
	[[0,0.1],   [1,0.9]],
	[[0,0.1],   [1,0.99]],
	[[0,0.2],   [1,0.8]],
	[[0.1,0.2], [5,0.2]],
	[[0.5,0.5], [0.7,0.6]],
	[[0.911814522190884,1.7585138366549615],[1.7806574185795223,1.8448024165627364]],
	[[0.10615941475568524,0.6521081457309923],[1.9761225316236866,1.5977505527556741]],
	[[0.9241315650259483,0.5135394226693717],[0.6001828890114127,1.339778989662114]],
	[[0.17451818229923077,0.6316536275368709],[0.12229747702040727,0.1703969946271684]],
	[[0.7309548347192161,1.2740939520742938],[0.9448141602887912,1.0821212042506207]],
	[[1.0612858469716322,0.9546872389562151],[0.4422129931573351,1.3950476501025482]],
	[[1.475307158769641,1.4782422402357565],[0.9212538133739985,0.5332642661887741]],
	[[0.43313048022311884,0.6146284669358271],[1.975611440332051,0.48909984031402454]],
	[[1.9384331141027822,1.656287210483597],[0.16657027746889108,0.8407799791125625]],
	[[1.6985143409467005,0.6253492491496164],[1.1192172819214732,0.8311014400137324]],
	[[0.10615941475568524, 0.6521081457309923],[1.9761225316236866, 1.5977505527556741]],
	[[1.0612858469716322, 0.9546872389562151],[0.4422129931573351, 1.3950476501025482]],
	[[1.475307158769641, 1.4782422402357565],[0.9212538133739985, 0.5332642661887741]],
	[[1.34,0.27], [0.25,0.93]],
	[[0.02,1.88], [1.00,1.17]],
	[[1.78,0.60], [0.38,0.55]],
	[[1.65,1.67], [0.05,1.84]],
	[[0.80,0.63], [1.22,0.14]],
	[[1.87,1.59], [0.17,0.24]],
	[[0.65,1.45], [0.2, 0.36]],
	[[0.87,0.66], [0.86,1.25]],
	[[0.73,0.52], [1.48,1.86]],
	[[1.68,1.90], [0.12,1.53]],
	[[1.66,1.97], [0.33,0.18]],
	[[0.76,1.30], [0.34,0.07]],
	[[1.76,1.45], [0.86,0.63]],
	[[2.00,0.92], [0.07,0.35]],
	[[1.67,0.10], [0.41,0.84]],
	[[0.91,0.05], [0.14,1.85]],
	[[1.01,1.76], [0.45,1.16]],
	[[1.22,0.14], [0.33,0.04]],
	[[0.10616,0.65211],[1.97612,1.59775]],
	[[1.06129,0.95469],[0.44221,1.39505]],
	[[1.47531,1.47824],[0.92125,0.53326]],
	[[0.11,0.65],[1.98,1.6]],
	[[1.06,0.95],[0.44,1.4]],
	[[1.48,1.48],[0.95,0.53]],
	[[0.1,0.7],[2,1.6]],
	[[1.1,1],[0.4,1.4]],
	[[1.5,1.5],[0.9,0.5]],
	[[1.3450360721136394,0.27052976701784237],[0.2509769446760233,0.9314959703431311]],
	[[0.024044792793528114,1.8781214103712673],[1.0034912971638432,1.168416261950691]],
	[[1.7813723459109747,0.5979217849446479],[0.3797877339555096,0.5462974543320054]],
	[[1.6498938770670377,1.6690191670570105],[0.04858445915012055,1.8396928945779152]],
	[[0.8024082888316935,0.6291313964769576],[1.2225365134261916,0.14283835405538392]],
	[[1.866170730457926,1.587714607046157],[0.16468939667694382,0.23668538013693752]],
	[[0.6499295400078613,1.4479551292112922],[0.20517223609818114,0.364596797928157]],
	[[0.871454361631316,0.6557635778618089],[0.8615201881776637,1.2549146437969374]],
	[[0.7312543923121555,0.5171720838602725],[1.4803505802951498,1.8604050973650006]],
	[[1.6798426412461485,1.9029449858289427],[0.11780403739336043,1.530228760977968]],
	[[1.6612108661170022,1.965386613337738],[0.3252179541020661,0.18335249264763043]],
	[[0.7561434804912146,1.2958712684063523],[0.33929872822809104,0.0753897354634292]],
	[[1.7624445598461587,1.44865011904034],[0.8627571687359863,0.6279657538709649]],
	[[1.9997000987917048,0.9231741961940116],[0.07396517855385731,0.3462292278740815]],
	[[1.6708025177570485,0.10052618170726335],[0.4120640727985849,0.8388963329033254]],
	[[0.9099222999003462,0.05347872338700066],[0.13836920673347297,1.8504755205350785]],
	[[1.0133996809302466,1.757124584600855],[0.4516703868004681,1.1569120516847948]],
	[[1.219639238734397,0.13648201080736877],[0.3270569930166971,0.04260776628305818]],
	[[1.3,0.3],[0.3,0.9]],
	[[0,1.9],[1,1.2]],
	[[1.8,0.6],[0.4,0.6]],
	[[1.6,1.7],[0.1,1.8]],
	[[0.8,0.6],[1.2,0.1]],
	[[1.9,1.6],[0.2,0.2]],
	[[0.7,1.4],[0.2,0.4]],
	[[0.9,0.7],[0.9,1.3]],
	[[0.7,0.5],[1.5,1.9]], 
	[[1.7,1.9],[0.1,1.5]],
	[[1.7,2],[0.3,0.2]],
	[[0.8,1.3],[0.3,0.1]],
	[[1.8,1.4],[0.9,0.6]],
	[[2,0.9],[0.1,0.3]],
	[[1.7,0.1],[0.4,0.8]],
	[[0.9,0.1],[0.1,1.9]],
	[[1,1.8],[0.5,1.2]],
	[[1.2,0.1],[0.3,0]]
];


describe('linesIntersections', function() {
	it('should correctly find some simple line intersections', 
	function() {
		let is = linesIntersections(ls, false);
		
		expect(is.length).to.equal(3);
		
		expect(is[0].p).to.eql([0.5,0.5]);
		expect(is[0].l1).to.equal(ls[1]); // Tests references equal
		expect(is[0].l2).to.equal(ls[0]); // Tests references equal
		
		expect(is[1].p).to.eql([0.1, 0.1]);
		expect(is[1].l1).to.equal(ls[2]); // Tests references equal
		expect(is[1].l2).to.equal(ls[0]); // Tests references equal
		
		expect(is[2].p).to.eql([0.1, 0.9]);
		expect(is[2].l1).to.equal(ls[2]); // Tests references equal
		expect(is[2].l2).to.equal(ls[1]); // Tests references equal
	});

	it('should find all edge case line intersection points', 
	function() {
		let ls = edgeCaseLs;
		
		// Get intersections via a naive sure-fire method that should
		// match the modified method.
		let is1 = naive(ls);
		let is2 = linesIntersections(ls, false);
		
		expect(is2.length).to.equal(1382);
		expect(is2.length).to.equal(is1.length);
	});
	

	it('should not modify the input line segment objects',
	function() {
		// Copy the test lines and add a simple object
		// Example line: [[0,0], [1,1]]
		let ls_: number[][][] = [];
		for (let i=0; i<ls.length; i++) {
			let l_ = ls[i].slice();
			(l_ as any).apple = 'pear'; // add some random property
			ls_.push(l_);
		}
		let is = linesIntersections(ls_, false);
		
		expect(is.length).to.equal(3);
		
		expect(is[0].l1).not.to.equal(ls[1]); // Tests references equal
		expect(is[0].l2).not.to.equal(ls[0]); // Tests references equal
		
		expect(is[1].l1).not.to.equal(ls[2]); // Tests references equal
		expect(is[1].l2).not.to.equal(ls[0]); // Tests references equal
		
		expect(is[2].l1).not.to.equal(ls[2]); // Tests references equal
		expect(is[2].l2).not.to.equal(ls[1]); // Tests references equal
		
		
		expect(is[0].l1).to.equal(ls_[1]); // Tests references equal
		expect(is[0].l2).to.equal(ls_[0]); // Tests references equal
		
		expect(is[1].l1).to.equal(ls_[2]); // Tests references equal
		expect(is[1].l2).to.equal(ls_[0]); // Tests references equal
		
		expect(is[2].l1).to.equal(ls_[2]); // Tests references equal
		expect(is[2].l2).to.equal(ls_[1]); // Tests references equal
		
		// Make sure object property persists
		expect((is[0].l1 as any).apple).to.equal('pear');
	});

	
	it('should find the same number of intersections as that of the naive method for hundreds of predictable random lines',
	function() {
		// Random lines
		const SCALE_FACTOR = 0.3;
		const N = 500;
		const SEEDS = [11111,22222,33333,44444];
		
		let ls = [];
		let rarrs = [0,1,2,3].map(i => randomArray(N,0,1,SEEDS[i]).vs);
		for (let i=0; i<N; i++) {
			let p1 = [rarrs[0][i],rarrs[1][i]];
			let p2 = [rarrs[2][i],rarrs[3][i]];
			let s1 = scale(fromTo(p1,p2), SCALE_FACTOR);
			let p3 = [p1[0] + s1[0], p1[1] + s1[1]];
			
			ls.push([p1,p3]);
		}
		
		// Get intersections via a naive sure-fire method that should
		// match the modified method.
		let is1 = naive(ls);
		let is2 = linesIntersections(ls, false);
		
		expect(is2.length).to.equal(is1.length);
	});
	

	it('should not return intersections of endpoint-coinciding lines if the ignore parameter === true',
	function() {
		let ls = square;
		let is = linesIntersections(ls, true);
		
		expect(is.length).to.equal(0);
	});

	
	it('should correctly handle zero lines case',
	function() {
		let ls: number[][][] = [];
		let is = linesIntersections(ls, false);
		
		expect(is.length).to.equal(0);
	});
	
	
	it('should correctly handle single line case',
	function() {
		let ls = [[[0,0],[1,1]]];
		let is = linesIntersections(ls, false);
		
		expect(is.length).to.equal(0);
	});

	
	it('should return intersections of endpoint-coinciding lines',
	function() {
		let ls = square;
		{
			let is = linesIntersections(ls, true);
			expect(is.length).to.equal(0);
		}

		{
			let is = linesIntersections(ls, false);
			expect(is.length).to.equal(4);
		}

		{
			let is = linesIntersections(ls, undefined);
			expect(is.length).to.equal(0);
		}
	});


	it('should not return intersections of lines outside some bound if the ignore parameter specifies such a function',
	function() {
		// Returns true if any point in the line is outside the square
		// box [[0.1,0.1],[0.9,0.9]].
		function lineOutOfBounds(l: number[][]) {
			if (l[0][0] < 0.1 || l[0][1] < 0.1 ||
				l[1][0] < 0.1 || l[1][1] < 0.1 ||
				l[0][0] > 0.9 || l[0][1] > 0.9 ||
				l[1][0] > 0.9 || l[1][1] > 0.9) {
					return true; // Ignore it
				}
				return false; // Don't ignore
		}
		
		function anyOutOfBounds(l1: number[][], l2: number[][]) {
			return (lineOutOfBounds(l1) || 
					lineOutOfBounds(l2));
		}
		
		// Random lines
		const SCALE_FACTOR = 0.3;
		const N = 1000;
		const SEEDS = [11111,22222,33333,44444];
		
		let ls = [];
		let rarrs = [0,1,2,3].map(i => randomArray(N,0,1,SEEDS[i]).vs);
		for (let i=0; i<N; i++) {
			let p1 = [rarrs[0][i],rarrs[1][i]];
			let p2 = [rarrs[2][i],rarrs[3][i]];
			let s1 = scale(fromTo(p1,p2), SCALE_FACTOR);
			let p3 = [p1[0] + s1[0], p1[1] + s1[1]];
			
			ls.push([p1,p3]);
		}

		{
			let is = linesIntersections(ls);
			expect(is.length).to.equal(9116);
		}
		
		{
			let is = linesIntersections(ls, anyOutOfBounds);
			expect(is.length).to.equal(5151);

			for (let i=0; i<is.length; i++) {
				assert(!anyOutOfBounds(is[i].l1, is[i].l1));  
			}
		}
	});
});















