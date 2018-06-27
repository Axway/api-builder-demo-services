# Weather Service

> This service is part of the API Builder demo services. These services are not production ready and are intended for demonstration purposes only.

This service provides a consistent API for accessing weather provider APIs. This allows other services in the mesh to access this content without being concerned with the provider details.

Currently only a single back end is supported - https://openweathermap.org, however this could be replaced without affecting other services in the mesh. To use you must obtain an API key from https://openweathermap.org and set it in the environment as ```OPENWEATHER_APIKEY```.

## Dependencies
### Internal 
None

### External
https://openweathermap.org

## Docker Build
```
docker build -t api-builder-demo-weather-service ./
```

## API Builder Environment Variables
The docker image can be configured at runtime via environment variables. This is a list of the common variables that you will need to set to use this image.

| Name                     | Description                                            | Default                          | Options                   |
|:-------------------------|:-------------------------------------------------------|:---------------------------------|:--------------------------|
| APIKEY             | The API key for incoming requests to the service.      | Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3 |                    |
| OPENWEATHER_APIKEY | The OpenWeatherMap API key which provides the content. |                                  | Signup at [https://openweathermap.org](https://openweathermap.org) | 
| PORT                     | The port the service will be listening on.             | 8080                             | |
| LOGLEVEL           | Logging level to use                                   | debug                            | debug, trace, info, error |

### Running the image

Standard run

```
docker run -e OPENWEATHER_APIKEY=<your openweathermap.org key> -p 8080:8080 api-builder-demo-weather-service
```

Or with additional environment overrides. 

```
docker run -e APIKEY=<your random key> -e PORT=8081 -e OPENWEATHER_APIKEY=<your openweathermap.org key> -p 8080:8081 api-builder-demo-weather-service
```

### Testing the service

The service has an endpoint on ```/api/weather/current?city={{city}}&country={{country}}&units={{units}}```. This makes a request against the service:

```
curl -X GET -u Ejj2qUWgcyNNzCtWP3cuubqeCgHm90Y3: "http://localhost:8080/api/weather/current?city=New%20York&country=US&units=metric"
```
