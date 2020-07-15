'use strict';

var aws = require('aws-sdk');
var s3 = new aws.S3();

exports.handler = async (event) => {

    // env variables
    const bucket = process.env.S3_BUCKET

    // http headers
    const fileType = event.headers['FileType']
    const fileName = event.headers['FileName']
    const context = event.headers['Context']

    // validate params
    var validationError = validateParams(fileType, fileName, context)
    if (validationError) {
        return {
            statusCode: 400,
            body: JSON.stringify({ "message": validationError })
        };
    }

    // create signed url
    const url = s3.getSignedUrl('putObject', {
        "Bucket": bucket,
        "Key": context + "/" + fileName,
        "ContentType": fileType
    });

    // construct and return response
    return {
        body: url,
        statusCode: 200
    };
};

function validateParams(fileType, fileName, context) {
    if (!fileType) {
        return "HTTP header 'FileType' is mandatory"
    } else if (!fileName) {
        return "HTTP header 'FileName' is mandatory"
    } else if (!context) {
        return "HTTP header 'Context' is mandatory"
    }

    return null // payload valid
}