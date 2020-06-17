.PHONY: build clean deploy

default: deploy

prepare:
	npm install serverless-domain-manager
	npm install serverless-rust

deploy: prepare
	sls create_domain
	sls deploy
