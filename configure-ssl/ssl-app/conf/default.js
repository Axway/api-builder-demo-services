const fs = require('fs');
/**
 * These are your configuration file defaults.
 *
 * You can create additional configuration files ending in default.js or local.js that the server will load.
 * The *local.js files are ignored by git/npm/docker by default. This is so you can develop your service locally
 * using a local.js and keep your production configs in the *default.js files.
 *
 * For example, you may want to develop your service using a test API key. You would place that API key in a local.js
 * file and it would get merged over the API key that is already present in default.js
 *
 * This is a JavaScript file (instead of JSON) so you can also use environment variables or perform logic in this file if needed.
 */
module.exports = {
	// these are your generated API keys.  They were generated uniquely when you created this project.
	// DO NOT SHARE these keys with other projects and be careful with these keys since they control
	// access to your API using the default configuration.  if you don't want two different keys for
	// production and test (not recommended), use the key 'apikey'.  To simulate running in production,
	// set the environment variable NODE_ENV to production before running such as:
	//
	// NODE_ENV=production app.js

	// API key
	apikey: 'GNN28aQClx9GvQHrLrdUw2sthAnajL5F',

	// This is the port the service will be bound to
	port: 8080,

	// This is the base url the service will be reachable at not including the port
	baseurl: 'http://localhost',

	// Enabling this property will print out the process.env at startup time
	printEnvVars: false,

	// Your ssl configuration goes here. The options are the same has what is used by
	// Node.js https.createServer() method
	// https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener

	ssl: {
		port: 8443,
		key: fs.readFileSync('./ssl/newKey.pem'),
		cert: fs.readFileSync('./ssl/cert.pem')
		// passphrase: process.env.API_BUILDER_SSL_PASSWORD
	},

	// by default the authentication strategy is 'basic' which will use HTTP Basic Authorization where the
	// usename is the key and the password is blank.  the other option is 'apikey' where the value of the
	// APIKey header is the value of the key.  you can also set this to 'plugin' and define the key 'APIKeyAuthPlugin'
	// which points to a file or a module that implements the authentication strategy
	APIKeyAuthType: 'basic',

	// The number of milliseconds before timing out a request to the server.
	timeout: 120000,

	// logging configuration
	logLevel: 'debug', // Log level of the main logger.

	// prefix to use for apis
	apiPrefix: '/api',

	// control the settings for the admin website
	admin: {
		// control whether the admin website is available
		enabled: true,
		// the prefix for the API documentation
		apiDocPrefix: '/apidoc',
		// if you set disableAPIDoc, in production your swagger API docs will not show up
		disableAPIDoc: false,
		// The hostnames or IPs from which connections to admin are allowed. Hostnames must be resolvable on the
		// server. IP ranges can also be specified. e.g. [ 'localhost', '192.168.1.0/24', '10.1.1.1' ]
		// An empty list [] will allow unrestricted access, though this is not recommended due to security concerns.
		allowedHosts: [
			'localhost', '::1'
		]
	},

	// you can generally leave this as-is since it is generated for each new project you created.
	session: {
		encryptionAlgorithm: 'aes256',
		encryptionKey: 'UTWgw67eAscy1x1Yk/ywNwi8DDhKK9egz/BB75J2VUA=',
		signatureAlgorithm: 'sha512-drop256',
		signatureKey: 'Ly6gowLtewea0OD2jZObJqwAAaxr/n1qWFtu2R5JjuvILRPw/pRYWGZmysnZz8EyIkevuHHmpHmVUtN4TPAhLg==',
		secret: 'LT710gOztItBN9kaZIghBOoz67G+XjCW', // should be a large unguessable string
		duration: 86400000, // how long the session will stay valid in ms
		activeDuration: 300000 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
	},

	// if you want signed cookies, you can set this value. if you don't want signed cookies, remove or make null
	cookieSecret: 'xMb8Ze6skdsQ/hNhpxR4rHUy9zASeunX',

	serialization: {
		// Here for backwards compatibility with older arrow apps. When you set this to
		// true, a model's primary key will always be exposed under 'id' instead of it's
		// actual name
		exposePrimaryKeyAsId: false
	},

	// your connector configuration goes here
	connectors: {
	},

	// the date and time format to be used for admin-ui. Default is 'yyyy:mm:dd, HH:MM:ss.l'
	// reference: https://github.com/felixge/node-dateformat
	dateTimeFormat: 'yyyy-mm-dd, HH:MM:ss.l',

	// cross-origin-resource-sharing settings
	cors: {
		// list of allowed origins (format: any, space separated string, array or regex)
		// 'Access-Control-Allow-Origin': '*' or 'http://foo.com http://bar.com' or ['http://foo.com', 'http://bar.com'] or /foo\.com$/,

		// 'Access-Control-Allow-Credentials': true/false,

		// only these methods will be allowed out of all available methods for an endpoint. All available methods are allowed by default
		// (format: comma separated string or, an array)
		// 'Access-Control-Allow-Methods': 'GET' or 'GET, PUT' or ['GET', 'PUT'],

		// allowed request headers (format: comma separated string or, an array)
		// 'Access-Control-Allow-Headers': 'content-type, authorization' or ['content-type', 'authorization']

		// list of response headers exposed to the user. Always exposed headers: request-id, response-time and any headers defined in the endpoint
		// (format: comma separated string or, an array)
		// 'Access-Control-Expose-Headers': 'content-type, response-time' or ['content-type', 'response-time']
	}
};
