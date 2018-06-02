const CabBookingService = require('../services/CabBookingService');

const bookingService = new CabBookingService();

var findCabTestModules = (function (){
	return{
		/* Distance calculation*/
		clacDistance : function (userLoc,cabLoc){
			let latDistance = Math.abs(userLoc[0]-cabLoc[0]);
			let longDistance = Math.abs(userLoc[1]-cabLoc[1]);
			let newDistance = Math.sqrt((latDistance**2)+(longDistance**2));
			return +newDistance.toFixed(2);
		} ,
		findNearestCab : function (userBookingObj){
			return bookingService.findCab(userBookingObj);
		}
	};
})();

module.exports = findCabTestModules;
