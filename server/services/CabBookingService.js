const cabs = require('../inMemData/cabData');

class CabBookingService{
	findCab(userBookingObj){
		let nearestCab = void 0;
		let prevDistance = void 0;
		let userLoc = [userBookingObj.loc.lat,userBookingObj.loc.long];
		cabs.forEach((cab,index)=>{
			let cabLoc = cab.location;
			let latDistance = Math.abs(userLoc[0]-cabLoc[0]);
			let longDistance = Math.abs(userLoc[1]-cabLoc[1]);
			let newDistance = +Math.sqrt((latDistance**2)+(longDistance**2)).toFixed(2);
			if((typeof prevDistance === 'undefined' || newDistance < prevDistance) && 
			(userBookingObj.prefCol==="" || userBookingObj.prefCol === cab.color) &&
			cab.isAvailable){
				prevDistance = newDistance;
				nearestCab = cab.id;
			}
		});
		return nearestCab;
	}
	bookCab(cabId,userId){

	}
	cancelBooking(rideId){

	}
	calculateFare(rideId){

	}
	beginRide(rideId){

	}
	endRide(rideId){

	}
}

module.exports = CabBookingService;