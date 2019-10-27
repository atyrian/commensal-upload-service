const response = (data) => ({
  body: JSON.stringify({
    data,
    code: 200,
  }),
});

module.exports = response;
