const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "secretKey";
module.exports = {
  issue: (payload, options) => {
    return jwt.sign(payload, secret, options);
  },
  verify: (token) => {
    return jwt.verify(token, secret);
  },
};
