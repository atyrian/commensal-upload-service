const common = require('commensal-common');

const callApi = async (endpoint, method, token, body = {}) => fetch(`${process.env.API_BASEURL}${endpoint}`, {
  method,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
  },
  body: JSON.stringify(body),
}).then((res) => {
  if (res.status !== 200) {
    throw new common.errors.HttpError(res.statusText ? res.statusText : 'Error', res.status);
  }
  return res.json();
}).then((data) => {
  if (data.code !== 200) {
    throw new common.errors.HttpError(data.message ? data.message : 'Error', data.code);
  }
  return data;
});

module.exports = callApi;
