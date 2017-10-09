
test:
	docker build -t pdfgen .
	docker run --rm -t -v $(HOME)/.config/gcloud:/home/pptruser/.config/gcloud pdfgen node index.js --local --bucket pdfgen-example --filename example/example.pdf --url https://www.google.com/
