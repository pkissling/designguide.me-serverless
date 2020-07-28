'use strict';

var aws = require('aws-sdk');
var s3 = new aws.S3();

const allowedOrigins = [
    'https://designguide.me',
    'https://www.designguide.me',
    'http://localhost:8080'
  ]

exports.handler = async (event) => {

    // env variables
    const bucket = process.env.S3_BUCKET

    // cors headers
    var origin = event.headers['Origin'] || event.headers['origin']
    var corsHeaders = allowedOrigins.includes(origin) ?
        {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        }
        : {}

    // validate payload
    var validationError = validatePayload(event.body)
    if (validationError) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ "message": validationError })
        };
    }

    // mandatory fields
    var payload = JSON.parse(event.body)
    var fileName = payload.fileName
    var fileType = payload.fileType
    var context = payload.context

    // create signed url
    const url = s3.getSignedUrl('putObject', {
        "Bucket": bucket,
        "Key": context + "/" + fileName,
        "ContentType": fileType
    });

    // construct and return response
    return {
        statusCode: 200,
        headers: corsHeaders,
        body: url
    };
};

function validatePayload(body) {
    var payload = JSON.parse(body)
    if (!payload.fileType) {
        return "Attribute 'fileType' is mandatory"
    } else if (!payload.fileName) {
        return "Attribute 'fileName' is mandatory"
    } else if (!payload.context) {
        return "Attribute 'context' is mandatory"
    }

    return null // payload valid
}