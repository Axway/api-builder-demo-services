echo ======================
echo === Create Cluster ===
echo ======================
k3d delete --name democluster
k3d create --enable-registry --server-arg '--no-deploy=servicelb' --server-arg '--no-deploy=traefik' --name democluster --port 7443
sleep 15
export KUBECONFIG="$(k3d get-kubeconfig --name='democluster')"
kubectl cluster-info

echo ======================
echo ===   Setup Helm   ===
echo ======================

cat > rbac.config << EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: tiller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: tiller
    namespace: kube-system
EOF

kubectl apply -f rbac.config
helm init --service-account tiller --history-max 200
helm repo up

echo ======================
echo ===    Wait     ===
echo ======================

while [[ $(kubectl -n kube-system get pods -l app=helm -o 'jsonpath={..status.conditions[?(@.type=="Ready")].status}') != "True" ]]; do echo "waiting for helm" && sleep 3; done

echo ======================
echo ===    Copying in Images     ===
echo ======================
k3d i --name=democluster  axway/api-builder-demo-services:news-service
k3d i --name=democluster  axway/api-builder-demo-services:weather-service
k3d i --name=democluster  axway/api-builder-demo-services:user-news-and-weather
