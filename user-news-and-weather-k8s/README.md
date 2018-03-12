# Setup

## Developer Environment with Minikube
It's assumed you've installed minikube, if not see [Setting up minikube](https://kubernetes.io/docs/getting-started-guides/minikube/).

### Start minikube:
```
minikube start
minikube dashboard
```

### Build the images
This is temporary but as the services aren't published you'll need to build them manually. Once published this step won't be required.

```
eval $(minikube docker-env)
docker build -t axway-api-builder-demo-news-service ../news-service
docker build -t axway-api-builder-demo-weather-service ../weather-service
docker build -t axway-api-builder-demo-user-news-and-weather-service ../user-news-and-weather
```

### Install Helm
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

### One Service

This chart sets up a single sevice and a single pod containing the three containers. See [./oneservice/user-news-and-weather/README.md](./oneservice/user-news-and-weather/README.md) for more detail.

```
helm install  ./oneservice/user-news-and-weather
```

This will install the full deployment. It will output something like:

```
NAME:   funky-frog
LAST DEPLOYED: Thu Mar  8 14:37:22 2018
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Service
NAME                              TYPE      CLUSTER-IP     EXTERNAL-IP  PORT(S)          AGE
funky-frog-user-news-and-weather  NodePort  10.98.122.237  <none>       32000:32000/TCP  1s

==> v1beta2/Deployment
NAME                              DESIRED  CURRENT  UP-TO-DATE  AVAILABLE  AGE
funky-frog-user-news-and-weather  1        0        0           0          1s

==> v1/Pod(related)
NAME                                               READY  STATUS   RESTARTS  AGE
funky-frog-user-news-and-weather-6444496c4b-jjvcg  0/3    Pending  0         0s


NOTES:
1. Get the application URL by running these commands:
  export NODE_PORT=$(kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services funky-frog-user-news-and-weather)
  export NODE_IP=$(kubectl get nodes --namespace default -o jsonpath="{.items[0].status.addresses[0].address}")
  echo http://$NODE_IP:$NODE_PORT

```

Note the name ```funky-frog``` in this case. This is the name of the _release_ and is how you can delete the install:

```
helm delete funky-frog
```

Run the commands in the notes to get the port and ip, i.e.

```
  export NODE_PORT=$(kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services funky-frog-user-news-and-weather)
  export NODE_IP=$(kubectl get nodes --namespace default -o jsonpath="{.items[0].status.addresses[0].address}")
  echo http://$NODE_IP:$NODE_PORT
```

You should now be able to connect to the API.

### Three Services

This chart sets up a three sevices and three pods, one for each of the API Builder apps. This configuration allows for independent replication scaling and also allows the easy reuse of the services. As with the _oneservice_ setup the only service exposed externally is the user-news-and-weather-service, both _news-service_ and _weather-service_ are only visible inside the cluster.

 See [./threeservices/user-news-and-weather/README.md](./threeservices/user-news-and-weather/README.md) for more detail.

```
helm install  ./threeservices/user-news-and-weather
```

This will install the full deployment. It will output something like:


```
NAME:   newbie-owl
LAST DEPLOYED: Thu Mar  8 14:47:52 2018
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Pod(related)
NAME                                               READY  STATUS             RESTARTS  AGE
newbie-owl-news-5c68885574-td6sn                   0/1    ContainerCreating  0         2s
newbie-owl-user-news-and-weather-8558fc896b-gfr44  0/1    ContainerCreating  0         2s
newbie-owl-weather-7dd78c56f8-wnf7t                0/1    ContainerCreating  0         1s

==> v1/Service
NAME                              TYPE       CLUSTER-IP      EXTERNAL-IP  PORT(S)          AGE
newbie-owl-news                   ClusterIP  10.103.201.181  <none>       80/TCP           3s
newbie-owl-user-news-and-weather  NodePort   10.107.65.230   <none>       32000:32000/TCP  2s
newbie-owl-weather                ClusterIP  10.111.58.251   <none>       80/TCP           2s

==> v1beta2/Deployment
NAME                              DESIRED  CURRENT  UP-TO-DATE  AVAILABLE  AGE
newbie-owl-news                   1        0        0           0          2s
newbie-owl-user-news-and-weather  1        0        0           0          2s
newbie-owl-weather                1        0        0           0          2s


NOTES:
1. Get the application URL by running these commands:
  export NODE_PORT=$(kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services newbie-owl-user-news-and-weather)
  export NODE_IP=$(kubectl get nodes --namespace default -o jsonpath="{.items[0].status.addresses[0].address}")
  echo http://$NODE_IP:$NODE_PORT
```

Note the name ```newbie-owl``` in this case. This is the name of the _release_ and is how you can delete the install:

```
helm delete newbie-owl
```

Run the commands in the notes to get the port and ip, i.e.

```
  export NODE_PORT=$(kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services newbie-owl-user-news-and-weather)
  export NODE_IP=$(kubectl get nodes --namespace default -o jsonpath="{.items[0].status.addresses[0].address}")
  echo http://$NODE_IP:$NODE_PORT
```

You should now be able to connect to the API.