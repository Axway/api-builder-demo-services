const APIBuilder = require('@axway/api-builder-runtime');
const request = require('request');
const mockedEnv = require('mocked-env');

/**
 * Start the API Builder server.
 * @param {Object} envOverrides The environment variables to load API Builder with.
 * @return {Object} The details for the started server.
 * @property {APIBuilder} apibuilder - The server.
 * @property {Promise} started - The promise that resolves when the server is started.
 */
function startApiBuilder(envOverrides) {
	const env = {
		NEWSAPI_APIKEY: 'newsapikey',
		APIKEY: 'test',
		APIKEYAUTHTYPE: 'basic',
		...envOverrides
	};

	const restoreEnv = mockedEnv(env);

	const server = new APIBuilder({
		overrideLevel: 'FATAL'
	});

	const startPromise = new Promise((resolve, reject) => {
		server.on('error', reject);
		server.on('started', resolve);
		server.start();
	});

	/** Stop the API Builder server. */
	async function stopApiBuilder() {
		// Restore the original environment
		await startPromise;
		await server.stop();
		APIBuilder.resetGlobal();
		restoreEnv();
	}

	return {
		apibuilder: server,
		started: startPromise,
		stop: stopApiBuilder
	};
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
	requestAsync
};
