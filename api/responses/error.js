module.exports = function (errCode, message, data = {}) {
  const res = this.res;

  const payload = {
    err: errCode,
    message: message,
    ...data,
  };

  return res.status(200).json(payload);
};
