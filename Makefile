.PHONY: build clean deploy

default: deploy

prepare:
	npm install serverless-domain-manager@2.6.13
	npm install serverless-rust

deploy_dev: prepare
	sls create_domain --stage dev
	sls deploy --stage dev

test_dev:
	echo tests

deploy_prod: test_dev
	sls create_domain --stage prod
	sls deploy --stage prod
