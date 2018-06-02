const cabs = require('../inMemData/cabData');
const _ = require('underscore');

/*should move it to a separate utility module*/
let CalculateDistance = (loc1,loc2)=>{
	let latDistance = Math.abs(loc1[0]-loc2[0]);
	let longDistance = Math.abs(loc1[1]-loc2[1]);
	return +Math.sqrt((latDistance**2)+(longDistance**2)).toFixed(2); //2 decimal point precision number
}
/*end of utility*/

/*in Memory ride data for simplicity*/
let rides=[];
/*end of in mem ride data*/

class CabBookingService{
	findCab(userBookingObj){
		let nearestCabObj = void 0;
		let prevDistance = void 0;
		let userLoc = [userBookingObj.loc.lat,userBookingObj.loc.long];
		cabs.forEach((cab,index)=>{
			let newDistance = CalculateDistance(userLoc,cab.location);
			if((typeof prevDistance === 'undefined' || newDistance < prevDistance) && 
			(userBookingObj.prefCol==="any" || userBookingObj.prefCol === cab.color) &&
			cab.isAvailable){
				prevDistance = newDistance;
				nearestCabObj = {cabId:cab.id,cabIndex:index};
			}
		});
		return nearestCabObj;
	}
	bookCab(nearestCabObj,userBookingObj){
		let cabToBook = cabs[nearestCabObj.cabIndex];
		let rideObj = void 0;
		if(!_.isEmpty(cabToBook)){
			cabToBook.isAvailable = false;
			rideObj = {
				id: rides.length+1,
				cabId:nearestCabObj.cabId,
				cabIndex: nearestCabObj.cabIndex,
				userId: userBookingObj.userId,
				userLoc: [userBookingObj.loc.lat,userBookingObj.loc.long],
				dropLoc: [userBookingObj.dropLoc.lat,userBookingObj.dropLoc.long]
			};
			rides.push(rideObj);
		}
		return rideObj;
	}
	cancelBooking(rideId){
		let rideObj = _.findWhere(rides,(ride)=>{ return ride.id === rideId});
		let cabToCancel = cabs[rideObj.cabIndex];
		let result = 0;
		if(!cabToCancel.isWaiting && !cabToCancel.hasPickedupCustomer && !_.isEmpty(rideObj)){
			cabToCancel.isAvailable = true;	
			rideObj.wasCancelled = true; // for future data analysis if required assuming the  Prod will have a datastore for ride records.
			result = 1;
		}
		return result;
	}
	beginWait(rideId){
		let rideObj = _.findWhere(rides,(ride)=>{ride.id === rideId});
		if(!_.isEmpty(rideObj)){
			rideObj.waitStartTime = new Date().getTime();
			cabs[rideObj.cabIndex].isWaiting = true;
			return 1;
		}
		return 0;	
	}
	calculateFare(rideObj){
		const perKmCost = 2; /*all cost related data should be in a config file in a sctual PROD system, placing here for convenience*/
		const perMinWaitingCost = 1;
		const additionalPinkCost = 5;
		let totalDistanceTravelled = CalculateDistance(rideObj.userLoc,rideObj.dropLoc);
		let waitingCost = 0;
		let travelCost = 0;
		let totalCost = 0;
		if(typeof rideObj.waitEndTime !== 'undefined'){
			let waitDelta = rideObj.waitEndTime - rideObj.waitStartTime;
			let waitSec = Math.floor(waitDelta/1000); //since delta is im ms
			let waitInMins = Math.floor(waitSec/60);
			waitingCost  = perMinWaitingCost*waitInMins; // adding this even though cost is 1 per minute, to support future changes in wait cost
		}
		travelCost = (totalDistanceTravelled*perKmCost) //assuming the distance is in Km already
		totalCost = travelCost + waitingCost;
		if(cabs[rideObj.cabIndex].color === "pink"){
				totalCost += additionalPinkCost;
		}
		return {total:totalCost,travelCost:travelCost,waitingCost:waitingCost,pinkFactor:additionalPinkCost};
	}
	beginRide(rideId){
		let rideObj = _.findWhere(rides,(ride)=>{ride.id === rideId});
		if(!_.isEmpty(rideObj)){
			let cabObj = cabs[rideObj.cabIndex];
			if(cabObj && cabObj.isWaiting){
				rideObj.waitEndTime = new Date().getTime();
				cabObj.isWaiting = false;	
			} 
			cabObj.hasPickedupCustomer = true;
			return 1;
		}
		return 0;
	}
	endRide(rideId){
		let rideObj = _.findWhere(rides,(ride)=>{ride.id === rideId});
		if(!_.isEmpty(rideObj)){
			let cabObj = cabs[rideObj.cabIndex];
			var isDifferentLocs = (rideObj.userLoc[0] !== rideObj.dropLoc[0]) && (rideObj.userLoc[1] !== rideObj.dropLoc[1]);
			if(cabObj && !cabObj.isWaiting && 
			cabObj.hasPickedupCustomer && isDifferentLocs){
				cabObj.hasPickedupCustomer = true;
				cabToCancel.isAvailable = true;
				cabObj.location = rideObj.dropLoc;
				return rideObj;	
			}		
		}
		return void 0;
	}
	getAllCabData(canShowAll){
		if(canShowAll) return cabs;
		else{
			return _.filter(cabs,(cab)=>{return cab.isAvailable === true});
		}
	}
	getAllRidesData(){ //this service method is used for testing purpose only (debug rides array on Postman app)
		return rides;
	}
}

module.exports = CabBookingService;