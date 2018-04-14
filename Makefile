
test:
	docker build -t pdfgen .
	docker run -it --rm -p 3000:3000 -t pdfgen

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
