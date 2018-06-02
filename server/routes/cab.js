const express = require('express');
const _ = require('underscore');
const CabBookingService = require('../services/CabBookingService');
const validateUserObj = require('../services/validationServices').validateUserObj;
const validateRideId = require('../services/validationServices').validateRideId;

const router = express.Router();
const cabServices = new CabBookingService();

router.get('/',(req,res)=>{
    res.send(cabServices.getAllCabData(false));    
});

/*router.get('/:showAll',(req,res)=>{ // route for debugging and testing purpose
    res.send(cabServices.getAllCabData(true));
});*/

router.get('/allRides',(req,res)=>{ //route for testing and debugging purpose
    res.send(cabServices.getAllRidesData());    
});

router.post('/bookCab',(req,res)=>{
    let errorObj = validateUserObj(req.body);
    if(errorObj){
        res.status(400).send({error: errorObj.details[0].message});
    }else{
        let nearestCabObj = cabServices.findCab(req.body);
        if(!_.isEmpty(nearestCabObj)){
        	let rideObj = cabServices.bookCab(nearestCabObj,req.body);
        	res.send(rideObj); // ride id to be persisted (may be a modal) on front-end for future use
        }else{
        	res.send({noCabs: true}); //rejecting the user request, can be handled on front-end.
        }
    }
});

router.post('/cancelCab',(req,res)=>{
	let errorObj = validateRideId(req.body);
	if(errorObj){
        res.status(400).send({error: errorObj.details[0].message});
    }else{
    	let canceledRide = cabServices.cancelBooking(req.body.id);
    	if(canceledRide) res.send({success:"cancelled successfully"});
    	else res.send({failure:"cannot be cancelled"});
    }
});

router.post('/beginWait',(req,res)=>{
	let errorObj = validateRideId(req.body);
	if(errorObj){
        res.status(400).send({error: errorObj.details[0].message});
    }else{
    	let beginWait = cabServices.beginWait(req.body.id);
    	if(beginWait) res.send({success:"Waiting time started"});
    	else res.send({failure:"failed"});
    }
});

router.post('/beginRide',(req,res)=>{
	let errorObj = validateRideId(req.body);
	if(errorObj){
        res.status(400).send({error: errorObj.details[0].message});
    }else{
    	let hasRideBegan = cabServices.beginRide(req.body.id);
    	if(hasRideBegan) res.send({success:"ride has begun"});
    	else res.send({failure:"ride doesn't exist"});
    }
});

router.post('/endRide',(req,res)=>{
	let errorObj = validateRideId(req.body);
	if(errorObj){
        res.status(400).send({error: errorObj.details[0].message});
    }else{
    	let rideObj = cabServices.endRide(req.body.id);
    	if(!_.isEmpty(rideObj)){
    		let costSummary = cabServices.calculateFare(rideObj);
    		res.send(costSummary);
    	}else{
    		res.send({error: "cannot end ride"});
    	}
    }
});


module.exports = router;