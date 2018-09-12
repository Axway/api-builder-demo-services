# Welcome to the API Builder 

This service is a simple demonstration of how to use the API Builder Zendesk Service Connector.
Before proceeding you will need to obtain a copy of the API Builder Zendesk Service Connector by contacting sales@axway.com or via http://marketplace.axway.com.

## Dependencies
### Internal 
API Builder Zendesk Service Connector

### External
https://www.zendesk.com


## API Builder Environment Variables
Follow the documentation to install the Zendesk Service Connector and configure access to Zendesk. This service requires you to set 2 environment variables:

| Name                 |          Description |
|:---------------------|:---------------------|
| ZENDESK_SITE_ADDRESS | The subdomain address of your Zendesk instance, https://{siteAddress}.zendesk.com |
| ZENDESK_ACCESS_TOKEN | The OAuth access_token for your Zendesk application. See the Zendesk Service Connector documentation for information on obtaining this token. |

## Running your service

```bash
npm install --no-optional
npm start
```

## APIs

The service consists of a single endpoint with two APIs. 

| Name                 | Path               | Description                |
|:---------------------|:-------------------|:---------------------------|
| CreateTicket         | POST /api/tickets  | Create tickets in Zendesk. |
| ListTickets          | GET  /api/tickets  | List the Zendesk tickets.  |