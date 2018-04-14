
test:
	docker build -t pdfgen .
	docker run -it --rm -p 3000:3000 -t pdfgen
