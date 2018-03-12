# News And Weather

> This service is part of the API Builder demo services. These services are not production ready and are intended for demonstration purposes only.

This service provides a consistent API for accessing news and weather provider APIs. This allows other services in the mesh to access this content without being concerned with the provider details.

The following environment variables need to be configured to work with the News and Weather services.

| Name           | Description                               |
|:---------------|:------------------------------------------|
| NEWS_HOST      | The host running the news-service.        |
| NEWS_PORT      | The port the news app is listening on.    |
| NEWS_APIKEY    | The news-service apikey.                  |
| WEATHER_HOST   | The host running the weather-service.     |
| WEATHER_PORT   | The port the weather app is listening on. |
| WEATHER_APIKEY | The weather-service apikey.               |


## Dependencies
### Internal 
- news-service (image: axway/api-builder-demo-weather-service)
- weather-service (image: axway/api-builder-demo-weather-service)

### External
None

## Docker Build
```
docker build -t api-builder-demo-user-news-and-weather-service  ./
```

## API Builder Environment Variables
The docker image can be configured at runtime via environment variables. This is a list of the common variables that you will need to set to use this image.

| Name           | Description                                       | Default                          | Options                   |
|:---------------|:--------------------------------------------------|:---------------------------------|:--------------------------|
| ARROW_APIKEY   | The API key for incoming requests to the service. | Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3 | |
| PORT           | The port the service will be listening on.        | 8080                             | |
| NEWS_HOST      | The host running the news-service.                | localhost                        | |
| NEWS_PORT      | The port the news app is listening on.            | 8080                             | |
| NEWS_APIKEY    | The news-services apikey.                         | Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3 | |
| WEATHER_HOST   | The host running the weather-service.             | localhost                        | |
| WEATHER_PORT   | The port the weather app is listening on.         | 8080                             | |
| WEATHER_APIKEY | The weather-service apikey.                       | Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3 | |
| ARROW_LOGLEVEL | Logging level to use                              | debug                            | debug, trace, info, error |



### Running the image

Standard run

```
docker run -e NEWS_HOST=<newshost> -e WEATHER_HOST=<weatherhost> -p 8080:8080 api-builder-demo-user-news-and-weather-service
```

Or with additional environment overrides. 

```
docker run -e ARROW_APIKEY=<apikey> -e PORT=<port> -e NEWS_HOST=<news host> -e NEWS_PORT=<news port> -e NEWS_APIKEY=<news apikey> -e WEATHER_HOST=<weather host> -e WEATHER_PORT=<weather port> -e WEATHER_APIKEY=<weather apikey> -p 8080:8080 api-builder-demo-user-news-and-weather-service
```

### Testing the service

The service has two endpoints, one for registering users and one for retrieving the information. The registration endpoint is a POST ```/api/register``:

```
curl -X POST -u Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3: -H "Content-Type: application/json" -d '{"uid": "spiderman", "city": "New York", "country": "US", "interest": "sports" }' http://localhost:8080/api/register
```

And then the endpoint to retrieve the information for that user ```/api/:uid/info```:

```
curl -X GET -u Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3: "http://localhost:8080/api/spiderman/info"
```
