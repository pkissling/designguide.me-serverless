'use strict';

var aws = require('aws-sdk');
var ses = new aws.SES({ region: 'eu-central-1' });
const allowedOrigins = [
  'https://designguide.me',
  'https://www.designguide.me'
]

module.exports.messages = async (event) => {

  var payload = JSON.parse(event.body)
  var validationError = validatePayload(payload)
  if (validationError) {
    return {
      statusCode: 400,
        body: JSON.stringify({"message" : validationError})
    };
  }

  // cors headers
  var origin = event.headers['Origin'] || event.headers['origin']
  var corsHeaders = allowedOrigins.includes(origin) ? { "Access-Control-Allow-Origin": origin } : {}

  // env variables
  var toMail = process.env.toMail
  var fromMail = process.env.fromMail

  // mandatory fields
  var payload = JSON.parse(event.body)
  var name = payload.name
  var email = payload.email

  // optional fields
  var phone = payload.phone || "-"
  var purpose = payload.purpose || "-"
  var other = payload.other || "-"

  // send mail
  console.log("sending mail");
  var email = createEmail(fromMail, toMail, name, email, phone, purpose, other);
  await ses.sendEmail(email).promise()
  console.log("email sent");

  // construct and return response
  return {
    headers: corsHeaders,
    statusCode: 200
  };
};

function createEmail(fromMail, toMail, name, email, phone, purpose, other) {
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
            "Sontiges: " + other
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