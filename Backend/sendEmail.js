import AWS from 'aws-sdk'

const SES_CONFIG = {
    accessKeyId: 'AKIAQTXUP5OPBE62L7I6',
    secretAccessKey: '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',
    region: 'ap-northeast-1',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

let sendEmail = (recipientEmail, name) => {
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
          Data: `Hello, ${name}!`,
        }
      },
    };
    return AWS_SES.sendEmail(params).promise();
};

let sendTemplateEmail = (recipientEmail) => {
    let params = {
      Source: 'mail@caunotify.me',
      Template: 'Template',
      Destination: {
        ToAddresses: [ 
          recipientEmail
        ]
      },
      TemplateData: '{ \'name\':\'John Doe\'}'
    };
    return AWS_SES.sendTemplatedEmail(params).promise();
};

export default {
    sendEmail,
    sendTemplateEmail,
};