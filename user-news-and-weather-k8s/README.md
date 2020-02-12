# Setup

## Build the images
```
docker build -t axway/api-builder-demo-services:news-service ../news-service
docker build -t axway/api-builder-demo-services:weather-service ../weather-service
docker build -t axway/api-builder-demo-services:user-news-and-weather ../user-news-and-weather
```

## Developer Environment

### Option A: k3d
Install k3d [Setting up k3d](https://github.com/rancher/k3d).

#### Start k3d
There is a helper script `k3d.sh` to automate the cluster creation and initialization (installs helm and loads the images into k3d but does not deploy the helm chart). Note the sourcing of the script - this is to ensure KUBECONFIG is set correctly.

```
. ./k3d.sh
```

### Option B: Minikube
It's assumed you've installed minikube, if not see [Setting up minikube](https://kubernetes.io/docs/getting-started-guides/minikube/).

#### Start minikube:
```
minikube start
minikube dashboard
```

### Build the images
This is temporary but as the services aren't published you'll need to build them manually. Once published this step won't be required.

```
eval $(minikube docker-env)
docker build -t axway/api-builder-demo-services:news-service ../news-service
docker build -t axway/api-builder-demo-services:weather-service ../weather-service
docker build -t axway/api-builder-demo-services:user-news-and-weather ../user-news-and-weather
```

#### Install Helm
See the [helm install instructions](https://docs.helm.sh/using_helm/#installing-helm). Here's how to do it on linux:

```
curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh
```

To initialize and test:

```
helm init
```

## One Service

This chart sets up a single sevice and a single pod containing the three containers. See [./oneservice/user-news-and-weather/README.md](./oneservice/user-news-and-weather/README.md) for more detail.


## Three Services

This chart sets up a three sevices and three pods, one for each of the API Builder apps. This configuration allows for independent replication scaling and also allows the easy reuse of the services. As with the _oneservice_ setup the only service exposed externally is the user-news-and-weather, both _news-service_ and _weather-service_ are only visible inside the cluster.

 See [./threeservices/user-news-and-weather/README.md](./threeservices/user-news-and-weather/README.md) for more detail.



## Deployment on an Istio (https://istio.io/) service mesh

In order to do that, serviceMesh.istio has to be set to true in the values.yaml file. Setting it to true will let the envoy sidecard do the tls termination as currently there is no support for SNI. See https://istio.io/blog/2018/egress-https.html

If the kubernetes cluster does not have the sidecar auto injected (https://istio.io/docs/setup/kubernetes/sidecar-injection.html), then it can be added after the deployment by running:

```
helm get <release-name> | sed -e '1,/MANIFEST:/d' | istioctl kube-inject -f - | kubectl apply -f -

```

Since both news and weather services apis are ouside the service mesh, then egress rules must be added to allow the traffic:

```
apiVersion: config.istio.io/v1alpha2
kind: EgressRule
metadata:
  name: openweathermap-egress-rule
spec:
  destination:
    service: api.openweathermap.org
  ports:
    - port: 443
      protocol: https
---
apiVersion: config.istio.io/v1alpha2
kind: EgressRule
metadata:
  name: news-egress-rule
spec:
  destination:
    service: newsapi.org
  ports:
    - port: 80
      protocol: http
    - port: 443
      protocol: https
```