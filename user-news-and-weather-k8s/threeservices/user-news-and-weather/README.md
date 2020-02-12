# User News and Weather as a Three Services

This chart creates a three services and three pods. The services are:

- weather
- news
- user-news-and-weather

By default this chart creates ClusterIP services. Each service is connected to the the pod for its associated API Builder app.
Unlike the _oneservice_ setup, here the pods run on separate hosts and there's no port collisions so the port was left at the default ```8080```.

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
kubectl label namespace demo istio-injection=enabled
helm install --namespace demo --name brief ./user-news-and-weather --set news.backendKey=<you newsapi key> --set weather.backendKey=<your openweather key> 
```

Note you need to get the API Key for the News and Weather API backends from https://newsapi.org and https://openweathermap.org respectively. It will output something like:

```
NAME:   brief
LAST DEPLOYED: Wed Feb 12 10:03:59 2020
NAMESPACE: demo
STATUS: DEPLOYED

RESOURCES:
==> v1/Deployment
NAME                   AGE
news                   0s
user-news-and-weather  0s
weather                0s

==> v1/Pod(related)
NAME                                    AGE
news-6bb85f977b-kbzlj                   0s
user-news-and-weather-8655dd977d-blqnq  0s
weather-75d9cf697c-k8cwt                0s

==> v1/Service
NAME                   AGE
news                   0s
user-news-and-weather  0s
weather                0s
```

## Uninstalling

```
helm delete --purge brief
```

## Testing

The service is deployed as ClusterIP, to test you first need to make it accessible. 

```
$ kubectl -n demo port-forward svc/user-news-and-weather 8080
Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
```

*Note*: By default the API Key is `mykey`.

Using you client of choice you can now make a rest request to register a new user:

```
curl -v --location --request POST 'http://127.0.0.1:8080/api/register' \
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
curl --location --user mykey: --request GET 'http://127.0.0.1:8080/api/fred/info'
```