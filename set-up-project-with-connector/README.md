## Introduction
The generation of an API Builder applications is a simple process with the help of the API Builder CLI tool.

This document provides a step-by-step tutorial on how to run an API Builder service within a connector. These steps include:

## Create your API Builder project

* Add your connector

* Run your service

* These steps and their required prerequisites are described in the following sections.

## Prerequisites
You should have `NPM` latest version and `Node.js` latest version (^8) installed.
Tools to be installed in advance:

* Install the API Builder Command Line Interface (CLI) globally using `npm`. It is a node module published in npm public repository, please find additional information on official API Builder Getting Started Guide.

```sh
[sudo] npm install -g @axway/api-builder
```

* Docker - The installation of Docker depends on the specific operating system, please read the details on the following page Read the official guide for Docker installation.
Research for the B.I tools and 3rd party data store i.e. Splunk, Elastic etc.

## Step 1: Create your API Builder project
Install the API Builder Command Line Interface (CLI) globally using npm.

```sh
[sudo] npm install -g @axway/api-builder
```

Once API Builder CLI is installed, you can use it to create a new project.  In the following example, the CLI will create and initialize the ./myproject new project directory.

```sh
api-builder init myproject
```

Then, install the project's dependencies and start the API Builder project.

```sh
cd ./myproject
npm install --no-optional
npm start
```

Once your project is running, point your browser to http://localhost:8080/console to access the API Builder user interface (UI) console.

__NOTE:__ Refer to the API Builder Getting Started Guide for detailed information.

## Step 2: Add your connector
Now, you have tested that your service is running directly on your machine.

In case, you need to stop the service, use Ctrl + C in your terminal where the service is running.

To add a Connector:

1. Install the Connector
1. Configure the Connector
1. Use the Connector

### Step 2a: Install the Connector
For an example we will demonstrate you how to install and configure MySQL DC.

The mysql library used by this connector depends on a MySQL server setting NO_BACKSLASH_ESCAPES to mitigate against SQL injection attacks.  This setting must be disabled (which is the default setting for MySQL servers).

This is an API Builder data connector for MySQL.

```sh
npm install @axway/api-builder-plugin-dc-mysql
```

__NOTE:__ using `@latest` will pick up the latest available connector version.

A configuration file is generated for you and placed into the conf directory of your API Builder project. By default we use a host of localhost, a user of root and a password of password to connect.

### Step 2b: Configure the Connector
Once you've configured your mysql configuration files located under <project>/conf you can start up your API Builder project and visit the console (normally found under localhost:8080/console). Your connector will be listed under the Connectors section of the console.

Your MySQL tables will be listed uner the Models section of the console. You can now click on the gear icon to the right of the table names and generate flow based apis.

You can also reference the connector in a custom model.

```js
const Account = APIBuilder.Model.extend('Account', {
  fields: {
    Name: { type: String, required: true }
  },
  connector: 'mysql'
});
```

If you want to map a specific model to a specific table, use metadata. For example, to map the account model to
the table named accounts, set it such as:

```js
const Account = APIBuilder.Model.extend('account', {
  fields: {
    Name: { type: String, required: false, validator: /[a-zA-Z]{3,}/ }
  },
  connector: 'mysql',
  metadata: {
    'mysql': {
      table: 'accounts'
    }
  }
});
```

### Step 2c: Use the Connector
The configuration files that can contain environment variables are placed in the `<SERVICE_FOLDER>/conf` folder.

All the variables in your configuration files taken from `process.env.<VARIABLE_NAME>` can be provided when running the Docker container.

The following table lists the configuration files, their location, and their example content. The connector configuration is shown to inform you that you will have to provide an additional set of environment variables when using an API Builder service with connectors.

## Step 3: Run MySql via Docker
1. Run latest version of Docker
1. Pull Mysql Docker Image via Docker Hub

```sh
docker pull mysql
```

1. Start MySql in container and open the ports of physical machine
```sh
docker run -p 3306:3306 --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:5]
```

1. Set user and passward, execute the following command
```sh
docker exec -it some-mysql mysql -uroot -pmy-secret-pw
```

1. Create DB
```sh
CREATE DATABASE test;
```

1. Use the newly created DB
```sh
USE test;
```

1. Create table
```sh
CREATE TABLE Persons (
    ID int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int,
    PRIMARY KEY (ID)
);
```

1. Using the below command you can see listof the running containers and theirs IDs
```sh
docker ps
```

1. You could start/stop the container via the Container ID
```sh
docker start <ID>

or

docker stop <ID>
```

1. Go to the root of your project (`<your-project>/config/mysql.default.js`) and set user to `root` and the password to `my-secret-pw`. Please find below a sample:
```js
module.exports = {
    connectors: {
        mysql: {
            connector: '@axway/api-builder-plugin-dc-mysql',
            connectionPooling: true,
            connectionLimit: 10,
            host: 'localhost',
            port: 3306,
            database: 'test',
            user: 'root',
            password: 'my-secret-pw',

            // Create models based on your schema that can be used in your API.
            generateModelsFromSchema: true,

            // Whether or not to generate APIs based on the methods in generated models.
            modelAutogen: false
        }
    }
};
```

__NOTE:__ Now you are ready to start your service via `npm start`. Once your project is running, point your browser to http://localhost:8080/console to access the API Builder user interface (UI) console.

## Step 4: Run your service
Once you have scaffold project, install MySql connector and run successfully your service, you will be able to point your browser to http://localhost:8080/console to access the API Builder user interface (UI) console. Then you could navigate thru the components. 
1. Navigate to the Connectors tab. A list of the available connectors is displayed.
1. Now, navigate to the Models tab. Click the Tools icon for the MySQL connector and select Generate endpoints to create the MySql endpoints.
1. Navigate to the API Doc & Test tab. A list of the API Endpoints is displayed.
1. Select mysqlPersons to display the list of the generated endpoints for the MySQL connector.
1. Select the Flow icon for one of the generated endpoints for the MySQL connector; for example, for the Find all mysqlPersons endpoint. The API Orchestration page with all loaded connectors, nodes, and so forth is displayed.

__NOTE:__ Refer to API Builder Flows and Manage Nodes for detailed information.
