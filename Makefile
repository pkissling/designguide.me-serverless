.PHONY: prepare deploy_dev test_dev deploy_prod

default: deploy_prod

prepare:
	npm install serverless-domain-manager@2.6.13
	npm install serverless-rust

deploy_dev: prepare
	sls create_domain --stage dev
	sls deploy --stage dev

test_dev: deploy_dev
	chmod +x tests/messages.sh
	./tests/messages.sh

deploy_prod: test_dev
	sls create_domain --stage prod
	sls deploy --stage prod

logs:
	sls logs -f messages -t
