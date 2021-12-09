import https from 'https';

// wonderful. My goddamn first stuff that a spent a bunch of time on is pulling 301 errors and redirecting to
// a url that also pulls 301 errors. so now I need to go to https://www.weather.gov/documentation/services-web-api.
// yay.

// Anyway, this is just a simple API wrapper for api.weather.gov. Not much honestly, might add some more APIs to
// get a nice full on weather API in the future; for now, it's just a wrapper for the NWS api.

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
    return new Promise((rs, rj) => {
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
            res.on('end', () => {
                if (res.statusCode != 200) rj('Non 200 status code: ' + res.statusCode);
                rs(JSON.parse(data))
            });
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
            res.on('end', () => {
                if (res.statusCode != 200) rj('Non 200 status code: ' + res.statusCode);
                rs(JSON.parse(data))
            });
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
                        if (res.statusCode != 200) rj('Non 200 status code: ' + res.statusCode);
                        const gridpoint = JSON.parse(data);
                        x = parseInt(gridpoint.properties.gridX);
                        y = parseInt(gridpoint.properties.gridY);
                        wfo = gridpoint.properties.gridId;
                        url = `/gridpoints/${wfo}/${x},${y}`;
                        r();
                    });
                })
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
            res.on('end', () => {
                if (res.statusCode != 200) rj('Non 200 status code: ' + res.statusCode);
                rs(JSON.parse(data))
            });
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
            res.on('end', () => {
                if (res.statusCode != 200) rj('Non 200 status code: ' + res.statusCode);
                rs(JSON.parse(data))
            });
        })
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
            res.on('end', () => {
                if (res.statusCode != 200) rj('Non 200 status code: ' + res.statusCode);
                rs(JSON.parse(data))
            });
        })
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
            res.on('end', () => {
                if (res.statusCode != 200) rj('Non 200 status code: ' + res.statusCode);
                rs(JSON.parse(data))
            });
        })
    });
}
/**
 * Get radar data from NWS
 * @param {object} options 
 * @param {boolean} options.servers whether to get radar server data
 * @param {string} options.serverid radar server id to get data for (needs servers)
 * @param {boolean} options.stations whether to get radar station data
 * @param {string} options.stationid station ID to get stations data from (needs stations or profilers)
 * @param {boolean} options.alarms whether to get alarms from station (needs stationid)
 * @param {string} options.queuehost whether to get queue data, and host for that
 * @param {boolean} options.profilers whether to get profilers from station (needs stationid)
 * @param {string} options.reportingHost I don't know what this is, but the site says 'Show RDA and latency info from specific reporting host'
 */
export function getRadar(options = {}) {// Currently pulling 503 errors so
    // not a lot of testing has happened, proceed with caution.
    return new Promise((rs, rj) => {
        let url = '/radar';
        if (options.servers) {
            url += '/servers';
            if (options.serverid) url += `/${options.serverid}`;
        } else if (options.stations) {
            url += '/stations';
            if (options.stationid) url += `/${options.stationid}`;
            if (options.alarms && options.stationid) url += '/alarms';
        } else if (options.queuehost) {
            url += `/queuehost/${options.queuehost}`;
        } else if (options.profilers) {
            url += `/profilers/${options.stationid}`;
        } else {
            rj('Not enough options provided');
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
            res.on('end', () => {
                if (res.statusCode != 200) rj('Non 200 status code: ' + res.statusCode);
                rs(JSON.parse(data))
            });
        });
    });
}
/**
 * Get products from NWS
 * @param {object} options
 * @param {boolean} options.locations Get a list of valid locations
 * @param {boolean} options.types Get a list of valid product types and codes
 * @param {string} options.typeid Product type id to get data for
 * @param {string} options.locationid Location id to get data for
 */
export function getProducts(options = {}) {
    return new Promise((rs, rj) => {
        let url = '/products';
        if (options.types && options.typeid) {
            url += '/types';
            if (options.typeid) {
                url += `/${options.typeid}`;
                if (options.locations) url += '/locations';
                if (options.locationid) url += `/${options.locationid}`;
            }
        } else if (options.locations) {
            url += '/locations';
            if (options.locationid) {
                url += `/${options.locationid}`;
                if (options.types) url += '/types';
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
            res.on('end', () => {
                if (res.statusCode != 200) rj('Non 200 status code: ' + res.statusCode);
                rs(JSON.parse(data))
            });
        })
    });
}
/**
 * Get zone data from NWS
 * @param {object} options 
 * @param {string} options.type whether to use type
 * @param {boolean} options.forecast whether to get forecast
 * @param {boolean} options.observations whether to get observations. Dependent on both forecast and zoneid.
 * @param {boolean} options.stations whether to get stations. Dependant on both forecast and zoneid.
 * @param {string} options.zoneid zone id to get data for
 * @param {number} options.lattitude latitude of zone. needs point
 * @param {number} options.longitude longitude of zone. neeeds point
 * @param {boolean} options.point whether to get point. needs lattitude and longitude
 */
export function getZones(options = {}) { // This one is pulling error 500 and I can't figure out why.
    // Using the portal at https://www.weather.gov/documentation/services-web-api#/default/zone_obs, it's not even
    // working, so IDEK what's wrong.
    // I might just have a bad zone id?
    // In any case, lat/lon works, so I'm going to use that.
    return new Promise((rs, rj) => {
        let url = '/zones';
        if (options.type) {
            url += '/type';
            if (options.zoneid) {
                url += `/${options.zoneid}`;
                if (options.forecast) url += '/forecast';
            }
        } else if (options.forecast && options.zoneid && options.observations || options.stations) {
            url += `/forecast/${options.zoneid}`;
            if (options.observations) url += '/observations';
            else url += '/stations';
        } else if (options.point && options.lattitude && options.longitude) {
            url += `?point=${options.lattitude},${options.longitude}`;
        }
        const o = {
            hostname: 'api.weather.gov',
            path: url,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux Mint/18.3; x86_64) Gecko Firefox/46.0.4'  // Linux mint, x64, node lts v16
            }
        }
        console.log(url);
        https.get(o, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode != 200) rj('Non 200 status code: ' + res.statusCode);
                rs(JSON.parse(data))
            });
        });
    });
}

export default {
    getAlerts,
    getGlossary,
    getGridPoint,
    getStations,
    getOffices,
    getPoint,
    getRadar,
    getProducts,
    getZones
}