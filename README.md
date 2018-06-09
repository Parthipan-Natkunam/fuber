# fuber
A POC prototype code to simulate the RESTful APIs of an imaginary cab booking service
<p align="center">
    <img src="/reameImg/html.jpg" alt="screenshot"/>	
</p>

## End of Ride Console Log:
<p align="center">
    <img src="/reameImg/console.jpg" alt="console log" />
</p>
	

## Important Note:
To successfully run the project, it is advised to use node version ```8.11.2``` or greater

## steps to run the project:
1. Install the dependencies for the node server code<br/>
```cd fuber/server```<br/>
```npm install```

2. To run the unit test <br/>
```npm test```<br/>
The tests cases in the module assumes that all cabs are available at the start of the app. So it is advised to run this command first before running the app, if you are to run tests.<br/>
** Note: ** The API test Json file from Postman is in a folder within the tests folder

3. To start the server<br/>
```npm start```<br/>

The testing and API interactions were done through postman with raw JSON type in the request body.

## Approach taken:
1. The distance is calculated by using Pythogoras theorem to simplify for the purpose of POC.
<p align="center">
     <img src="/reameImg/distanceCalc.jpg" alt="distance calc"/> 
 </p>
 
2. The entire operation is modelled as a service.
3. Restful APIs consume the service to provide required response on request.
4. Request validators have been put in place using ```JOI``` module for ```POST```
requests.
5. For maintaing a simplistic  POC approach, all data are held in memory.

### Tech Stack:
1. Node.js
2. Express
3. Jade (for server-side rendering of markup template)
4. Postman (for API Testing)

### API
|Endpoint|type|request params|response|
|--------|----|---------|------|
|/|get|-|a list of available cab data|
|/bookCab|post|id(userId),location,dropLocation,preferedColor|a ride object containing ride details or error|
|/cancelCab|post|id(rideId)|success or error property|
|/beginWait|post|id(rideId)|success or error property|
|/beginRide|post|id(rideId)|success or error property|
|/endRide|post|id(rideId)|total cost data for the ride or error |

### Request, Response Sample:

#### bookCab:
##### request:
```
{
	"id": 1,
	"loc":{
		"lat": 4,
		"long": 3.6	
	},
	"dropLoc":{
		"lat": 6,
		"long": 7.6	
	},
	"prefCol": "any"	
}
```

##### Response:
```
{
    "id": 3,
    "cabId": 5,
    "cabIndex": 4,
    "userLoc": [
        4,
        3.6
    ],
    "dropLoc": [
        6,
        7.6
    ]
}
```
#### beginWait
##### Request:
```
{
	"id": 3
}
```

##### Response:
```
{
    "success": "Waiting time started"
}
```

#### beginRide
##### Request:
```
{
	"id": 3
}
```

##### Response
```
{
    "success": "ride has begun"
}
```

#### endRide
##### Request:
```
{
	"id":4
}
```
##### Response:
```
{
    "total": 8.94,
    "travelCost": 8.94,
    "waitingCost": 0,
    "pinkFactor": 0
}
```
#### The root (/) API call to fetch all availble Cabs
This is a ```GET``` type request
The response for this request will be a server-side rendered HTML template showing available cabs with highlights for pink cabs.

### Assumptions made:
1. The cab cannot be cancelled once it has started waiting for the client or the ride is started.
2. Can be cancelled before any of the above happens.
3. All the distance unit is assumed to be in Km by default.
