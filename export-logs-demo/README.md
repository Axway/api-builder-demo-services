# Export API Builder Logs into a Data Store

## Introduction
The generation of an API Builder applications is a simple process with the help of the API Builder CLI tool.

Some of the users might want to run APP and using B.I tool, so it can exports Logs into 3rd party DS (data store).

This is a document specially created to show you how to run API Builder application and export Logs.

Here are the technical requirements for being able to scaffold and run API Builder Application and export Logs into B.I tool.

## Prerequisites
Tools to be installed in advance:

* Install the API Builder Command Line Interface (CLI) globally using `npm`. It is a node module published in npm public repository, please find additional information on official API Builder Getting Started Guide.

```sh
[sudo] npm install -g @axway/api-builder
```

* Docker - The installation of Docker depends on the specific operating system, please read the details on the following page Read the official guide for Docker installation.
Research for the B.I tools and 3rd party data store i.e. Splunk, Elastic etc.


## Setup Splunk Server using Splunk logging driver and HTTP Event Collector
Once you have [scaffold and run API Builder Service](https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/api_builder_getting_started_guide.html) and [build Service Docker Image](https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/dockerize_an_api_builder_service.html), you are ready to start Service integration with Splunk.
We will setup splunk with basic definitions on local environment.

### Step 1: Pull the splunk image from docker hub as follow:

```sh
docker pull splunk/splunk
```

Check the splunk image as follow:

```sh
docker images | grep splunk
```

### Step 2: Start the splunk server as following command:

```sh
docker run -d -e "SPLUNK_START_ARGS=--accept-license" -e "SPLUNK_USER=root" -p "8000:8000" -p "8088:8088" splunk/splunk
```

### Step 3: Go to Splunk Web
Then please visit https://localhost:8000 and see that splunk server is up. Then go to Settings -> Data inputs -> HTTP Event Collector -> Add new. Type name and select Next button. At the final step you will find secessfully generated Token. Copy and save the Token.

### Step 4: Set up HTTP Event Collector
Then navigate to Settings/Data inputs/HTTP Event Collector and you will reach your docker logs. Click to Global settings button and Enable button and will find HTTP Port Number. 
After that click to the docker logs edit button and leave everything with the default settings.


### Step 5: Run service container via Splunk
Once you have runed the splunk container, settup everything in the Splunk Web you are ready to run the application container via Splunk. Please use the below command:

```sh
docker run -d -p 8080:8080 --log-driver=splunk --log-opt splunk-url=http://10.134.9.42:8088 --log-opt splunk-token=4ef9ad35-37a5-4e7c-baab-90fa063e21a3 --log-opt splunk-insecureskipverify=true demo-img
```

If everything works correctly will receive automatically all aplication logs in the Splunk Web
