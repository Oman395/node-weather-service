import noaa from './index.js';
(async () => {
    console.log(`Testing endpoints...`);
    console.log(`If anything fails, it's around a 50/50 that the endpoint is down.`);
    console.log(`Check either by navigating to that endpoint in a browser, or checking at https://www.weather.gov/documentation/services-web-api`);
    console.log(`It should be noted that sometimes a 404 page can return an OK result, so make sure to double check results.`)
    try {
        let alerts = await noaa.getAlerts({ start: '2021-06-24T09:07:21-07:00', end: '2021-06-23T09:07:21-07:00' });
        if (alerts) console.log(`ALERTS: OK`);
        else console.log(`ALERTS: FAIL - RESPONSE: ${alerts}`);
    } catch (e) {
        console.log(`ALERTS: FAIL - ERROR: ${e}`);
    }
    try {
        let glossary = await noaa.getGlossary();
        if (glossary) console.log(`GLOSSARY: OK`);
        else console.log(`GLOSSARY: FAIL - RESPONSE: ${glossary}`);
    } catch (e) {
        console.log(`GLOSSARY: FAIL - ERROR: ${e}`);
    }
    try {
        let gridpoint = await noaa.getGridPoint(null, 40.7, -74, { useLatLon: true, forecast: true, hourly: true });
        if (gridpoint) console.log(`GRIDPOINT: OK`);
        else console.log(`GRIDPOINT: FAIL - RESPONSE: ${gridpoint}`);
    } catch (e) {
        console.log(`GRIDPOINT: FAIL - ERROR: ${e}`);
    }
    try {
        let stations = await noaa.getStations({ id: 'K12N' });
        if (stations) console.log(`STATIONS: OK`);
        else console.log(`STATIONS: FAIL - RESPONSE: ${stations}`);
    } catch (e) {
        console.log(`STATIONS: FAIL - ERROR: ${e}`);
    }
    try {
        let office = await noaa.getOffices({ id: 'OKX' });
        if (office) console.log(`OFFICE: OK`);
        else console.log(`OFFICE: FAIL - RESPONSE: ${office}`);
    } catch (e) {
        console.log(`OFFICE: FAIL - ERROR: ${e}`);
    }
    try {
        let point = await noaa.getPoint({ lat: 40.7, lon: -74 });
        if (point) console.log(`POINT: OK`);
        else console.log(`POINT: FAIL - RESPONSE: ${point}`);
    } catch (e) {
        console.log(`POINT: FAIL - ERROR: ${e}`);
    }
    try {
        let radar = await noaa.getRadar({ stationid: 'K12N', stations: true });
        if (radar) console.log(`RADAR: OK`);
        else console.log(`RADAR: FAIL - RESPONSE: ${radar}`);
    } catch (e) {
        console.log(`RADAR: FAIL - ERROR: ${e}`);
    }
    try {
        let products = await noaa.getProducts({ locations: true, types: true, typeid: 'ABV', locationid: 'OKX' });
        if (products) console.log(`PRODUCTS: OK`);
        else console.log(`PRODUCTS: FAIL - RESPONSE: ${products}`);
    } catch (e) {
        console.log(`PRODUCTS: FAIL - ERROR: ${e}`);
    }
    try {
        let zones = await noaa.getZones({ type: 'land', zoneid: 'ANZ338', forecast: true });
        if (zones) console.log(`ZONES: OK`);
        else console.log(`ZONES: FAIL - RESPONSE: ${zones}`);
    } catch (e) {
        console.log(`ZONES: FAIL - ERROR: ${e}`);
    }
})();