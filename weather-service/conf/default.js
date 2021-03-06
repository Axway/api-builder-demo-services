/**
 * this is your configuration file defaults.
 *
 * You can create additional configuration files to that the server will load based on your
 * environment.  For example, if you want to have specific settings for production which are different
 * than your local development environment, you can create a production.js and a local.js.  Any changes
 * in those files will overwrite changes to this file (a object merge is performed). By default, your
 * local.js file will not be commited to git or the registry.
 *
 * This is a JavaScript file (instead of JSON) so you can also perform logic in this file if needed.
 */
module.exports = {
	// OpenWeather API Key: https://openweathermap.org
	OPENWEATHER_APIKEY: process.env.OPENWEATHER_APIKEY,

	// define if integrated with istio
	TLS_ORIGINATION: process.env.TLS_ORIGINATION === 'true',

	// these are your generated API keys.  They were generated uniquely when you created this project.
	// DO NOT SHARE these keys with other projects and be careful with these keys since they control
	// access to your API using the default configuration.  if you don't want two different keys for
	// production and test (not recommended), use the key 'apikey'.  To simulate running in production,
	// set the environment variable NODE_ENV to production before running such as:
	//
	// NODE_ENV=production app.js
	//
	// API key
	apikey: process.env.APIKEY || 'Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3',

	// This is the base url the service will be reachable at not including the port
	baseurl: 'http://localhost',

	// Enabling this property will print out the process.env at startup time
	printEnvVars: false,

	http: {
		// This is the port the service will be bound to
		port: parseInt(process.env.PORT) || 8080,
	},

	// Your ssl configuration goes here. The options are the same has what is used by
	// Node.js https.createServer() method
	// https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener

	// ssl: {
	// 	port: 8443
	// },

	// The number of milliseconds before timing out a request to the server.
	timeout: 120000,

	// Log level of the main logger. Can be set to 'debug', 'error', 'fatal', 'info', 'trace', or 'warn'.
	logLevel: process.env.LOGLEVEL || 'debug',

	// Prefix to use for APIs, access to which is governed via `accessControl`.
	apiPrefix: '/api',

	// Control access to the service.  Set the `apiPrefixSecurity` to change the authentication
	// security to APIs bound to `apiPrefix`.  Note that different authentication security require
	// different input parameters.  `apiPrefixSecurity` can be any of the following:
	//
	// 'none' - Disable authentication.  Note that this will make all APIs hosted on `apiPrefix`
	// public.
	//
	// 'ldap' - LDAP authentication.  Requires HTTP Basic Authentication (RFC 2617) scheme with
	// Base64 encoded username:password.  Also requires specifying configuration property named `ldap`.
	// It should be of type object and should contain required property `url` and optional properties described
	// in ldapauth-fork module docs.
	// See: https://www.npmjs.com/package/ldapauth-fork#ldapauth-config-options
	//
	// 'apikey' - HTTP header authentication.  Requires a HTTP header `APIKey` with the API key.
	//
	// 'basic' - This is the default.  HTTP Basic Authentication (RFC 2617) where the username is
	// the `apikey`, and the password is blank.
	//
	// 'plugin' - A custom authentication scheme. See: https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/authentication_schemes.html#AuthenticationSchemes-Customauthentication
	//
	// If you wish any path that is not bound to `apiPrefix` to be accessible without
	// authentication, then you can explicitly add them to `public` paths.
	accessControl: {
		apiPrefixSecurity: process.env.APIKEYAUTHTYPE || 'basic', // none | basic | apikey | ldap | plugin
		public: []
	},

	// Control the settings for the @axway/api-builder-admin UI console
	admin: {
		// Control whether the admin website is available
		enabled: true,
		// The hostnames or IPs from which connections to admin are allowed. Hostnames must be resolvable on the
		// server. IP ranges can also be specified. e.g. [ 'localhost', '192.168.1.0/24', '10.1.1.1' ]
		// An empty list [] will allow unrestricted access, though this is not recommended due to security concerns.
		allowedHosts: [
			'localhost', '::1'
		]
	},

	// Controls for swagger API Documentation
	apidoc: {
		// If you disable, the swagger API documentation will not be available. If @axway/api-builder-admin is installed and enabled, this has no effect.
		disabled: false,

		// The prefix for the swagger API documentation. Documentation is always available from '{prefix}/swagger.json'
		prefix: '/apidoc',

		// Overrides to make to the swagger API documentation.
		// This will not change how the server is hosted  - use apiPrefix, port and ssl configuration instead
		// This is useful when the service is not consumed directly, such as through a proxy
		overrides: {
			// The transfer protocol of the service. Values MUST be one or more of 'http', 'https', 'ws' or 'wss'
			// schemes: [ 'https' ],

			// The host (name or ip) serving the service. This MUST be the host only and does not include the scheme nor sub-paths. It MAY include a port.
			// host: 'localhost:8080',

			// The base path on which the service is served relative to the host.
			// If provided, this MUST start with a leading slash, or be null to specify no basePath
			// basePath: '/'
		}
	},

	// You can generally leave this as-is since it is generated for each new service you created.
	session: {
		encryptionAlgorithm: 'aes256',
		encryptionKey: 'Hdtkvun+NJiMce6eu/bH+oPxYtYsKhq7bqq3/DtybJs=',
		signatureAlgorithm: 'sha512-drop256',
		signatureKey: 'BS31DyfyNrfD8PAWaAO1Ns7YD1xIXE0gXz52vXqts4FORlb4VGdQfCtypgoOwMrhqtLFI+h17aZVGtMQk7DWrA==',
		secret: '1EATSXaFGUx1xQt+ENRgpHFKYBo2sIjf', // should be a large unguessable string
		duration: 86400000, // how long the session will stay valid in ms
		activeDuration: 300000 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
	},

	// If you want signed cookies, you can set this value. if you don't want signed cookies, remove or make null
	cookieSecret: 'IZBYIxYnWN3Q+vuhPJUKIZdU+S4sZg4+',

	// your connector configuration goes here
	connectors: {
	},

	// Cross-Origin Resource Sharing settings
	cors: {
		// List of allowed origins (format: any, space separated string, array or regex)
		// 'Access-Control-Allow-Origin': '*' or 'http://foo.com http://bar.com' or ['http://foo.com', 'http://bar.com'] or /foo\.com$/,

		// Sets the Access-Control-Allow-Credentials header on API responses. Can be true or false
		// 'Access-Control-Allow-Credentials': false,

		// Only these methods will be allowed out of all available methods for an endpoint. All available methods are allowed by default
		// (format: comma separated string or, an array: e.g. 'GET' or 'GET, PUT' or ['GET', 'PUT'])
		// 'Access-Control-Allow-Methods': ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],

		// Allowed request headers (format: comma separated string or, an array: e.g. 'content-type, authorization' or ['content-type', 'authorization'])
		// 'Access-Control-Allow-Headers': ['content-type', 'authorization'],

		// List of response headers exposed to the user. Always exposed headers: request-id, response-time and any headers defined in the endpoint
		// (format: comma separated string or, an array: e.g. 'content-type, response-time' or ['content-type', 'response-time'])
		// 'Access-Control-Expose-Headers': ['content-type', 'response-time']
	},

	// The path to a file which exports an express middleware function used as a healthcheck.
	// See `https://expressjs.com/en/4x/api.html#middleware-callback-function-examples` for more information on
	// express middleware functions.
	// This healthcheck middleware is executed by invoking GET /apibuilderPing.json. By default, invoking this
	// endpoint will return { success: <bool> } where <bool> is true as long as the service is not shutting down.
	// healthCheckAPI: './healthCheck.js',

	// This configuration option allows to configure proxy server URL that can be leveraged in plugins that do http/s communication
	// proxy: 'http://localhost:8081',

	flags: {
		// Flags to enable features that are not ready for production or
		// whose use may require manual upgrade steps in legacy services.

		// Enable support for aliases in comparison operators on composite models.
		// Breaking change for old versions as previously queries $lt, $gt, $lte, $gte, $in, $nin, $eq would not have translated aliasesd fields.
		enableAliasesInCompositeOperators: true,

		// Enable support for the $like comparison operator in the Memory connector.
		enableMemoryConnectorLike: true,

		// Enable support for Models that have no primary key.
		// Breaking change for old versions as previously the Create API returned a location header. Also the model advertised unsupported methods.
		enableModelsWithNoPrimaryKey: true,

		// Generate APIs and Flows that user primary key type rather than always assuming string.
		// Breaking change for old versions as the generated APIs will change when enabled.
		usePrimaryKeyType: true,

		// Enabling this flag will cause the service to exit when there is a problem loading a plugin
		exitOnPluginFailure: true,

		// Enabling this flag ensures that a plugin only receives the config relevant to that plugin.
		enableScopedConfig: true,

		// Enable support for model names being percent-encoded as per RFC-3986 in auto-generated API.
		// Breaking change for old versions as previously names like "foo/bar" will now be encoded as "foo%2Fbar"
		enableModelNameEncoding: true,

		// Enable support for null fields coming from Models
		enableNullModelFields: true,

		// Enable support for model names being percent-encoded as per RFC-3986 in API Builder's Swagger.
		// Breaking change for old versions as previously names like "foo/bar" will now be encoded as "foo%2Fbar"
		enableModelNameEncodingInSwagger: true,

		enableModelNameEncodingWithConnectorSlash: true
	},

	authorization: {
		callback: '/auth/callback',
		credentials: {
		}
	}
};
