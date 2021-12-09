import weather from '../index.js'; // Replace with 'node-weather-service' if you installed it via npm
weather.getAlerts({ // This script gets all alerts
    // between June 23, 2021 and June 24, 2021
    start: '2021-06-23T09:07:21-07:00', // Start time
    end: '2021-06-24T09:07:21-07:00'
}) // End time
    .then((alerts) => { // Once request is finished
        console.log(alerts);
    });
weather.getGlossary() // This is probably the simplest
    // method in this api, it's literally just one function call with no args
    .then((glossary) => {
        console.log(glossary);
    });
weather.getGridPoint(null, 40.7, -74, { // Get hourly
    // forecast from NYC
    useLatLon: true, // Use lattitude and longitude instead of the weird
    // coordinate system
    forecast: true, // Get forecast data
    hourly: true
}) // Make data hourly
    .then((gridPoint) => {
        console.log(gridPoint);
    });
weather.getStations({ id: 'K12N' }) // Get data from K12N
    // Station
    .then((stations) => {
        console.log(stations);
    });
weather.getOffices({ id: 'OKX' }) // Gets data from OKX
    // office
    .then((offices) => {
        console.log(offices);
    });
weather.getPoint({ lat: 40.7, lon: -74 }) // The chad version
    // of getGridPoint
    .then((point) => {
        console.log(point);
    });
weather.getRadar({ stationid: 'K12N', stations: true })
    // Get radar data from station K12N
    .then((radar) => {
        console.log(radar);
    });
weather.getProducts({ // Get all items of type ABV at OKX
    // I don't really know what this does, but it works, so eh
    locations: true, // Sort by location
    types: true, // Sort by type
    typeid: 'ABV', // Type ID
    locationid: 'OKX'
}) // Location ID
    .then((products) => {
        console.log(products);
    });
weather.getZones({ // Get zone data of type land, id ANZ338
    type: 'land',
    zoneid: 'ANZ338',
    forecast: true
})
    .then((zone) => {
        console.log(zone);
    });