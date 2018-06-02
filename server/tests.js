/*test runner*/
var assert = require('assert');
const findCabTest = require('./tests/findCabTestModules');

/*Distance Calculation Unit Tests*/
assert(findCabTest.clacDistance([2,2],[4,4]) === 2.83);
assert(findCabTest.clacDistance([0,0],[0,0]) === 0);
assert(findCabTest.clacDistance([-1,5],[3,-2]) === 8.06);
assert(findCabTest.clacDistance([-2.5,0],[2,-5.7]) === 7.26);
assert(findCabTest.clacDistance([2.7,3.5],[5.5,6.3]) === 3.96);
assert(findCabTest.clacDistance([-2,-2],[-4,-4]) === 2.83);

/*nearestCabtest, pink nearest cab test assumes all cabs are available for the purpose of test*/
/*find nearest cab*/
const userObj1 = {id: 1,loc:{lat: 4,long: 3.6},prefCol: ""};
const userObj2 = {id: 1,loc:{lat: 0.5,long: 0.5},prefCol: ""};

assert(findCabTest.findNearestCab(userObj1) === 5);
assert(findCabTest.findNearestCab(userObj2) === 1);

/*find nearest pink cab*/
const pinkUserObj1 = {id: 1,loc:{lat: 4,long: 3.6},prefCol: "pink"};
const pinkUserObj2 = {id: 1,loc:{lat: 2.6,long: 3},prefCol: "pink"};
const pinkUserObj3 = {id: 1,loc:{lat: 0.5,long: 0.5},prefCol: "pink"};

assert(findCabTest.findNearestCab(pinkUserObj1) === 5);
assert(findCabTest.findNearestCab(pinkUserObj2) === 3);
assert(findCabTest.findNearestCab(pinkUserObj3) === 3);


console.log("All Tests Passed.")
