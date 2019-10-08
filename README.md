
<p align="center">
  <img src="https://storage.googleapis.com/altipla-external-files/logos/pdfgen-v2.png">
</p>
<br>

Server to generate PDFs with [puppeteer](https://github.com/GoogleChrome/puppeteer) through a web API.


## Usage

We have a build a Docker container to make it easy to run pdfgen.

Run the container:

```shell
docker run -it --rm -p 3000:3000 -t altipla/pdfgen
```

In other shell call the API using [HTTPie](https://httpie.org/):

```shell
http -v POST localhost:3000/api url=https://www.google.com -o example.pdf
```


### Latest version

You can see the versions in [Docker Hub](https://hub.docker.com/r/altipla/pdfgen/tags/). You can also use the `latest` tag to always have the newest version.


## API

There is a single endpoint `/api` exposed in the port `:3000`. Send a `POST` request to that endpoint with a JSON body with the following options:

| Option | Description |
| ------ | ----------- |
| `url` | URL to download and print as PDF. |
| `content` | HTML content to insert in the page. |
| `header` | HTML content of the header. |
| `footer` | HTML content of the footer. |
| `landscape` | Use landscape paper instead or portrait (default `false`). |
| `marginTop` | Margin top of every page of the document. |
| `marginRight` | Margin right of every page of the document. |
| `marginBottom` | Margin bottom of every page of the document. |
| `marginLeft` | Margin left of every page of the document. |

One of the two parameters is required. If `url` is specified `content` will be ignored.

Example raw HTTP call:

```
POST /api HTTP/1.1
Accept: application/json, */*
Content-Length: 33
Content-Type: application/json
Host: localhost:3000

{"url": "https://www.google.com"}
```

The reply will be `200 OK` when everything is OK and the body will be directly the binary data of the generated PDF file.

If an error occurs the server will return a status `500 Internal Server Error` and the body will be a JSON with an `error` field explaining in detail the failure to help debug the issue.


## Footers & headers

The `footer` and `header` parameters are rendered in a different context (aka Chromium tab) than the main body. This means the page styles won't apply here if you do not copy them inside the content. Also external files or scripts are not allowed.

We recommend to insert inline in the content the header and footers of each page instead to have more flexibility.


## Environment variables

#### DEBUG
There is an env var called `DEBUG=*` that you can activate to emit every single message sent and received to Headless Chrome to debug hard to find issues.

#### PORT
This variable controls the port this server binds to. It has this specific name to work directly under Google Cloud Run.

#### AUTH
This variable controls the authentication needed to access the API. See the Security section ahead.


## Security

Declare the environment variable `AUTH` with a custom random token as long and strange as possible and then use it in every request you send to the application as a simple Bearer token.

Example with HTTPie:


```shell
http -v POST localhost:3000/api url=https://www.google.com -o example.pdf 'Authorization: Bearer MY_TOKEN_1234'
```

If undeclared this will expose the server to anyone with access to that port allowing them to export as PDF anyweb and navigate through your machines. It is therefore highly recommended that you configure this security unless you deploy it internally in your network behind a firewall.


## Kubernetes

We have a [deployment](k8s/deployment.yaml) and [service](k8s/service.yaml) prepared as examples of how to deploy to a cluster. Download and apply them to have pdfgen running in your cluster:

```
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

The service won't be public, therefore it has no authentication (see Security above). You have to use `http://pdfgen:3000/api` as the URL to invoke it internally inside the cluster.


## Google Cloud Run

```shell
export GOOGLE_PROJECT=my-project-1234
docker pull altipla/pdfgen:latest
docker tag altipla/pdfgen:latest eu.gcr.io/$GOOGLE_PROJECT/pdfgen:latest
docker push eu.gcr.io/$GOOGLE_PROJECT/pdfgen
gcloud beta run deploy pdfgen --image eu.gcr.io/$GOOGLE_PROJECT/pdfgen:latest --concurrency 5 --memory 1Gi --timeout 30s
```


## Health checks

You can hit the `/health` endpoint to obtain an `ok` and use it as health check for the Kubernetes pod. In the example configuration files inside the [k8s](k8s) folder it is already configured.


### License

[MIT License](LICENSE)
