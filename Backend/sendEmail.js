// import * as keys from "../../SES_Access_Key.json" assert { type: "json" }
import AWS from 'aws-sdk'
import fs from "fs"

let keys = '';

fs.readFile("../../SES_Access_Key.json", "utf-8", function (err, data) {
  if (err) throw err;
  keys = JSON.parse(data);
});

// console.log(data);
// console.log(keys.accessKey);
// console.log(keys.secretAccessKey);

const SES_CONFIG = {
    accessKeyId: keys.accessKey,
    secretAccessKey: keys.secretAccessKey,
    region: 'ap-northeast-1',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

let sendEmail = (recipientEmail, bodyContent, mailTitle) => { // Title �� ������ �̸� ������ ��
    let params = {
      Source: "mail@caunotify.me",
      Destination: {
        ToAddresses: [
          recipientEmail
        ],
      
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
          Charset: "UTF-8",
          Data: bodyContent
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: mailTitle
        }
      },
    };
    return AWS_SES.sendEmail(params).promise();
};

let sendTemplateEmail = (recipientEmail) => {
    let params = {
      "Source": "mail@caunotify.me",
      "Template": "ExampleTemplate",
      "Destination": {
            "ToAddresses": [recipientEmail]
      },
      "TemplateData": "{ \"name\":\"John Doe\"}",
      "ReplyToAddresses": [
        "admin@caunotify.me"
      ]
    };
    return AWS_SES.sendTemplatedEmail(params).promise();
};


// Handle promise's fulfilled/rejected states
sendTemplateEmail("na_sanghyun@naver.com").then(
  function(data) {
    console.log(data);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });

// sendTemplateEmail("na_sanghyun@naver.com");

export default {
    sendEmail,
    sendTemplateEmail,
};
