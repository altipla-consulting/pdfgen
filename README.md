
# pdfgen

> Generate PDFs with puppeteer.

This server will return a PDF printed with Headless Chrome when requested through a web API.


### Usage

We have a build a Docker container to make it easy to run pdfgen.

Run the container:

```shell
docker run -it --rm -p 3000:3000 -t pdfgen
```

In other shell call the API using [HTTPie](https://httpie.org/):

```
http POST :3000/api url=https://www.google.com
```

### API

There is a single endpoint `/api` exposed in the port `:3000`. Send a `POST` request to that endpoint with a JSON body with the following options:

| Option | Description |
| ------ | ----------- |
| url | URL to download and print as PDF. |


### Environment variables

There is an env var called `DEBUG=*` that you can activate to emit every single message sent and received to Headless Chrome to debug hard to find issues.
