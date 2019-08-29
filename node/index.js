"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const EVENT_LEFT = 0;
const EVENT_RIGHT = 1;
/**
 * Returns true if the two given lines have an endpoint in common.
 *
 * It is the default function for checking if the intersection between
 * two lines should be ignored.
 *
 * @private
 * @param l1 A line.
 * @param l2 Another line.
 */
function endpointsCoincide(l1, l2) {
    let [p1, p2] = l1;
    let [p3, p4] = l2;
    return ((p1[0] === p3[0] && p1[1] === p3[1]) ||
        (p2[0] === p3[0] && p2[1] === p3[1]) ||
        (p1[0] === p4[0] && p1[1] === p4[1]) ||
        (p2[0] === p4[0] && p2[1] === p4[1]));
}
/**
 * Find line segment-segment intersections via a a scan-line algorithm.
 *
 * The algorithm is the same as Bentley-Ottmann except that it replaces a binary
 * tree in the implementation with a flat linked list which is faster for a
 * smaller number of lines in practice.
 *
 * See http://geomalgorithms.com/a09-_intersect-3.html
 *
 * Returns an array of objects of the form {p: number[], l1, l2} where p is a
 * point of intersection and l1 and l2 are the two line segments that intersect.
 * Note that l1 and l2 reference the same line segment objects passed in to this
 * function. This allows for the attachedment of additional properties to the
 * line segment objects that won't be lost.
 *
 * @param ls An array of line segments
 * @param ignoreFunction If set to true line segments with coinciding endpoints'
 * intersection will be ignored. If falsey (bar undefined), all intersections
 * will be returned. If a function is provided then those intersections for
 * which the function returns true will be ignored - defaults to true.
 * @example
 * linesIntersections([
 * 			[[0,0],     [1,1]],
 *			[[0,1],     [1,0]],
 *			[[0.6,1],   [0.7,0.1]],
 *			[[0,0.4],   [1,0.4]],
 *			[[0.2,0],   [0.2,1]]
 * ]);
 */
function linesIntersections(ls, ignoreFunction = endpointsCoincide) {
    if (ignoreFunction === true) {
        ignoreFunction = endpointsCoincide;
    }
    // Initialize event queue to equal all segment endpoints.
    let events = [];
    for (let i = 0; i < ls.length; i++) {
        let l = ls[i];
        let ol = orient(l);
        events.push({ type: EVENT_LEFT, l, p: ol[0] });
        events.push({ type: EVENT_RIGHT, l, p: ol[1] });
    }
    events.sort(compareEvents);
    let activeLines = new Set();
    let intersections = [];
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let l = event.l;
        if (event.type === EVENT_LEFT) {
            for (let activeLine of activeLines.values()) {
                if (ignoreFunction && ignoreFunction(l, activeLine)) {
                    continue;
                }
                let p = flo_vector2d_1.segSegIntersection(l, activeLine);
                if (!p) {
                    continue;
                }
                intersections.push({ p, l1: l, l2: activeLine });
            }
            activeLines.add(l);
        }
        else if (event.type === EVENT_RIGHT) {
            let l = event.l;
            activeLines.delete(l);
        }
    }
    return intersections;
}
exports.linesIntersections = linesIntersections;
/**
 * Orients the line so that it goes from left to right and if vertical
 * from bottom to top. Returns the oriented line.
 *
 * @private
 * @param l A line.
 */
function orient(l) {
    let [[x0, y0], [x1, y1]] = l;
    if (x0 < x1) {
        return l;
    }
    else if (x0 > x1) {
        return [[x1, y1], [x0, y0]];
    }
    if (y0 < y1) {
        return l;
    }
    else if (y0 > y1) {
        return [[x1, y1], [x0, y0]];
    }
    return l; // Line has degenerated into a point.
}
function compareEvents(a, b) {
    let pA = a.p;
    let pB = b.p;
    let res = pA[0] - pB[0];
    if (res !== 0) {
        return res;
    }
    res = pA[1] - pB[1];
    if (res !== 0) {
        return res;
    }
    // left events must come before right ones to take care of edge cases
    return a.type - b.type;
}
//# sourceMappingURL=index.js.map