
test:
	docker build -t pdfgen .
	docker run -it --rm -e AUTH=foo -p 3000:3000 -t pdfgen

test-call:
	http -v POST localhost:3000/api url=https://www.google.com 'Authorization: Bearer foo' -o ~/Desktop/example.pdf

lint:
	npm run lint

deploy:
ifndef tag
	$(error tag is not set)
endif

	git push
	docker build -t altipla/pdfgen:latest .
	docker build -t altipla/pdfgen:$(tag) .
	docker push altipla/pdfgen:latest
	docker push altipla/pdfgen:$(tag)
	git tag $(tag)
	git push origin --tags
