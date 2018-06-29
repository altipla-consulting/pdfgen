
<p align="center">
  <img src="https://storage.googleapis.com/altipla-external-files/logos/pdfgen.png">
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

```
http POST :3000/api url=https://www.google.com
```


## API

There is a single endpoint `/api` exposed in the port `:3000`. Send a `POST` request to that endpoint with a JSON body with the following options:

| Option | Description |
| ------ | ----------- |
| `url` | URL to download and print as PDF. |
| `content` | HTML content to insert in the page. |
| `header` | HTML content of the header. |
| `footer` | HTML content of the footer. |
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

There is an env var called `DEBUG=*` that you can activate to emit every single message sent and received to Headless Chrome to debug hard to find issues.


## Kubernetes

We have a [deployment](k8s/deployment.yaml) and [service](k8s/service.yaml) prepared as examples of how to deploy to a cluster. Download and apply them to have pdfgen running in your cluster:

```
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```


## Health checks

You can hit the `/health` endpoint to obtain an `ok` and use it as health check for the Kubernetes pod.
