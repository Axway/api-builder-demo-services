module.exports = {
	connectors: {
		'@axway/api-builder-plugin-sc-weather-service': {
			'x-vendor-openapi-authtype': 'basic',
			'x-vendor-openapi-username': process.env.WEATHER_APIKEY || 'Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3',
			'x-vendor-openapi-password': '',
			'x-vendor-openapi-uri': {
				'protocol': 'http',
				'host': process.env.WEATHER_HOST || 'localhost',
				'port': parseInt(process.env.WEATHER_PORT) || 8080,
				'basePath': '/'
			}
		}
	}
};
