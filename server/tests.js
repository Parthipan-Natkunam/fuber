/*test runner*/
var assert = require('assert');
const findCabTest = require('./tests/findCabTestModules');

/*Distance Calculation Unit Tests*/
assert(findCabTest.clacDistance([2,2],[4,4]) === 2.83);
assert(findCabTest.clacDistance([0,0],[0,0]) === 0);
assert(findCabTest.clacDistance([-1,5],[3,-2]) === 8.06);
assert(findCabTest.clacDistance([-2.5,0],[2,-5.7]) === 7.26);
assert(findCabTest.clacDistance([2.7,3.5],[5.5,6.3]) === 3.96);
assert(findCabTest.clacDistance([-2,-2],[-4,-4]) === 2.83)
