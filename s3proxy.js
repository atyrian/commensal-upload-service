const AWS = require('aws-sdk');
const request = require('request');

module.exports = class s3Proxy {
  constructor() {
    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      region: process.env.REGION,
    });
  }

  async upload(input) {
    if (input.imageUrl) {
      return this.uploadFromUrl(input.imageUrl, `${input.path}/${input.index}.jpg`);
    }
    if (input.buffer) {
      return this.s3PutObject(input.buffer, `${input.path}/${input.index}.jpg`, 'image/jpg');
    }
    return false;
  }

  async uploadFromUrl(url, key) {
    const response = await new Promise((resolve, reject) => request({ url, encoding: null },
      (err, res, body) => {
        if (err) {
          reject(new Error(err.message));
        }
        return resolve({ body, res });
      }));
    return this.s3PutObject(response.body, key, response.res.headers['content-type']);
  }

  async s3PutObject(body, key, contentType) {
    return this.s3.putObject({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      Body: body,
      ACL: process.env.BUCKET_ACL,
    }).promise();
  }
};
