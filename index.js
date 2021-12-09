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
export function getAlerts(options) {
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
        console.log(url);
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
            res.on('end', () => re(data));
        });
    });
}
/**
 * Get station or station data from NOAA
 * @param {object} options options object
 * @param {string} options.id Station ID
 * @param {boolean} observations Whether to include the /observations endpoint
 * @param {boolean} latest get latest observation
 * @param {string} time Time to get observations. Obviously requires observations.
 */
export function getStation(options) {
    return new Promise((re, rj) => {
    });
}
/**
 * Get radar data
 * @param {object} options 
 * @param {boolean} options.servers contact the servers endpoint
 * @param {string} options.serverid server id. requires servers to be enabled.
 * @param {boolean} options.stations contact the stations endpoint
 * @param {string} options.stationid station id. requires stations or profiless to be enabled.
 * @param {boolean} options.stationalarm station alarms. requires stations and stationid.
 * @param {string} options.queueHost contact queue endpoint, and host for that.
 * @param {boolean} options.profilers contact profilers endpoint. requires stationid to function.
 */
export function getRadar(options) {
    return new Promise((re, rj) => {
    });
}
/**
 * Get zone data
 * Observations and stations are mutually exclusive.
 * @param {object} options 
 * @param {string} options.type Type of zone, contacts that endpoint
 * @param {string} options.zoneid zone id
 * @param {boolean} options.forecast whether to get forecast.
 * @param {boolean} option.observations enable observations. Requires forecast.
 * @param {boolean} options.stations get stations giving forcast. requires forecast.
 */
export function getZones(options) {
    return new Promise((re, rj) => {
    });
}

export default {
    getAlerts,
    getStation,
    getRadar,
    getZones
}