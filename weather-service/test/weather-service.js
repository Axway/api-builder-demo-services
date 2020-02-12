const { expect } = require('chai');
const nock = require('nock');
const { startApiBuilder, requestAsync } = require('./_base');

const weatherResponse = {
	coord: {
		lon: -6.26,
		lat: 53.35
	},
	weather: [{
		id: 500,
		main: 'Rain',
		description: 'light rain',
		icon: '10d'
	},
	{
		id: 701,
		main: 'Mist',
		description: 'mist',
		icon: '50d'
	}],
	base: 'stations',
	main: {
		temp: 3.49,
		pressure: 984,
		humidity: 93,
		temp_min: 3,
		temp_max: 4
	},
	visibility: 6000,
	wind: {
		speed: 2.6,
		deg: 280
	},
	clouds: {
		all: 75
	},
	dt: 1520269200,
	sys: {
		type: 1,
		id: 5237,
		message: 0.0022,
		country: 'IE',
		sunrise: 1520233313,
		sunset: 1520273506
	},
	id: 2964574,
	name: 'Dublin',
	cod: 200
};

describe('OpenWeather Service Endpoints', function () {
	this.timeout(30000);
	let server;

	describe('API Key', function () {
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

		it('[WEATHER-APIKEY-0001] Test API Key authentication.', async () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'metric';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=${units}&APPID=openweatherkey`)
				.reply(200, weatherResponse);

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/weather/current?city=${city}&country=${country}&units=${units}`,
				headers: {
					apikey: 'testApiKey'
				},
				json: true
			});
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal({
				city, country, units,
				summary: weatherResponse.weather.map(w => w.main),
				temperature: weatherResponse.main.temp,
				windSpeed: weatherResponse.wind.speed
			});
		});
	});

	describe('Basic Auth', function () {
		before(() => {
			server = startApiBuilder({
				APIKEYAUTHTYPE: 'basic',
				APIKEY: 'testBasic'
			});
			return server.started;
		});

		/**
		 * Stop API Builder.
		 */
		after(() => server.stop());

		it('[WEATHER-BASIC-0001] Test Basic authentication.', async () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'metric';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=${units}&APPID=openweatherkey`)
				.reply(200, weatherResponse);

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/weather/current?city=${city}&country=${country}&units=${units}`,
				auth: { user: 'testBasic', password: '' },
				json: true
			});
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal({
				city, country, units,
				summary: weatherResponse.weather.map(w => w.main),
				temperature: weatherResponse.main.temp,
				windSpeed: weatherResponse.wind.speed
			});
		});
	});

	describe('Defaults', function () {
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

		it('[WEATHER-DEFAULT-0001] Uses the expected defaults.', async () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'metric';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=${units}&APPID=openweatherkey`)
				.reply(200, weatherResponse);

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/weather/current?city=${city}&country=${country}&units=${units}`,
				auth: { user: 'Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3', password: '' },
				json: true
			});
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal({
				city, country, units,
				summary: weatherResponse.weather.map(w => w.main),
				temperature: weatherResponse.main.temp,
				windSpeed: weatherResponse.wind.speed
			});
		});
	});

	describe('/weather/current', () => {
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

		it('[WEATHER-0001] Will get weather formatted URL.', async () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'metric';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=${units}&APPID=openweatherkey`)
				.reply(200, weatherResponse);

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/weather/current?city=${city}&country=${country}&units=${units}`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal({
				city, country, units,
				summary: weatherResponse.weather.map(w => w.main),
				temperature: weatherResponse.main.temp,
				windSpeed: weatherResponse.wind.speed
			});
		});

		it('[WEATHER-0002] Will get weather formatted URL using default units.', async () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'metric';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=metric&APPID=openweatherkey`)
				.reply(200, weatherResponse);

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/weather/current?city=${city}&country=${country}`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal({
				city, country, units,
				summary: weatherResponse.weather.map(w => w.main),
				temperature: weatherResponse.main.temp,
				windSpeed: weatherResponse.wind.speed
			});
		});

		it('[WEATHER-0003] Will get weather formatted URL using imperial units.', async () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'imperial';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=imperial&APPID=openweatherkey`)
				.reply(200, weatherResponse);

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/weather/current?city=${city}&country=${country}&units=${units}`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(200);
			expect(body).to.deep.equal({
				city, country, units,
				summary: weatherResponse.weather.map(w => w.main),
				temperature: weatherResponse.main.temp,
				windSpeed: weatherResponse.wind.speed
			});
		});

		it('[WEATHER-0004] Will return bad request on 3xx.', async () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'metric';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=${units}&APPID=openweatherkey`)
				.reply(301);

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/weather/current?city=${city}&country=${country}&units=${units}`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(400);
			expect(body).to.deep.equal({
				status: 301,
				headers: {},
				body: ''
			});
		});

		it('[WEATHER-0005] Will return bad request on 4xx.', async () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'metric';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=${units}&APPID=openweatherkey`)
				.reply(404);

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/weather/current?city=${city}&country=${country}&units=${units}`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(400);
			expect(body).to.deep.equal({
				status: 404,
				headers: {},
				body: ''
			});
		});

		it('[WEATHER-0006] Will return bad request on 5xx.', async () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'metric';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=${units}&APPID=openweatherkey`)
				.reply(501);

			const { response, body } = await requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.apibuilder.port}/api/weather/current?city=${city}&country=${country}&units=${units}`,
				auth: auth,
				json: true
			});
			expect(response.statusCode).to.equal(400);
			expect(body).to.deep.equal({
				status: 501,
				headers: {},
				body: ''
			});
		});
	});
});
