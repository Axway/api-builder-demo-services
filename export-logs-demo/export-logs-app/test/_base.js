const Arrow = require('arrow');
const request = require('request');

/**
 * Start the API Builder server.
 * @return {Object} The details for the started server.
 * @property {Arrow} arrow - The arrow server.
 * @property {Promise} started - The promise that resolves when the server is started.
 */
function startApiBuilder() {
	var server = new Arrow({
		overrideLevel: 'FATAL',
		apikey: 'test',
		APIKeyAuthType: 'basic'
	});

	var startPromise = new Promise((resolve, reject) => {
		server.on('error', reject);
		server.on('started', resolve);
		server.start();
	});

	return {
		arrow: server,
		started: startPromise
	};
}

/**
 * Stop the API Builder server.
 * @param {Object} server The object returned from startApiBuilder().
 * @return {Promise} The promise that resolves when the server is stopped.
 */
function stopApiBuilder(server) {
	return new Promise((resolve, reject) => {
		server.started
			.then(() => {
				server.arrow.stop(() => {
					Arrow.resetGlobal();
					resolve();
				});
			})
			.catch(err => {
				reject(err);
			});
	});
}

function requestAsync(uri, options, cb) {
	if (!cb && options) {
		cb = options;
		options = null;
	}
	return new Promise((resolve, reject) => {
		request(uri, options, (err, response, body) => {
			if (err) {
				return reject(err);
			}
			return resolve({
				response,
				body
			});
		});
	});
}

exports = module.exports = {
	startApiBuilder,
	stopApiBuilder,
	requestAsync
};
