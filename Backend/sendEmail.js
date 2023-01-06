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

let sendEmail = (recipientEmail, bodyContent, mailTitle) => { // Title 에 수신자 이름 포함할 것
    let params = {
      Source: "mail@caunotify.me",
      Destination: {
        ToAddresses: [
          recipientEmail
        ],
      },
      ReplyToAddresses: [],
      Message: { /* required */
        Body: { /* required */
          Html: {
          Charset: "UTF-8",
          Data: "HTML_FORMAT_BODY"
          },
          Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY"
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Test email'
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
        "ToAddresses": [ 
          recipientEmail
        ]
      },
      "TemplateData": "{ \"name\":\"John Doe\"}"
    };
    return AWS_SES.sendTemplatedEmail(params).promise();
};


sendEmail("na_sanghyun@naver.com","NaSangHyun","MailTitle");

export default {
    sendEmail,
    sendTemplateEmail,
};