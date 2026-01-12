clean:
	rm -rf build
build:
	mkdir -p build
	cp -r static build/static
	uv run build.py

deploy:
	scp -r build/* $(ACADEMIS_HOST):/www/academis/

test:
	uv run pytest -s