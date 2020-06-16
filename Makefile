.PHONY: build clean deploy

build:
	npm install

clean:
	rm -rf ./target

deploy: clean build
	sls deploy --verbose
