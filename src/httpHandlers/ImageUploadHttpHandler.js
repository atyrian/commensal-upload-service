const common = require('commensal-common');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const S3Proxy = require('../../s3proxy');
const decodeBase64Image = require('../../util/decode');
const createResponse = require('../../util/response');
const callApi = require('../../util/callApi');

module.exports = class ImageUploadHttpHandler {
  constructor(event) {
    this.event = event;
    this.s3proxy = new S3Proxy();
  }

  async post() {
    const data = JSON.parse(this.event.body);
    const { file, imageUrl, index } = data;
    const { requestContext: { authorizer: { userId } } } = this.event;
    const endpoint = `/account/id/${userId}/profile`;
    const token = this.event.headers.Authorization.replace(/Bearer/g, '').trim();

    if (!file && !imageUrl) {
      throw new common.errors.HttpError('Expected Base64 encoded file or imageUrl in body.', 400);
    }

    if (typeof index === 'undefined' || Number.isNaN(Number(index))) {
      throw new common.errors.HttpError('Expected index parameter to be one of 0,1,2', 400);
    }

    const body = { [`photo_${index}`]: `${process.env.BUCKET_BASEURL}/${userId}/${index}.jpg` };

    if (file) {
      const decodedImage = decodeBase64Image(data.file);
      await this.s3proxy.upload({ buffer: decodedImage.data, path: userId, index });
      await callApi(endpoint, 'PUT', token, body);
      return createResponse(body);
    }

    if (imageUrl) {
      await this.s3proxy.upload({ imageUrl, index, path: userId });
      await callApi(endpoint, 'PUT', token, body);
      return createResponse(body);
    }
    return createResponse({});
  }
};
