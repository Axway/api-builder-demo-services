# User News and Weather as a Three Services

This chart creates a three services and three pods. The services are:

- weather
- news
- user-news-and-weather

Of the three only user-news-and-weather is externally visible. It runs on port 32000.

Each service is connected to the the pod for its associated API Builder app.
Unlike the _oneservice_ setup, here the pods run on separate hosts and there's no port collisions so the port was left at the default ```8080```.

However the user-news-and-weather app, being a swagger connector, needs the details of the host and ports for the news and weather services are on:

```
          env:
            - name: WEATHER_HOST
              value: {{ .Release.Name }}-weather
            - name: WEATHER_PORT
              value: "80"
            - name: NEWS_HOST
              value: {{ .Release.Name }}-news
            - name: NEWS_PORT
              value: "80"
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