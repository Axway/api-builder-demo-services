# How to configure SSL
This document describes how to configure SSL to API Builder service.

# Table of content
1. [Introduction](introduction)
1. [Prerequisites](prerequisites)
1. [Documentation and resources](documentation-and-resources)
1. [Configure SSL](configure-ssl)
	* [Step 1: Scaffold and Run API Builder Service](step-1-scaffold-and-run-api-builder-service)
	* [Step 2: Create SSL certificate](step-2-create-ssl-certificate)
	* [Step 3: Configure SSL in the API Builder service](step-3-configure-ssl-in-the-api-builder-service)

## Introduction
The generation of an API Builder services is a simple process with the help of the API Builder CLI tool.

Some users may want to run APP and using SSL, so they can make the necessary configuration.

This document provides the technical requirements and an example of how to scaffold and run an API Builder service and configure SSL. 

## Prerequisites
Prior to setting up a service and configure SSL, refer to:

* [API Builder Getting Started Guide](https://wiki.appcelerator.org/display/AB4/API+Builder+Getting+Started+Guide) - Provides detailed instructions for installing API Builder and creating an API Builder service.
* [API Builder Service](https://wiki.appcelerator.org/display/AB4/API+Builder+Service) - Provides detailed information about API Builder services.
* Install the API Builder Command Line Interface (CLI) globally using npm. It is a flow-node module published in npm public repository. Once API Builder CLI is installed, you can use it to create a new service, install the service's dependencies, and start the API Builder service.
```sh
npm install -g @axway/api-builder
```
* [OpenSSL](https://www.openssl.org/) - Provides detailed information about OpenSSL.

## Documentation and resources
 Useful resources of how to use the product:

* [API Builder Documentation](https://wiki.appcelerator.org/display/AB4/API+Builder+4.0.0+Technical+Preview)
* [Axway Appcelerator Youtube Channel](https://www.youtube.com/watch?v=lgPFasrGATE)
* [Appcelerator Blog](Appcelerator Blog)

## Configure SSL
This document provides a step-by-step tutorial on how to run an API Builder service and configure SSL. These steps include:

* Scaffold and run the API Builder service.
* Create SSL certificate.
* Configure SSL in the API Builder service.
These steps and their required prerequisites are described in the following sections.

### Step 1: Scaffold and Run API Builder Service
If you already have a generated service, you can proceed to Step 2.

To scaffold and run your API Builder service, execute the following commands:
```sh
api-builder init <YOUR_APP_NAME>
cd <YOUR_APP_NAME>
npm install --no-optional
npm start
```
Once your service is running, point your browser to http://localhost:8080/console, will provide access to the API Builder user interface (UI) console.

For additional information on the API Builder UI, refer to the API Builder Getting Started Guide.

Now, stop the service by using Ctrl + C in your terminal where the service is running and go to the next step.

### Step 2: Create SSL certificate
Create one new folder on the root level of your directory.
```sh
cd <api-builder-service>
mkdir <new-folder>
```
Navigate to the newly created folder and create SSL certificate via OpenSSL. Please execute the following command:
```sh
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```
Due to the generation process, you will need to set PEM passphrase i.e. this is a password that must be supplied by anyone wanting to use the keys. You are about to be asked to enter information that will be incorporated into your certificate request. What you are about to enter is what is called a Distinguished Name or a DN. There are quite a few fields but you can leave some blank. For some fields, there will be a default value, If you enter '.', the field will be left blank.

Once your certificate is created, you will found two new files in your `<new-folder>` i.e. `key.pem`that will store the private key and `cert.pem` - the certificate.

In case you specified PEM passphrase when generating the cert, this is a password that must be supplied by anyone wanting to use it.

__Note:__ Additional information is available at: Creating an HTTPs server with Node.js & NodeJS & SSL

### Step 3: Configure SSL in the API Builder service
Navigate to `./conf/default.js` from the root of your project. Your SSL configuration goes here. The options are the same as what is used by Node.js `https.createServer()` method https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener. You will find initial SSL configuration i.e.:
```js
// Your ssl configuration goes here. The options are the same has what is used by
// Node.js https.createServer() method
// https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener

// ssl: {
//  port: 8443
// }
```
Enable SSL by uncommenting the configuration and add key, certificate and provide the paths to the files, and a password for the private key (configured as an OS environment variable).  Please find below the sample configuration:
```js
// Your ssl configuration goes here. The options are the same has what is used by
// Node.js https.createServer() method
// https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener

ssl: {
  port: 8443,
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem'),
  password: process.env.API_BUILDER_SSL_PASSWORD
}
```
__Note:__ Additional information is available at [API Builder Configuration](https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/console_configuration.html) & [Creating an HTTPS Server with Node.js](https://medium.com/@nileshsingh/everything-about-creating-an-https-server-using-node-js-2fc5c48a8d4e)