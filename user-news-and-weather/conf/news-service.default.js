module.exports = {
	// The configuration settings for your Swagger service.
	pluginConfig: {
		'@axway/api-builder-plugin-fn-swagger': {
			'news-service': {
				// It is possible to override Swagger URI options when constructing
				// outbound requests from the Swagger plugin.
				uri: {
					protocol: 'http',
					host: process.env.NEWS_HOST || 'localhost',
					port: parseInt(process.env.NEWS_PORT) || 8080
					// basePath: '/api'
				}
			}
		}
	},
	// The following authorization credentials needed to use the Swagger service.
	// Please follow this guide to manually configure the credentials:
	// https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/api_builder_credentials.html
	authorization: {
		credentials: {
			'@axway/news-service basicAuth': {
				type: 'basic',
				username: process.env.NEWS_SERVICE_APIKEY || 'Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3',
				password: ''
			}
		}
	}
};
