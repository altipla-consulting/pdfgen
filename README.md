
# pdfgen

> Generacion de PDFs con puppeteer.

Esta aplicación cuidadosamente preparada para ejecutarse en un contenedor recibe una URL normalmente de caracter interno (para generar bonos, informes, etc.); la imprime a PDF usando Chrome Headless y sube el fichero a un lugar de Google Cloud Storage que le indiquemos.


### Ejemplo de uso

Necesitamos crear en Google Cloud Console un bucket de prueba (con un nombre propio, `example-bucket` no servirá). También necesitamos tener instalado git y docker.

```shell
git clone git@github.com:altipla-consulting/pdfgen.git
docker build -t pdfgen .
docker run --rm -t -v $(HOME)/.config/gcloud:/home/local/.config/gcloud pdfgen node index.js --bucket example-bucket --filename example/example.pdf --url https://www.google.com/
```

El volumen que compartimos sirve en Linux para probar con los ADC (credenciales por defecto de aplicación) cuando interactuemos con la API de Google Cloud Storage.


### Parámetros

| Parámetro | Descripción |
| --------- | ----------- |
| `--bucket example-bucket` | Indica el bucket de destino donde se subirá el fichero.
| `--filename example/example.pdf` | Indica el nombre del fichero dentro del bucket de destino. |
| `--url https://www.google.com` | URL que intentará descargarse. |
| `--user username` | Usuario que se enviará al pedir la página para comprobar que somos realmente nosotros. |
| `--password passw` | Contraseña que se enviará al pedir la página para comprobar que somos realmente nosotros. |


### Uso con Kubernetes

Dado que es una aplicación que se abre, se ejecuta realizando las acciones pertienentes y después se cierra recomendamos ejecutarla dentro de un Job asíncrono. Recomendamos usar la API interna de Kubernetes (o externa con una cuenta de servicio) para crear un Job, probar cada pocos segundos si ya ha terminado, y cuando lo esté descargarse el fichero tranquilamente desde Storage en la ruta prefijada.

Previamente hay que compilar el Dockerfile que incluimos en este repo. Recomendamos usar Google Container Registry para subir la imagen.

Ejemplo de YAML de un Job de Kubernetes:

```yaml
# TODO(ernesto): Traerse un ejemplo de los que ejecutamos.
```
