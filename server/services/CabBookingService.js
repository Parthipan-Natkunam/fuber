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
		var isDifferentLocs = (userBookingObj.loc.lat !==userBookingObj.dropLoc.lat) || (userBookingObj.loc.long !== userBookingObj.dropLoc.long);
		if(isDifferentLocs){
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
		}else{
			return "E01:Same_Loc";
		}
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
		let rideObj = _.filter(rides,(ride)=>{return ride.id === rideId})[0];
		let result = 0;
		if(!_.isEmpty(rideObj) && typeof rideObj.wasCancelled === 'undefined'
		 && typeof rideObj.isComplete === "undefined"){
			let cabToCancel = cabs[rideObj.cabIndex];
			if(!cabToCancel.isWaiting && !cabToCancel.hasPickedupCustomer && !_.isEmpty(rideObj)){
				cabToCancel.isAvailable = true;	
				rideObj.wasCancelled = true; // for future data analysis if required assuming the  Prod will have a datastore for ride records.
				result = 1;
			}
		}
		return result;
	}
	beginWait(rideId){
		let rideObj = _.filter(rides,(ride)=>{return ride.id === rideId})[0];
		if(!_.isEmpty(rideObj) && typeof rideObj.wasCancelled === 'undefined'
		 && typeof rideObj.isComplete === "undefined"){
			if(!cabs[rideObj.cabIndex].isWaiting){
				rideObj.waitStartTime = new Date().getTime();
				cabs[rideObj.cabIndex].isWaiting = true;
				return 1;
			}else{
				return 2;
			}
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
		let invoiceData = void 0;
		if(typeof rideObj.waitEndTime !== 'undefined'){
			let waitDelta = rideObj.waitEndTime - rideObj.waitStartTime;
			let waitSec = Math.floor(waitDelta/1000); //since delta is im ms
			let waitInMins = Math.floor(waitSec/60);
			waitingCost  = perMinWaitingCost*waitInMins; // adding this even though cost is 1 per minute, to support future changes in wait cost
		}
		travelCost = (totalDistanceTravelled*perKmCost) //assuming the distance is in Km already
		totalCost = travelCost + waitingCost;
		invoiceData = {total:totalCost,travelCost:travelCost,waitingCost:waitingCost,pinkFactor: 0};
		if(cabs[rideObj.cabIndex].color === "pink"){
				totalCost += additionalPinkCost;
				invoiceData = {total:totalCost,travelCost:travelCost,waitingCost:waitingCost,pinkFactor:additionalPinkCost};
		}
		return invoiceData;
	}
	beginRide(rideId){
		let rideObj = _.filter(rides,(ride)=>{return ride.id === rideId})[0];
		if(!_.isEmpty(rideObj) && typeof rideObj.wasCancelled === 'undefined'
		 && typeof rideObj.isComplete === "undefined"){
			let cabObj = cabs[rideObj.cabIndex];
			if(!cabObj.hasPickedupCustomer){
				if(cabObj && cabObj.isWaiting){
				rideObj.waitEndTime = new Date().getTime();
				cabObj.isWaiting = false;	
				} 
				cabObj.hasPickedupCustomer = true;
				return 1;
			}else{
				return 2;
			}
		}
		return 0;
	}
	endRide(rideId){
		let rideObj = _.filter(rides,(ride)=>{return ride.id === rideId})[0];
		if(!_.isEmpty(rideObj) && typeof rideObj.wasCancelled === 'undefined'
		 && typeof rideObj.isComplete === "undefined"){
			let cabObj = cabs[rideObj.cabIndex];
			if(cabObj && !cabObj.isWaiting && cabObj.hasPickedupCustomer){
				cabObj.hasPickedupCustomer = true;
				cabObj.isAvailable = true;
				cabObj.location = rideObj.dropLoc;
				rideObj.isComplete = true;
				return rideObj;	
			}		
		}
		return void 0;
	}
	getAllCabData(canShowAll){
		if(canShowAll) return cabs;
		else{ // added for testing and debugging purpose
			return _.filter(cabs,(cab)=>{return cab.isAvailable === true});
		}
	}
	getAllRidesData(){ //this service method is used for testing purpose only (debug rides array on Postman app)
		return rides;
	}
}

module.exports = CabBookingService;