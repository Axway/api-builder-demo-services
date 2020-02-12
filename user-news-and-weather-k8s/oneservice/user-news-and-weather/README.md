# User News and Weather as a Single Service

## Overview
This chart creates a single service and a single pod. 

By default thsi chart creates a ClusterIP service (running on 18080) for the User News and Weather API.

The pod runs the three containers:
- axway-api-builder-demo-weather-service
- axway-api-builder-demo-news-service
- axway-api-builder-demo-user-news-and-weather

As the three containers are running in a single pod they are each run on a different port. This is done by setting the ```PORT``` environment variable for each container, for convenience the value is in values.yaml.

```
usernewsandweather:
  port: 18080

news:
  port: 18081

weather:
  port: 18082
```

The user-news-and-weather app is using the swagger connector and it needs the details of the ports the news and weather services are on:

```
          env:
            - name: PORT
              value: "{{ .Values.usernewsandweather.port }}"
            - name: NEWS_PORT
              value: "{{ .Values.news.port }}"
            - name: WEATHER_PORT
              value: "{{ .Values.weather.port }}"
```

The APIKeys for NewsAPI and OpenWeatherMap are set in values.yaml for this demo scenario. In real life these should be deployed as out of band secrets.

```
news:
  # The API key for NewsAPI.org
  backendKey: yourNewsAPIOrgKey

weather:
  # The API Key for OpenWeatherMap.org
  backendKey: yourOpenWeatherMapKey
```

These are then passed into the services as environment variables that override the config:

```
...
            - name: NEWSAPI_APIKEY
              value: {{ .Values.news.backendKey }}
...
            - name: OPENWEATHER_APIKEY
              value: {{ .Values.weather.backendKey }}
...
```

## Installing 

```
kubectl create namespace demo
helm install --namespace demo --name brief ./user-news-and-weather --set news.backendKey=<you newsapi key> --set weather.backendKey=<your openweather key> 
```

Note you need to get the API Key for the News and Weather API backends from https://newsapi.org and https://openweathermap.org respectively. It will output something like:

```
NAME:   brief
LAST DEPLOYED: Tue Feb 11 11:23:37 2020
NAMESPACE: demo
STATUS: DEPLOYED

RESOURCES:
==> v1/Deployment
NAME                   AGE
user-news-and-weather  0s

==> v1/Pod(related)
NAME                                   AGE
user-news-and-weather-5bcc77964-bvcw5  0s

==> v1/Service
NAME                   AGE
user-news-and-weather  0s
```

## Uninstalling

```
helm delete --purge brief
```

## Testing

The service is deployed as ClusterIP, to test you first need to make it accessible. 

```
$ kubectl -n demo port-forward svc/user-news-and-weather 18080
Forwarding from 127.0.0.1:18080 -> 18080
Forwarding from [::1]:18080 -> 18080
```

*Note*: By default the API Key is `mykey`.

Using you client of choice you can now make a rest request to register a new user:

```
curl -v --location --request POST 'http://127.0.0.1:18080/api/register' \
--user mykey: \
--header 'Content-Type: application/json' \
--data-raw '{
    "uid": "fred",
    "city": "Dublin",
    "country": "IE",
    "interest": "Technology"
}'
```

And then get the news and weather brief for that user:

```
curl --location --user mykey: --request GET 'http://127.0.0.1:18080/api/fred/info'
```