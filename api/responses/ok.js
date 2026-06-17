module.exports = function (data = {}) {
  const res = this.res;
  const err = 200;
  const message = "OK";

  const payload = {
    err,
    message,
    ...data,
  };

  return res.status(200).json(payload);
};
