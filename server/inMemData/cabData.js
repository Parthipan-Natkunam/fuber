/* an in-memory cab record of 5 cabs that forms a fleet. 
This is done for the purpose of POC. 
This should be records in DB in a real solution*/
let cabData = [
	{
		"id": 1, 
		"location" : [1.2,1.3], //lat,long taken as 1 digit after decimal point for simplicity
		"color": "black", 
		"isAvailable": true, 
		"hasPickedupCustomer": false, 
		"isWaiting": false
	},
	{
		"id": 2, 
		"location" : [2,1.5],
		"color": "black", 
		"isAvailable": true, 
		"hasPickedupCustomer": false, 
		"isWaiting": false
	},
	{
		"id": 3, 
		"location" : [2.7,3],
		"color": "pink", 
		"isAvailable": true, 
		"hasPickedupCustomer": false, 
		"isWaiting": false
	},
	{
		"id": 4, 
		"location" : [5,5],
		"color": "black", 
		"isAvailable": true, 
		"hasPickedupCustomer": false, 
		"isWaiting": false
	},
	{
		"id": 5, 
		"location" : [4.2,2.4], 
		"color": "pink", 
		"isAvailable": true, 
		"hasPickedupCustomer": false, 
		"isWaiting": false
	}
];