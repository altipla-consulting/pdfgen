
test:
	docker build -t pdfgen .
	docker run --rm -t -v $(HOME)/.config/gcloud:/root/.config/gcloud pdfgen node index.js --bucket pdfgen-example --filename example/example.pdf --url https://www.amazon.com/
