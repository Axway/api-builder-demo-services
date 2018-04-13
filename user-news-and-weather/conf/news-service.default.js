module.exports = {
	connectors: {
		'@axway/api-builder-plugin-sc-news-service': {
			'x-vendor-openapi-authtype': 'basic',
			'x-vendor-openapi-username': process.env.NEWS_APIKEY || 'Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3',
			'x-vendor-openapi-password': '',
			'x-vendor-openapi-uri': {
				'protocol': 'http',
				'host': process.env.NEWS_HOST || 'localhost',
				'port': parseInt(process.env.NEWS_PORT) || 8080,
				'basePath': '/'
			}
		}
	}
};
