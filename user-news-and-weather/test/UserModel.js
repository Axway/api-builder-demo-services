const { expect } = require('chai');
const { promisify } = require('util');
const { startApiBuilder, stopApiBuilder } = require('./_base');

describe('User Model', function () {
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

	describe('user', () => {
		it('[USER-0001] verify model definition', () => {
			const model = server.arrow.getModel('User');
			expect(model.fields).to.deep.equal({
				uid: {
					description: 'The user id.',
					type: 'string',
					required: true,
					optional: false
				},
				city: {
					description: 'The users city.',
					type: 'string',
					required: true,
					optional: false
				},
				country: {
					description: 'The users two character country code.',
					type: 'string',
					required: true,
					optional: false
				},
				interest: {
					default: 'Technology',
					description: 'The category of headline the user is interested in.',
					type: 'string',
					required: true,
					optional: false
				}
			});
			expect(model.connector.name).to.equal('memory');
		});

		it('[USER-0002] test CRUD methods on model', () => {
			const model = server.arrow.getModel('User');

			// Use promisify for cleaner tests
			const createAsync = promisify(model.create.bind(model));
			const findByIDAsync = promisify(model.findByID.bind(model));
			const updateAsync = promisify(model.update.bind(model));
			const deleteAsync = promisify(model.delete.bind(model));

			const user = {
				uid: 'Spiderman',
				city: 'New York',
				country: 'US',
				interest: 'sports'
			};

			// Create user, find the user, update the user, delete the user.
			let expectedId;

			return createAsync(user)
				.then((created) => {
					// Verify the created model
					expectedId = created.id;
					expect(created).to.have.property('id');
					expect(created).to.have.property('uid', user.uid);
					expect(created).to.have.property('city', user.city);
					expect(created).to.have.property('country', user.country);
					expect(created).to.have.property('interest', user.interest);
					return created;
				})
			//
			// Find the user by id
			//
				.then((created) => findByIDAsync(created.id))
				.then((found) => {
					// Verify the found model
					expect(found).to.have.property('id', expectedId);
					expect(found).to.have.property('uid', user.uid);
					expect(found).to.have.property('city', user.city);
					expect(found).to.have.property('country', user.country);
					expect(found).to.have.property('interest', user.interest);
					return found;
				})
			//
			// Update the user record.
			//
				.then((found) => {
					const update = JSON.parse(JSON.stringify(found));
					update.interest = 'technology';
					return updateAsync(update);
				})
				.then((updated) => {
					// Verify the updated model
					expect(updated).to.have.property('id', expectedId);
					expect(updated).to.have.property('uid', user.uid);
					expect(updated).to.have.property('city', user.city);
					expect(updated).to.have.property('country', user.country);
					expect(updated).to.have.property('interest', 'technology');
					return updated;
				})
			//
			// Delete the test user record.
			//
				.then((updated) => deleteAsync(updated.id))
				.then((deleted) => findByIDAsync(deleted.id))
				.then((found) => {
					// Verify the deleted model cannot be found
					expect(found).to.be.undefined;
				});
		});
	});
});
