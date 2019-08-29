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
declare function linesIntersections(ls: number[][][], ignoreFunction?: ((l1: number[][], l2: number[][]) => boolean) | boolean): {
    p: number[];
    l1: number[][];
    l2: number[][];
}[];
export { linesIntersections };
