const common = require('commensal-common');
const ImageUploadHttpHandler = require('./src/httpHandlers/ImageUploadHttpHandler');

module.exports.imagePost = common.aws.lambdaWrapper(
  (event) => {
    const imageUploadHttpHandler = new ImageUploadHttpHandler(event);
    return imageUploadHttpHandler.post();
  },
);

module.exports.userAuthorizer = common.aws.lambdaWrapper(
  (event) => {
    const authorizer = new common.aws.UserAuthorizer(event);
    return authorizer.authorize();
  },
);
