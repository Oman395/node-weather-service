import noaa from './index.js';
(async () => {
    console.log(`Testing endpoints...`);
    console.log(`If anything fails, it's around a 50/50 that the endpoint is down.`);
    console.log(`Check either by navigating to that endpoint in a browser, or checking at https://www.weather.gov/documentation/services-web-api`);
    console.log(`It should be noted that sometimes a 404 page can return an OK result, so make sure to double check results.`)
    try {
        let alerts = await noaa.getAlerts({start:'2021-06-24T09:07:21-07:00', end:'2021-06-23T09:07:21-07:00'});
        if (alerts) console.log(`ALERTS: OK`);
        else console.log(`ALERTS: FAIL - RESPONSE: ${alerts}`);
    } catch (e) {
        console.log(`ALERTS: FAIL - ERROR: ${e}`);
    }
})();