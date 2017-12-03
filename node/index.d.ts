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
declare function modifiedBentleyOttmann(ls: number[][][], ignoreIntersectionFunc: ((l1: number[][], l2: number[][]) => boolean) | boolean): {
    p: number[];
    l1: number[][];
    l2: any;
}[];
export default modifiedBentleyOttmann;
