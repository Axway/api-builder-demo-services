const { expect } = require('chai');
const nock = require('nock');
const { startApiBuilder, stopApiBuilder, requestAsync } = require('./_base');

describe('News Service Endpoints', function () {
	this.timeout(30000);
	let server;

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
	after(() => stopApiBuilder(server));

	describe('/news/headlines', () => {
		const auth = {
			user: 'test',
			password: ''
		};

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

		it('[NEWS-0001] Will get news with country and category filter.', () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=IE&category=business')
				.reply(200, {
					status: 'ok',
					articles
				});

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/news/headlines?country=IE&category=business`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.deep.equal(articles);
			});
		});

		it('[NEWS-0002] Formats the URL with country filter.', () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=US&category=')
				.reply(200, {
					status: 'ok',
					articles
				});

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/news/headlines?country=US`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.deep.equal(articles);
			});
		});

		it('[NEWS-0003] Formats the URL with category filter.', () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=&category=Tech')
				.reply(200, {
					status: 'ok',
					articles
				});

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/news/headlines?category=Tech`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.deep.equal(articles);
			});
		});

		it('[NEWS-0004] Formats the APIKEY header.', () => {
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

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/news/headlines?country=IE`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.deep.equal(articles);
			});
		});

		it('[NEWS-0005] Returns bad request on 3xx.', () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=IE&category=')
				.reply(301);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/news/headlines?country=IE`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(400);
				expect(body).to.deep.equal({ status: 301, headers: {}, body: '' });
			});
		});

		it('[NEWS-0006] Returns bad request on 4xx.', () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=IE&category=')
				.reply(403);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/news/headlines?country=IE`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(400);
				expect(body).to.deep.equal({ status: 403, headers: {}, body: '' });
			});
		});

		it('[NEWS-0007] Returns bad request on 5xx.', () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=IE&category=')
				.reply(501);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/news/headlines?country=IE`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(400);
				expect(body).to.deep.equal({ status: 501, headers: {}, body: '' });
			});
		});

		it('[NEWS-0008] Returns bad request on status not ok.', () => {
			nock('https://newsapi.org')
				.get('/v2/top-headlines?country=IE&category=')
				.reply(400, {
					status: 'not ok'
				});

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/news/headlines?country=IE`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
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
	});
});
