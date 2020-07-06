ZIP_PREFIX := designguide-me
FUNCTIONS_S3_BUCKET := designguide.me-functions-src
AWS_DEFAULT_REGION ?= eu-central-1

default: sync

SRC_DIR = ./src
SRC_FILES := $(wildcard $(SRC_DIR)/*)
TARGET_DIR = ./target

cleanup:
	@if [ -d "${TARGET_DIR}" ]; then rm -Rf ${TARGET_DIR}; fi
	@mkdir target

package: cleanup
	@ cd "${SRC_DIR}" && $(foreach SRC_FILE, $(SRC_FILES), zip ../${TARGET_DIR}/${ZIP_PREFIX}_$(basename $(notdir $(SRC_FILE))).zip $(notdir $(SRC_FILE));)

sync: package
	aws s3 sync ./target s3://${FUNCTIONS_S3_BUCKET}
