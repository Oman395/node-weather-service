# Node weather service
### An api.weather.gov node.js wrapper
This is a fairly simple API to use, it's really just a couple commands. Honestly, the hardest part is navigating the screwed up documentation all the data that is used has-- it took me like 20 minutes to figure out what the hell a '[gridpoint](https://weather-gov.github.io/api/gridpoints)' is; I'll make an attempt to leave decent docs, but I'm not the best at it lol.
## Methods
### It's really just the NWS API
I'll just list the functions, hopefully my jsdoc is decent enoguh to carry me...
If you need more clarification, take a look at [this](https://www.weather.gov/documentation/services-web-api#/).

- getAlerts
- getGlossary
- getGridPoint
- getStations
- getOffices
- getPoint
- getRadar
- getProducts
- getZones
## Getting started
### In lieu of actual documentation, I'll give a basic getting started thing for each command.
#### Everything should start with this
```js
import weather from 'node-weather-service';
```
#### getAlerts
```js
weather.getAlerts({ // This script gets all alerts
// between June 23, 2021 and June 24, 2021
start: '2021-06-23T09:07:21-07:00', // Start time
end: '2021-06-24T09:07:21-07:00'
}) // End time
.then((alerts) => { // Once request is finished
	console.log(alerts);
});
```
#### getGlossary
```js
weather.getGlossary() // This is probably the simplest method in this api,
// it's literally just one function call with no args
.then((glossary) => {
console.log(glossary);
});
```
#### getGridPoint
```js
weather.getGridPoint(null, 40.7, -74, { // Get hourly forecast from NYC
useLatLon: true, // Use lattitude and longitude instead of the weird
// coordinate system
forecast: true, // Get forecast data
hourly: true
}) // Make data hourly
.then((gridPoint) => {
	console.log(gridPoint);
});
```
#### getStations
```js
weather.getStations({ id: 'K12N' }) // Get data from K12N Station
.then((stations) => {
	console.log(stations);
});
```
#### getOffices
```js
weather.getOffices({ id: 'OKX' }) // Gets data from OKX
// office
.then((offices) => {
	console.log(offices);
});
```
#### getPoint
```js
weather.getPoint({ lat: 40.7, lon: -74 }) // The chad version of
// getGridPoint
.then((point) => {
	console.log(point);
});
```
#### getRadar
##### Note: Currently throwing 503 errors even when used through official channels, so IDEK whats wrong, but I can't test right now. So this might be horribly broken.
```js
weather.getRadar({ stationid: 'K12N', stations: true })
// Get radar data from station K12N
.then((radar) => {
	console.log(radar);
});
```
#### getProducts
```js
weather.getProducts({ // Get all items of type ABV at OKX I don't really
// know what this does, but it works, so eh
locations: true, // Sort by location
types: true, // Sort by type
typeid: 'ABV', // Type ID
locationid: 'OKX'
}) // Location ID
.then((products) => {
	console.log(products);
});
```
### getZones
```js
weather.getZones({ // Get zone data of type land, id ANZ338
type: 'land',
zoneid: 'ANZ338',
forecast: true
})
.then((zone) => {
	console.log(zone);
});
```
## That's pretty much it.
If you have any questions, shoot me an email at oranroha@gmail.com, or dm me on twitter @omanthehuman1, or just raise an issue, and I should respond pretty quickly.
Contributions are greatly appreciated, to either my code or this dumpster fire of a readme.
Oh yea, MIT license, do whatever you want with my code but I'm not liable if anything goes wrong, no warranty, etc