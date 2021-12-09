import https from 'https';

// wonderful. My goddamn first stuff that a spent a bunch of time on is pulling 301 errors and redirecting to
// a url that also pulls 301 errors. so now I need to go to https://www.weather.gov/documentation/services-web-api.
// yay.

/**
 * Get NOAA weather alerts
 * Options are mutually exclusive, with the exception that zone, area, and region are all dependent on
 * active being true.
 * @param {object} options Options object
 * @param {boolean} options.active (dep) active only
 * @param {string} options.start start time
 * @param {string} options.end end time
 * @param {array[string]} options.status status (actual, excersize, system, test, draft)
 * @param {array[string]} options.messagetype message type (alert, update, cancel);
 * @param {array[string]} options.event event type
 * @param {array[string]} options.code event code
 * @param {string} options.area State/territory area code
 * @param {array[string]} options.region Marine region code.
 * @param {string} options.regionType Region type (land/marine)
 * @param {array[string]} options.zone Zone id
 * @param {array[string]} options.urgency Urgency (immediate, expected, future, past, unknown).
 * @param {array[string]} options.severity Severity (severe, moderate, minor, unknown).
 * @param {array[string]} options.certainty Certainty (observed, likely, possible, unlikely, unknown).
 * @param {number} options.limit max number of results
 * @param {string} options.cursor Pagination cursor. Don't ask me what it does b/c IDK either
 */
export function getAlerts(options = {}) {
    return new Promise((re, rj) => {
        let url = '/alerts?';
        if (options.start) url += `start=${options.start}&`;
        if (options.end) url += `end=${options.end}&`;
        if (options.status) url += `status=${options.status.join(',')}&`;
        if (options.messagetype) url += `message_type=${options.messagetype.join(',')}&`;
        if (options.event) url += `event=${options.event.join(',')}&`;
        if (options.code) url += `code=${options.code.join(',')}&`;
        if (options.area) url += `area=${options.area}&`;
        if (options.region) url += `region=${options.region.join(',')}&`;
        if (options.regionType) url += `region_type=${options.regionType}&`;
        if (options.zone) url += `zone=${options.zone.join(',')}&`;
        if (options.urgency) url += `urgency=${options.urgency.join(',')}&`;
        if (options.severity) url += `severity=${options.severity.join(',')}&`;
        if (options.certainty) url += `certainty=${options.certainty.join(',')}&`;
        if (options.limit) url += `limit=${options.limit}&`;
        if (options.cursor) url += `cursor=${options.cursor}&`;
        url = url.slice(0, url.length - 1);
        const o = {
            hostname: 'api.weather.gov',
            path: url,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux Mint/18.3; x86_64) Gecko Firefox/46.0.4'  // Linux mint, x64, node lts v16
            }
        };
        https.get(o, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => re(JSON.parse(data)));
        });
    });
}
/**
 * Super bloody simple. Literally no arguments; it just returns the NOAA glossary endpoint.
 */
export function getGlossary() {
    return new Promise((rs, rj) => {
        const o = {
            hostname: 'api.weather.gov',
            path: '/glossary',
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux Mint/18.3; x86_64) Gecko Firefox/46.0.4'  // Linux mint, x64, node lts v16
            }
        };
        https.get(o, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => rs(JSON.parse(data)));
        });
    })
}
/**
 * Get data from a grid point
 * @param {string} wfo WFO. If using latlong, set this to null.
 * @param {number} x Grid point x. If using latlong, this is the lattitude.
 * @param {number} y grid point y. If using latlong, this is the longitude.
 * @param {object} options 
 * @param {boolean} options.forecast whether to get forecast data
 * @param {boolean} options.forecastTempQV whether to represent forecast temp as quantitative
 * @param {boolean} options.forecastWindQV whether to represent forecast wind as quantitative
 * @param {string} options.units units to use (us, si);
 * @param {boolean} options.hourly whether to make forecast data hourly
 * @param {boolean} options.stations whether to get stations from gridpoint (incompatible with forecast)
 * @param {boolean} options.useLatLong whether to use lat/long instead of x/y. Will need to get a gridpoint first so this call will take a while
 */
