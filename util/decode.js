const decodeBase64Image = (dataString) => {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const response = {};
  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }
  [, response.type] = matches;
  response.data = Buffer.from(matches[2], 'base64');
  return response;
};

module.exports = decodeBase64Image;
