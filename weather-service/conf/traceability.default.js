/**
 * Configuration used by the GreetFlow. 'saluation' is accessed via '$.helloworld.salutation'
 * similarly any APIBuilder.config parameter can be accessed.
 */
const TRACEABILITY_HEADERS = process.env.TRACEABILITY_HEADERS || 'x-request-id, x-b3-traceid, x-b3-spanid, x-b3-parentspanid, x-b3-sampled, x-b3-flags, x-ot-span-context';

module.exports = {
	traceability: {
		headers: TRACEABILITY_HEADERS.split(',').map(h => h.trim())
	}
};
