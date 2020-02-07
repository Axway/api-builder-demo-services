const { expect } = require('chai');
const nock = require('nock');
const { startApiBuilder, requestAsync } = require('./_base');

describe('News Service Endpoints', function () {
	this.timeout(30000);
	let server;

	const articles = [
		{
			author: 'John Doe',
			title: 'News Service Demo',
			description: 'The simple news aggregation service has been released',
			publishedAt: (new Date()).toISOString()
		},
		{
			author: 'Jane Doe',
			title: 'News Service Demo Test',
			description: 'The simple news aggregation service has been tested',
			publishedAt: (new Date()).toISOString()
		}
	];

	describe('API Key', function() {
		/**
		 * Start API Builder.
		 */
		before(() => {
			server = startApiBuilder({
				APIKEYAUTHTYPE: 'apikey',
				APIKEY: 'testApiKey'

			});
			return server.started;
		});

		/**
		 * Stop API Builder.
		 */
		after(() => server.stop());

		it('[NEWS-APIKEY-0001] Test API Key authentication.', async () => {
			// We're not doing the TLS orgination in the test, so for the test case it's enough
			// to check that it requested on http with port 443.
			nock('https://newsapi.org')
			    .get('/v2/top-headlines?country=IE&category=business')
			    .reply(200, {
				    status: 'ok',
				    articles
			    });

		   	const { response, body } = await requestAsync({
			   	method: 'GET',
			   	uri: `http://localhost:${server.apibuilder.port}/api/news/headlines?country=IE&category=business`,
			   	headers: {
					"apikey": "testApiKey"
				},
			   	json: true
		   	});
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal(articles);
		});
	});

	describe('Basic Auth', () => {
		/**
		 * Start API Builder.
		 */
		before(() => {
			server = startApiBuilder({
				APIKEYAUTHTYPE: 'basic',
				APIKEY: 'testBasic'
			});
			return server.started;
		});

		/**
		 * Stop API Builder after the tests.
		 */
		after(() => server.stop());

		it('[NEWS-0001] Will get news with country and category filter.', async() => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=IE&category=business')
				.reply(200, {
					status: 'ok',
					articles
				});

			const { response, body} = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/news/headlines?country=IE&category=business`,
				auth: { user: 'testBasic', password: '' },
				json: true
			})
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal(articles);
		});
	});

	describe('Defaults', () => {
		/**
		 * Start API Builder.
		 */
		before(() => {
			server = startApiBuilder({
				APIKEYAUTHTYPE: '',
				APIKEY: ''
			});
			return server.started;
		});

		/**
		 * Stop API Builder after the tests.
		 */
		after(() => server.stop());

		it('[NEWS-0001] Will get news with country and category filter.', async() => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=IE&category=business')
				.reply(200, {
					status: 'ok',
					articles
				});

			const { response, body} = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/news/headlines?country=IE&category=business`,
				auth: { user: 'Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3', password: '' },
				json: true
			})
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal(articles);
		});
	});

	describe('/news/headlines', () => {
		const auth = {
			user: 'test',
			password: ''
		};

		/**
		 * Start API Builder.
		 */
		before(() => {
			server = startApiBuilder();
			return server.started;
		});

		/**
		 * Stop API Builder after the tests.
		 */
		after(() => server.stop());

		it('[NEWS-0001] Formats the URL with country and category filter.', async () => {
		   	nock('https://newsapi.org')
			   	.get('/v2/top-headlines?country=IE&category=business')
			   	.reply(200, {
				   	status: 'ok',
				   	articles
			   	});

		   	const { response, body } = await requestAsync({
			   	method: 'GET',
			   	uri: `http://localhost:${server.apibuilder.port}/api/news/headlines?country=IE&category=business`,
			   	auth: auth,
			   	json: true
		   	});
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal(articles);
		});

		it('[NEWS-0002] Formats the URL with country filter.', async () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=US&category=')
				.reply(200, {
					status: 'ok',
					articles
				});

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/news/headlines?country=US`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal(articles);
		});

		it('[NEWS-0003] Formats the URL with category filter.', async () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=&category=Tech')
				.reply(200, {
					status: 'ok',
					articles
				});

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/news/headlines?category=Tech`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal(articles);
		});

		it('[NEWS-0004] Formats the APIKEY header.', async () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=IE&category=')
				.reply(200, function () {
					if (this.req.headers['x-api-key'] && this.req.headers['x-api-key'] === 'newsapikey') {
						return {
							status: 'ok',
							articles
						};
					} else {
						return {
							status: 'wrongkey'
						};
					}
				});

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/news/headlines?country=IE`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal(articles);
		});

		it('[NEWS-0005] Returns bad request on 3xx.', async () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=IE&category=')
				.reply(301);

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/news/headlines?country=IE`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(400);
			expect(body).to.deep.equal({ status: 301, headers: {}, body: '' });
		});

		it('[NEWS-0006] Returns bad request on 4xx.', async () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=IE&category=')
				.reply(403);

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/news/headlines?country=IE`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(400);
			expect(body).to.deep.equal({ status: 403, headers: {}, body: '' });
		});

		it('[NEWS-0007] Returns bad request on 5xx.', async () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=IE&category=')
				.reply(501);

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/news/headlines?country=IE`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(400);
			expect(body).to.deep.equal({ status: 501, headers: {}, body: '' });
		});

		it('[NEWS-0008] Returns bad request on status not ok.', async () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=IE&category=')
				.reply(400, {
					status: 'not ok'
				});

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/news/headlines?country=IE`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(400);
			expect(body).to.deep.equal({
				status: 400,
				headers: {
					'content-type': 'application/json'
				},
				body: {
					status: 'not ok'
				}
			});
		});
	});

	describe('Service Mesh', () => {
		const auth = {
			user: 'test',
			password: ''
		};

		/**
		 * Start API Builder.
		 */
		before(() => {
			server = startApiBuilder({
				ISTIO_ENABLED: 'true'
			});
			return server.started;
		});

		/**
		 * Stop API Builder after the tests.
		 */
		after(() => server.stop());

		it('[NEWS-MESH-0001] Will rely on TLS origination if Istio is enabled.', async () => {
				// We're not doing the TLS orgination in the test, so for the test case it's enough
				// to check that it requested on http with port 443.
			nock('http://newsapi.org:443')
				.get('/v2/top-headlines?country=IE&category=business')
				.reply(200, {
					status: 'ok',
					articles
				});

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/news/headlines?country=IE&category=business`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal(articles);
		});
	})
});
