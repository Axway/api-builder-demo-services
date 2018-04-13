const test = require('tap').test
const sdk = require('../../src').sdk
const getConfig = require('../config.test.js')
test('### GetHeadlinesByCountry ###', t => {
  const configParams = getConfig()
  const requestData = {
    /**
     * To add more in the header use:
     *
     * header: Object.assign(configParams.header, { // your header data })
     */
    security: configParams.security,
    header: configParams.header,
    path: {},
    body: {},
    query: {},
    formData: {}
  }
  sdk.GetHeadlinesByCountry(requestData, (err, resp) => {
    t.notOk(err)
    t.ok(resp)
    t.end()
  })
})
