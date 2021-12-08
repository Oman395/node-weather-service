import https from 'https';

// wonderful. My goddamn first stuff that a spent a bunch of time on is pulling 301 errors and redirecting to
// a url that also pulls 301 errors. so now I need to go to https://www.weather.gov/documentation/services-web-api.
// yay.

/**
 * Get NOAA weather alerts
 * Options are mutually exclusive, with the exception that zone, area, and region are all dependent on
 * active being true.
 * @param {object} options Options object
 * @param {boolean} options.active Whether or not use the /active endpoint
 * @param {boolean} options.getTypes Whether it should be getting alert types
 * @param {boolean} options.count Get count of active alerts, requires active to be true
 * @param {string} options.zone The zone to get alerts for
 * @param {string} options.area The area to get alerts for
 * @param {string} options.region The region to get alerts for
 * @param {string} options.id The ID of alerts to look for
 */
export function getAlerts(options) {
    return new Promise((re, rj) => {
        let url = '';
        if (options.active) {
            if (options.zone) url = `/alerts/active/zone/${options.zone}`;
            else if (options.area) url = `/alerts/active/area/${options.area}`;
            else if (options.region) url = `/alerts/active/region/${options.region}`;
            else if (options.count) url = '/alerts/active/count';
            else url = '/alerts/active';
        } else {
            if (options.getTypes) url = '/alerts/types';
            else if (options.id) url = '/alerts/id'
            else {
                url = '/alerts'
            }
        }
        https.request({
            hostname: 'api.weather.gov',
            path: url,
            method: 'GET',
            port: 443,
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux Mint/17.3; x86_64) Gecko Firefox/43.0.4'
            },
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.once('end', () => re(data));
        }).end();
    });
}
/**
 * Get station or station data from NOAA
 * @param {object} options options object
 * @param {string} options.id Station ID
 * @param {boolean} headline Whether to include the /headline endpoint
 * @param {string} options.headlineId Headline ID. Dependent on id being set.
 */
export function getStation(options) {
    return new Promise((re, rj) => {
        if (options.headline) {
            let url = '/stations/headlines'
            if (options.headlineId) {
                url += '/' + options.headlineId;
            }
            https.request({
                hostname: 'api.weather.gov',
                path: url,
                method: 'GET',
                port: 443,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux Mint/17.3; x86_64) Gecko Firefox/43.0.4'
                },
            }, res => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.once('end', () => re(data));
            }).end();
        } else {
            let url = '/stations';
            if (options.id) {
                url += '/' + options.id;
            }
            https.request({
                hostname: 'api.weather.gov',
                path: url,
                method: 'GET',
                port: 443,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux Mint/17.3; x86_64) Gecko Firefox/43.0.4'
                },
            }, res => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.once('end', () => re(data));
            });
        }
    });
}

export default {
    getAlerts,
    getStation,
}