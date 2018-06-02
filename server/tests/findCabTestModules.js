/* Distance calculation*/
var findCabTestModules = (function (){
	return{
		clacDistance : function testDistanceCalculation(userLoc,cabLoc){
						let latDistance = Math.abs(userLoc[0]-cabLoc[0]);
						let longDistance = Math.abs(userLoc[1]-cabLoc[1]);
						let newDistance = Math.sqrt((latDistance**2)+(longDistance**2));
						return +newDistance.toFixed(2);
					} 
	};
})();

module.exports = findCabTestModules;
