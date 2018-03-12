# User News and Weather as a Single Service

This chart creates a single service and a single pod. 

The service runs on port 32000.

The pod runs the three containers:
- axway-api-builder-demo-weather-service
- axway-api-builder-demo-news-service
- axway-api-builder-demo-user-news-and-weather-service

As the three containers are running in a single pod they are each run on a different port. This is done by setting the ```PORT``` environment variable for each container, for convenience the value is in values.yaml.

```
ports:
  usernewsandweather: 18080
  news: 18081
  weather: 18082
```

The user-news-and-weather app is using the swagger connector and it needs the details of the ports the news and weather services are on:

```
          env:
            - name: PORT
              value: "{{ .Values.ports.usernewsandweather }}"
            - name: NEWS_PORT
              value: "{{ .Values.ports.news }}"
            - name: WEATHER_PORT
              value: "{{ .Values.ports.weather }}"
```

The APIKeys for NewsAPI and OpenWeatherMap are set in values.yaml. These are then passed into the services as ```ARROW_``` environment variables that override the config:

```
...
            - name: ARROW_NEWSAPI_APIKEY
              value: {{ .Values.apikeys.newsApiKey }}
...
            - name: ARROW_OPENWEATHER_APIKEY
              value: {{ .Values.apikeys.openWeatherApiKey }}
...
```