export function getGridPoint(wfo, x, y, options = {}) {
    return new Promise(async (rs, rj) => {
        let url = `/gridpoints/${wfo}/${x},${y}`;
        if (!options.useLatLong) {
            await new Promise(r => {
                https.get({
                    hostname: 'api.weather.gov',
                    path: `/points/${x},${y}`,
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (X11; Linux Mint/18.3; x86_64) Gecko Firefox/46.0.4'  // Linux mint, x64, node lts v16
                    }
                }, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        const gridpoint = JSON.parse(data);
                        x = parseInt(gridpoint.properties.gridX);
                        y = parseInt(gridpoint.properties.gridY);
                        wfo = gridpoint.properties.gridId;
                        url = `/gridpoints/${wfo}/${x},${y}`;
                        r();
                    });
                }).end();
            });
        }
        if (options.forecast) {
            url += '/forecast';
            if (options.hourly) url += '/hourly';
            if (options.forecastTempQV || options.forecastWindQV || options.units) url += '?';
            if (options.forecastTempQV) url += 'forecast_temp_qv=true&';
            if (options.forecastWindQV) url += 'forecast_wind_qv=true&';
            if (options.units) url += `units=${options.units}&`;
        } else if (options.stations) {
            url += '/stations';
        }
        const o = {
            hostname: 'api.weather.gov',
            path: url,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux Mint/18.3; x86_64) Gecko Firefox/46.0.4'  // Linux mint, x64, node lts v16
            }
        };
        https.get(o, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => rs(JSON.parse(data)));
        });
    });
}
/**
 * Get station data from station id, or list of stations
 * @param {object} options
 * @param {boolean} options.observations whether to get observations
 * @param {boolean} options.latest whether to get latest observations (incompatible with time)
 * @param {string} options.time time to get observations for (incompatible with latest)
 * @param {string} options.id station id to get data for
 */
export function getStations(options = {}) {
    return new Promise((rs, rj) => {
        let url = '/stations';
        if (options.id) {
            url += `/${options.id}`;
            if (options.observations) {
                url += '/observations';
                if (options.latest) url += '/latest';
                else if (options.time) url += `/${options.time}`;
            }
        }
        const o = {
            hostname: 'api.weather.gov',
            path: url,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux Mint/18.3; x86_64) Gecko Firefox/46.0.4'  // Linux mint, x64, node lts v16
            }
        }
        https.get(o, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => rs(data));
        }).end();
    });
}
/**
 * Get office data from office id
 * @param {object} options 
 * @param {string} options.id office id to get data for
 * @param {boolean} options.headlines whether to get headlines
 * @param {string} options.headlineid headline id to get data for
 */
export function getOffices(options) {
    return new Promise((rs, rj) => {
        let url = '/offices';
        if (options.id) url += `/${options.id}`;
        else rj('No id provided');
        if (options.headlines) url += '/headlines';
        if (options.headlineid) url += `/${options.headlineid}`;
        const o = {
            hostname: 'api.weather.gov',
            path: url,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux Mint/18.3; x86_64) Gecko Firefox/46.0.4'  // Linux mint, x64, node lts v16
            }
        }
        https.get(o, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => rs(data));
        }).end();
    });
}
/**
 * Get data on a point. The better version of getGridPoint.
 * @param {object} options 
 * @param {number} options.lat latitude of point
 * @param {number} options.lon longitude of point
 */
export function getPoint(options = {}) {
    return new Promise((rs, rj) => {
        const o = {
            hostname: 'api.weather.gov',
            path: `/points/${options.lat},${options.lon}`,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux Mint/18.3; x86_64) Gecko Firefox/46.0.4'  // Linux mint, x64, node lts v16
            }
        }
        https.get(o, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => rs(data));
        }).end();
    });
}
export default {
    getAlerts,
    getGlossary,
    getGridPoint,
    getStations,
    getOffices,
    getPoint
}