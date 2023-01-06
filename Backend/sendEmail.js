import AWS from 'aws-sdk'
// import * as keys from "../../SES_Access_Key.json" assert { type: "json" };
import fs from "fs"

let keys = '';

fs.readFile("../../SES_Access_Key.json", "utf-8", function (err, data) {
  if (err) throw err;
  // console.log(data);
  keys = JSON.parse(data);
  // console.log(keys.accessKey);
  // console.log(keys.secretAccessKey);
});

// console.log(keys.default.accessKey);
// console.log(keys.default.secretAccessKey);

const SES_CONFIG = {
    accessKeyId: keys.accessKey,
    secretAccessKey: keys.secretAccessKey,
    region: 'ap-northeast-1',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

let sendEmail = (recipientEmail, recipientName) => {
    let params = {
      Source: 'mail@caunotify.me',
      Destination: {
        ToAddresses: [
          recipientEmail
        ],
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: 'This is the body of my email!',
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `Hello, ${recipientName}!`,
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

// export default {
//     sendEmail,
//     sendTemplateEmail,
// };

sendTemplateEmail("na_sanghyun@naver.com");
