.PHONY: build clean deploy

build:
	npm install

clean:
	rm -rf ./target

deploy: clean build
	sls create_domain
	sls deploy --verbose
