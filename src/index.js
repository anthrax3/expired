const isPast = require('date-fns/is_past');
const differenceInMilliseconds = require('date-fns/difference_in_milliseconds');
const addSeconds = require('date-fns/add_seconds');
const parse = require('parse-headers');

// Returns boolean for whether or not the cache has expired
const expired = headers => isPast(expired.on(headers));

// Return ms until cache expires
expired.in = headers => differenceInMilliseconds(expired.on(headers), new Date());

// Returns date when cache will expire
expired.on = headers => {
	// Parse headers if we got a raw string
	headers = (typeof headers === 'string') ? parse(headers) : headers;

	// Date from headers
	const originDate = new Date(headers.date);

	// Get max age ms
	let maxAge = headers['cache-control'] && headers['cache-control'].match(/max-age=(\d+)/);
	maxAge = parseInt(maxAge ? maxAge[1] : 0, 10);

	// Take current age into account
	if (headers.age) {
		maxAge -= headers.age;
	}

	// Calculate expirey date
	return addSeconds(originDate, maxAge);
};

module.exports = expired;
