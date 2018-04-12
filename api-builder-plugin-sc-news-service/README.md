# Service Connector

Service Connector for API Access 

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This connector is generated with [Connector Builder](https://git.ecd.axway.int/Api-Builder/connector-builder)

It exposes a __SDK__ that can be used to access specific third party APIs. [Read more in the SDK documentation.](src/sdk/DOCS.md)

# Table of Contents

* [Build](#how-to-build)
* [Set up the Connector](#set-up-the-connector)
* [Standalone mode](#standalone-mode)
* [API Builder](#api-builder)
* [Refresh](#how-to-refresh)
* [Author](#author)
* [License](#license)


## How to build

#### This is how to setup your newly generated Connector
* Navigate to the root directory of the connector.
* Run the main `all` script which will install the required dependencies, build your project and run the connector test suite.

```sh
npm run all
```

## Set up the Connector
 Connector Structure
 
* __config__ folder:
    * __connector.name.default.js__ - Contains mandatory metadata about the connector and provides the information for the connector regeneration.
    * __context.js__ - Defines the context in which your connector is running
    * __generator.js__ - Holds the settings for connector regeneration    
    * __sdk.js__ - Was built from the Swagger definition and contains all details about the endpoints.
    * __swagger.json__ - Whe Swagger specification represented as JSON objects
* __src__ folder:
    * __sdk__ folder - Contains all files generated from sdk.js file. One `.js` file per each endpoint.
    * __index.js__ - Provides the **sdk**, **register** and **unregister** functions for the connector in the API Builder context.
* __templates__ folder: Contains all necessary template files
    * __config.test.js__ - Configuration template file. Copy/Paste the file into the __test__ folder. Fill the necessary value of the mandatory fields and use it for running your test suite.
    * __connector.integration.js__ - Contains automatically generated integration test suite. Copy/Paste the file into the test/integration folder, fill the required data and run it via the corresponding command.
* __test__ folder: 
    * __integration__ folder:
        * __predefined__ folder - Contains `sdk-index.unit.js` file
        * __connector.integration.js__ - This file doesn't exist, you need to copy the file from templates directory to this directory and use it.
    * __unit__ folder: Contains unit test suite.

#### Unit tests
* Run the unit test suite with:

```sh
npm test
```

> If you would like to write your own Unit Tests, you can create one new __.js__ file in __test/unit__ folder e.g. **_sample.unit.js_** and you can start. Please find the sample below:

```js
const test = require('tap').test
test('### Sample Unit Test ###', t => {
  t.ok(1)
  t.end()
})
```

#### Predefined Integration Tests

* For integration testing we need some test data and service credentials for accessing the service under test. Files from templates folder could be used as starting point:

> config.test.js file - this file could be used to store sensitive data for your integration test suite. It is never commited to git repositories. Paste the file to the root level of test folder and fill your data.

> connector.integration.js file - this file contains pregenerated test suite one per each function. You need to paste the file into the test/integration directory and fill the test data. This file is using the data specified in config.test.js

* Run the integration test suite command

```sh
npm run test:integration
```

#### Custom Integration Tests

> if you would like to write your own Integration Tests, you can create one new __.js__ file in __integration/unit__ folder e.g. **_sample.integration.js_** and you can start. Please find the sample below:

```js
const test = require('tap').test
const sdk = require('../../src').sdk
const getConfig = require('../config.test.js')

test('### Endpoint name ###', t => {
  const configParams = getConfig()
  const requestData = {
      // or to add more in the header use -> header: Object.assign(configParams.header, { // your header data })
    header: configParams.header,
    path: {},
    body: {},
    query: {},
    formData: {}
  }
  sdk.functionName(requestData, (err, resp) => {
    t.notOk(err)
    t.ok(resp)
    t.end()
  })
})
```


## Standalone mode
There is an option to use the connector in **_Standalone mode_** (e.g. install connector via npm and use it in an independent project).
* can use it in already existing project or to create new one. 
* need to install the connector via __npm__, use the following command:

```sh
npm install @axway/api-builder-plugin-connectorname
```
* Then  you will need to `require()` the connector's __sdk__ (e.g. the folder that contains __.js__ file per endpoint) 

```js
const sdk =  require('api-builder-plugin-connectorname').sdk
```
* Now through the __sdk__ constant you can reach and use every function in the connector __sdk__. When you call the function by __Name__ you need to set some mandatory parameters
    * __requestData__ - Required parameter. The type is an **_Object_**. Contains the data for all the parameters used in communication with the service.
    * __callback__ - Required parameter. The type is a **_Function_**. A function that will be invoked with either error or success response that come from the service. Both of them are Objects with properties httpCode that denotes the http status and content that denotes the content. Sample: __`() => {}`__
    * __config__ - Optional parameter. The type is an **_Object_**. This is connector config that comes from the and serves as general runtime information. If not provided the one bundled with the connector is used for the same purpose.

```js
sdk.sdkFunctionName(requestData, callback, config)
```

## API Builder
**In order to test the newly generated connector within API Builder, you need to create an API Builder application**
* install __api-builder__ globally 

    ```sh
    [sudo] npm install -g @axway/api-builder@latest
    ```
    
As a result you should have __`api-builder`__ command in your terminal. __NOTE__: if you have any problem you could use __sudo__ command

* generate new API Builder APP
    
    ```sh
    api-builder init myproject
    ```

* next steps to install and run (using npm):
```sh
	cd myproject
	npm install
	npm start
```

* install the service connector

```sh
npm i @axway/api-builder-plugin-connectorname
```

> NOTE: when you run your application all provided connectors will be automatically registered with API Builder.


## Author

Axway R&D <support@axway.com> https://axway.com

## License

This code is closed source and Confidential and Proprietary to Axway, Inc. All Rights Reserved. This code MUST not be modified, copied or otherwise redistributed without express written permission of Axway. This file is licensed as part of the Axway Platform and governed under the terms of the Axway license agreement. Your right to use this software terminates when you terminate your Axway subscription.
