# Welcome to API Builder Project

For more information on using API Builder please see the [API Builder Getting Started Guide](https://docs.axway.com/bundle/API_Builder_allOS_en/page/api_builder_getting_started_guide.html).

## Running your project

**Run and develop your project**

```bash
npm start
```

## Project configuration

On startup, the service will load and merge all configuration files named `conf/*default.js` or `conf/*local.js`. If a property is configured in both `default.js` and `local.js`, the `local.js` value will take precedence.  Configuration files are applied alphabetically "default" first, and then "local", so that any setting in "local" files, will take precedence over any previously set in "default".

### Local configuration

The local configuration files are explcitly ignored by git, npm, and docker.  Any sensitive keys should be applied to local configuration.

### Runtime configuration

If you need to be able to configure a runtime setting, then you can expose the desired properties with environment variables before running the service. For example, if you want to be able to configure the apikey when your service runs, then modify an appropriate configuration file, e.g. `conf/local.js`, so that apikey will use the `process.env.myapikey` environment variable:

```js
// local.js
module.exports = {
	apikey: process.env.myapikey
}
```

Then you would supply the variable at runtime using `bash`:

```bash
myapikey=secret npm start
```

Supplying the runtime using Windows:

```
SET myapikey=secret && npm start
```

## Additional custom configuration

Additional environment variables may be necessary depending on how your service was developed. For example you may have a flow that is configured in advance to consume the environment variable `SECRETKEY`. Your flow would access it at `$.env.SECRETKEY` and you would set the key at runtime.  For example, using `bash`:

```bash
SECRETKEY=foobar npm start
```

Using Windows:

```
SET SECRETKEY=foobar && npm start
```

## Invoking an API locally

This makes a request against the custom run above:

```bash
curl -X GET -u <yourKey>: "http://127.0.0.1:8080/api/greet?username=seth" 
```

## Docker

### Docker configuration

Docker will not bundle or load any `conf/\*local.js`.  If you need to be able to configure a runtime setting, then you can expose the desired properties with runtime environment variables (see [Runtime configuration](#runtime-configuration)) before building the image, and then supply that environment variable at runtime:

```bash
docker run -e myapikey=secret -p 8080:8080 service_name
```

### Building a docker image

```bash
docker build -t service_name ./
```

### Running a docker container

```bash
docker run -p 8080:8080 service_name
```
