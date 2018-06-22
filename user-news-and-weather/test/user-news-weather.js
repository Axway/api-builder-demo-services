const {
	expect
} = require('chai');
const nock = require('nock');
const {
	startApiBuilder,
	stopApiBuilder,
	requestAsync
} = require('./_base');

const auth = {
	user: 'test',
	password: ''
};

describe.only('User News And Weather Endpoints', function () {
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

	describe('/register', () => {
		it('[REGISTER-0001] Can register a user.', () => {
			const user = {
				uid: 'spiderman',
				city: 'New York',
				country: 'US',
				interest: 'sports',
			};

			return requestAsync({
				method: 'POST',
				uri: `http://localhost:${server.apibuilder.port}/api/register`,
				auth: auth,
				body: user,
				json: true
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(200);
			}).then(() => {
				return requestAsync({
					method: 'GET',
					uri: `http://localhost:${server.apibuilder.port}/api/endpoints/user?where={"uid":"spiderman"}`,
					auth: auth,
					json: true
				});
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.have.length(1);
				expect(body[0]).to.have.property('uid', 'spiderman');
				expect(body[0]).to.have.property('city', 'New York');
				expect(body[0]).to.have.property('country', 'US');
				expect(body[0]).to.have.property('interest', 'sports');
			});
		});

		it('[REGISTER-0002] register returns a 400 if the registration is not valid.', () => {
			const user = {
				city: 'New York',
				country: 'US',
				interest: 'sports',
			};

			return requestAsync({
				method: 'POST',
				uri: `http://localhost:${server.apibuilder.port}/api/register`,
				auth: auth,
				body: user,
				json: true
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(400);
			});
		});

		it('[REGISTER-0003] register returns a 409 if there is a conflict on creation.', () => {
			const user = {
				uid: `spiderman_${(new Date()).toISOString()}`,
				city: 'New York',
				country: 'US',
				interest: 'sports',
			};

			return requestAsync({
				method: 'POST',
				uri: `http://localhost:${server.apibuilder.port}/api/register`,
				auth: auth,
				body: user,
				json: true
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(200);
			}).then(() => {
				return requestAsync({
					method: 'POST',
					uri: `http://localhost:${server.apibuilder.port}/api/register`,
					auth: auth,
					body: user,
					json: true
				});
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(409);
			});
		});

		it('[REGISTER-0004] register returns 200 on non-conflicting users.', () => {
			const spidy = {
				uid: `spiderman_${(new Date()).toISOString()}`,
				city: 'New York',
				country: 'US',
				interest: 'sports',
			};

			const batman = {
				uid: `batman_${(new Date()).toISOString()}`,
				city: 'Gotham City',
				country: 'US',
				interest: 'technology',
			};

			return requestAsync({
				method: 'POST',
				uri: `http://localhost:${server.apibuilder.port}/api/register`,
				auth: auth,
				body: spidy,
				json: true
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(200);
			}).then(() => {
				return requestAsync({
					method: 'POST',
					uri: `http://localhost:${server.apibuilder.port}/api/register`,
					auth: auth,
					body: batman,
					json: true
				});
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(200);
			});
		});
	});

	describe('/:uid/info', () => {
		const user = {
			uid: 'superman',
			city: 'Anchorage',
			country: 'US',
			interest: 'science',
		};

		const headlines = [...Array(5).keys()].map(i => ({
			author: `Author_${i}`,
			title: `Title_${i}`,
			description: `Description_${i}`,
			url: `http://example.com/${i}`,
			urlToImage: `http://images.example.com/${i}`,
			publishedAt: new Date().toISOString()
		}));

		const weather = {
			city: 'Anchorage',
			country: 'US',
			summary: 'Wet,Cold',
			units: 'metric',
			temperature: '2.1',
			windSpeed: '20'
		};

		before(() => {
			// Create superman
			return requestAsync({
				method: 'POST',
				uri: `http://localhost:${server.apibuilder.port}/api/register`,
				auth: auth,
				body: user,
				json: true
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(200);
			});
		});

		it('[INFO-0001] Will return 404 if no user found.', () => {
			const uid = 'wonderwoman';
			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/${uid}/info`,
				auth: auth,
				json: true
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(404);
			});
		});

		it('[INFO-0002] Will return 400 if GetHeadlinesByCountry returns 400.', () => {
			nock('http://localhost:8081') // FIXME: When this is in config use the config setting
				.get(`/api/news/headlines?category=${user.interest}&country=${user.country}`)
				.reply(400);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/${user.uid}/info`,
				auth: auth,
				json: true
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(400);
			});
		});

		it('[INFO-0003] Will return 500 if GetHeadlinesByCountry returns 401.', () => {
			nock('http://localhost:8081') // FIXME: When this is in config use the config setting
				.get(`/api/news/headlines?category=${user.interest}&country=${user.country}`)
				.reply(401);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/${user.uid}/info`,
				auth: auth,
				json: true
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(500);
			});
		});

		it('[INFO-0004] Will return 500 if GetHeadlinesByCountry returns 500.', () => {
			nock('http://localhost:8081') // FIXME: When this is in config use the config setting
				.get(`/api/news/headlines?category=${user.interest}&country=${user.country}`)
				.reply(500);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/${user.uid}/info`,
				auth: auth,
				json: true
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(500);
			});
		});

		it('[INFO-0005] Will return 400 if GetCurrentWeatherByCity returns 400.', () => {
			nock('http://localhost:8081') // FIXME: When this is in config use the config setting
				.get(`/api/news/headlines?category=${user.interest}&country=${user.country}`)
				.reply(200, headlines);

			nock('http://localhost:8082') // FIXME: When this is in config use the config setting
				.get(`/api/weather/current?city=${user.city}&country=${user.country}&units=metric`)
				.reply(400);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/${user.uid}/info`,
				auth: auth,
				json: true
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(400);
			});
		});

		it('[INFO-0006] Will return 500 if GetCurrentWeatherByCity returns 401.', () => {
			nock('http://localhost:8081') // FIXME: When this is in config use the config setting
				.get(`/api/news/headlines?category=${user.interest}&country=${user.country}`)
				.reply(200, headlines);

			nock('http://localhost:8082') // FIXME: When this is in config use the config setting
				.get(`/api/weather/current?city=${user.city}&country=${user.country}&units=metric`)
				.reply(401);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/${user.uid}/info`,
				auth: auth,
				json: true
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(500);
			});
		});

		it('[INFO-0007] Will return 500 if GetCurrentWeatherByCity returns 500.', () => {
			nock('http://localhost:8081') // FIXME: When this is in config use the config setting
				.get(`/api/news/headlines?category=${user.interest}&country=${user.country}`)
				.reply(200, headlines);

			nock('http://localhost:8082') // FIXME: When this is in config use the config setting
				.get(`/api/weather/current?city=${user.city}&country=${user.country}&units=metric`)
				.reply(500);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/${user.uid}/info`,
				auth: auth,
				json: true
			}).then(({ response }) => {
				expect(response.statusCode).to.equal(500);
			});
		});

		it('[INFO-0007] Will the info with a 200.', () => {
			nock('http://localhost:8081') // FIXME: When this is in config use the config setting
				.get(`/api/news/headlines?category=${user.interest}&country=${user.country}`)
				.reply(200, headlines);

			nock('http://localhost:8082') // FIXME: When this is in config use the config setting
				.get(`/api/weather/current?city=${user.city}&country=${user.country}&units=metric`)
				.reply(200, weather);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/${user.uid}/info`,
				auth: auth,
				json: true
			}).then(({ response, body }) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.deep.equal({
					headlines, weather
				});
			});
		});
	});
});
