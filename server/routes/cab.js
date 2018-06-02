const express = require('express');
const _ = require('underscore');
const CabBookingService = require('../services/CabBookingService');
const validateUserObj = require('../services/validationServices').validateUserObj;

const router = express.Router();
const cabServices = new CabBookingService();

router.get('/',(req,res)=>{
    res.send(cabServices.getAllCabData(false));    
});

router.get('/:showAll',(req,res)=>{
    res.send(cabServices.getAllCabData(true));
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



module.exports = router;