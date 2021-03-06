'use strict';

var aws = require('aws-sdk');
var ses = new aws.SES({ region: 'eu-west-1' });

const allowedOrigins = [
  'https://designguide.me',
  'https://www.designguide.me',
  'http://localhost:8080'
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

  // validate payload
  var payload = JSON.parse(event.body)
  var validationError = validatePayload(payload)
  if (validationError) {
    return {
      headers: corsHeaders,
      statusCode: 400,
      body: JSON.stringify({"message" : validationError})
    };
  }

  // env variables
  var toMail = process.env.TO_MAIL
  var fromMail = process.env.FROM_MAIL

  // mandatory fields
  var payload = JSON.parse(event.body)
  var name = payload.name
  var email = payload.email

  // optional fields
  var phone = payload.phone || "-"
  var purpose = payload.purpose || "-"
  var other = payload.other || "-"
  var attachments = payload.attachments || []

  // send mail
  console.log("sending mail");
  var email = createEmail(fromMail, toMail, name, email, phone, purpose, other, attachments);
  await ses.sendEmail(email).promise()
  console.log("email sent");

  // construct and return response
  return {
    headers: corsHeaders,
    statusCode: 200
  };
};

function createEmail(fromMail, toMail, name, email, phone, purpose, other, attachments) {
  return {
    Source: fromMail,
    Destination: {
      ToAddresses: [toMail]
    },

    Message: {

      Subject: {
        Data: "Kontaktformular"
      },

      Body: {
        Text: {
          Data:
            "Name: " + name + '\n\n' +
            "Email: " + email + "\n\n" +
            "Telefonnummer: " + phone + "\n\n" +
            "Zweck: " + purpose + "\n\n" +
            "Sontiges: " + other + "\n\n" +
            "Attachments: " + attachments
        }
      }
    }
  };
}

function validatePayload(payload) {
  if (!payload) {
    return "mandatory attributes are: [name, email]"
  } else if (!payload.name) {
    return "attribute [name] is mandatory"
  } else if (!payload.email) {
    return "attribute [email] is mandatory"
  }

  return null // payload valid
}