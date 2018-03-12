# News Service

> This service is part of the API Builder demo services. These services are not production ready and are intended for demonstration purposes only.

This service provides a consistent API for accessing news provider APIs. This allows other services in the mesh to access this content without being concerned with the provider details.

Currently only a single back end is supported - https://newsapi.org, however this could be replaced without affecting other services in the mesh. To use you must obtain an API key from https://newsapi.org and set it in the environment as ```ARROW_NEWSAPI_APIKEY```.

## Dependencies
### Internal 
None

### External
https://newsapi.org

## Docker Build
```
docker build -t api-builder-demo-news-service ./
```

## API Builder Environment Variables
The docker image can be configured at runtime via environment variables. This is a list of the common variables that you will need to set to use this image.

| Name                 | Description                                         | Default                          | Options                   |
|:---------------------|:----------------------------------------------------|:---------------------------------|:--------------------------|
| ARROW_APIKEY         | The API key for incoming requests to the service    | Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3 |                    |
| ARROW_NEWSAPI_APIKEY | The NewsApi.org API key which provides the content. |                                  | Signup at [https://newsapi.org](https://newsapi.org) | 
| PORT                 | The port the service will be listening on.          | 8080                             | |
| ARROW_LOGLEVEL       | Logging level to use                                | debug                            | debug, trace, info, error |

### Running the image

Standard run

```
docker run -e ARROW_NEWSAPI_KEY=<your newsapi.org key> -p 8080:8080 api-builder-demo-news-service
```

Or with additional environment overrides. 

```
docker run -e ARROW_APIKEY=<your random key> -e ARROW_PORT=8081 -e ARROW_NEWSAPI_KEY=<your newsapi.org key> -p 8080:8081 api-builder-demo-news-service
```

### Testing the service

The service has an endpoint on ```/api/news/headlines?country={{country}}&category={{category}}```. This makes a request against the service:

```
curl -X GET -u Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3: "http://localhost:8080/api/news/headlines?country=US&category=technology"
```
