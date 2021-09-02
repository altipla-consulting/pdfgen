
test:
	docker build -t pdfgen .
	docker run -it --rm -e AUTH=foo -p 3000:3000 -t pdfgen

test-call:
	http -v POST localhost:3000/api url=https://www.google.com 'Authorization: Bearer foo' -o ~/Desktop/example.pdf

lint:
	npm run lint

deploy:
	git push
	docker build -t altipla/pdfgen:latest .
	docker build -t altipla/pdfgen:$(shell git describe --abbrev=0 --tags) .
	docker push altipla/pdfgen:latest
	docker push altipla/pdfgen:$(shell git describe --abbrev=0 --tags)
