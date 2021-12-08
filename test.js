import noaa from './index.js';
(async () => {
    let result = await noaa.getAlerts({});
    console.log(result);
})();