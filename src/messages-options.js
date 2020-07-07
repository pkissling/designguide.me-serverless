'use strict';

const allowedOrigins = [
  'https://designguide.me',
  'https://www.designguide.me'
]

exports.handler = async (event) => {

  // cors headers
  var origin = event.headers['Origin'] || event.headers['origin']
  var corsHeaders = allowedOrigins.includes(origin) ?
    {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST"
    }
    : {}

  // log
  console.log(`Origin: ${origin}`)

  // construct and return response
  return {
    headers: corsHeaders,
    statusCode: 200
  };
};