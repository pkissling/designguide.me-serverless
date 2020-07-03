.PHONY: prepare deploy_dev deploy_prod

default: deploy_prod

prepare:
	npm install

deploy_dev: prepare
	sls create_domain --stage dev
	sls deploy --stage dev

deploy_prod: deploy_dev
	sls create_domain --stage prod
	sls deploy --stage prod