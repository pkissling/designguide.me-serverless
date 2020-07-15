'use strict';

var aws = require('aws-sdk');
var s3 = new aws.S3();

const allowedOrigins = [
    'https://designguide.me',
    'https://www.designguide.me'
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

    // http headers
    const fileType = event.headers['FileType']
    const fileName = event.headers['FileName']
    const context = event.headers['Context']

    // validate params
    var validationError = validateParams(fileType, fileName, context)
    if (validationError) {
        return {
            statusCode: 400,
            headers: corsHeaders,
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
        statusCode: 200,
        headers: corsHeaders,
        body: url
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