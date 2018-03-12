const { expect } = require('chai');
const nock = require('nock');
const { startApiBuilder, stopApiBuilder, requestAsync } = require('./_base');

const auth = {
	user: 'test',
	password: ''
};

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

	describe('/weather/current', () => {
		it('[WEATHER-0001] Will get weather formatted URL.', () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'metric';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=${units}&APPID=openweatherkey`)
				.reply(200, weatherResponse);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/weather/current?city=${city}&country=${country}&units=${units}`,
				auth: auth,
				json: true
			}).then(({
				response,
				body
			}) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.deep.equal({
					city, country, units,
					summary: weatherResponse.weather.map(w => w.main),
					temperature: weatherResponse.main.temp,
					windSpeed: weatherResponse.wind.speed
				});
			});
		});

		it('[WEATHER-0002] Will get weather formatted URL using default units.', () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'metric';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=metric&APPID=openweatherkey`)
				.reply(200, weatherResponse);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/weather/current?city=${city}&country=${country}`,
				auth: auth,
				json: true
			}).then(({
				response,
				body
			}) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.deep.equal({
					city, country, units,
					summary: weatherResponse.weather.map(w => w.main),
					temperature: weatherResponse.main.temp,
					windSpeed: weatherResponse.wind.speed
				});
			});
		});

		it('[WEATHER-0003] Will get weather formatted URL using imperial units.', () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'imperial';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=imperial&APPID=openweatherkey`)
				.reply(200, weatherResponse);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/weather/current?city=${city}&country=${country}&units=${units}`,
				auth: auth,
				json: true
			}).then(({
				response,
				body
			}) => {
				expect(response.statusCode).to.equal(200);
				expect(body).to.deep.equal({
					city, country, units,
					summary: weatherResponse.weather.map(w => w.main),
					temperature: weatherResponse.main.temp,
					windSpeed: weatherResponse.wind.speed
				});
			});
		});

		it('[WEATHER-0004] Will return bad request on 3xx.', () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'metric';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=${units}&APPID=openweatherkey`)
				.reply(301);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/weather/current?city=${city}&country=${country}&units=${units}`,
				auth: auth,
				json: true
			}).then(({
				response,
				body
			}) => {
				expect(response.statusCode).to.equal(400);
				expect(body).to.deep.equal({
					status: 301,
					headers: {},
					body: ''
				});
			});
		});

		it('[WEATHER-0005] Will return bad request on 4xx.', () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'metric';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=${units}&APPID=openweatherkey`)
				.reply(404);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/weather/current?city=${city}&country=${country}&units=${units}`,
				auth: auth,
				json: true
			}).then(({
				response,
				body
			}) => {
				expect(response.statusCode).to.equal(400);
				expect(body).to.deep.equal({
					status: 404,
					headers: {},
					body: ''
				});
			});
		});

		it('[WEATHER-0006] Will return bad request on 5xx.', () => {
			const city = 'Dublin';
			const country = 'IE';
			const units = 'metric';
			nock('https://api.openweathermap.org')
				.get(`/data/2.5/weather?q=${city}%2C${country}&units=${units}&APPID=openweatherkey`)
				.reply(501);

			return requestAsync({
				method: 'GET',
				uri: `http://localhost:${server.arrow.port}/api/weather/current?city=${city}&country=${country}&units=${units}`,
				auth: auth,
				json: true
			}).then(({
				response,
				body
			}) => {
				expect(response.statusCode).to.equal(400);
				expect(body).to.deep.equal({
					status: 501,
					headers: {},
					body: ''
				});
			});
		});
	});
});
