build:
	rm -rf build
	mkdir -p build
	cp -r static build/static
	python build.py

deploy:
	scp -r build/* $(ACADEMIS_SERVER):/www/academis/
