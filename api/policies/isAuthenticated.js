module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.error(RespCode.MISS_BEARER.code, RespCode.MISS_BEARER.message);
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = JwtService.verify(token);
    const customer = await Customer.findOne({ id: decoded.id });
    if (!customer) {
      return res.error(
        RespCode.USER_NOT_FOUND.code,
        RespCode.USER_NOT_FOUND.message,
      );
    }
    req.customerId = customer.id;
    return next();
  } catch (error) {
    return res.error(RespCode.UNAUTHORIZED.code, RespCode.UNAUTHORIZED.message);
  }
};
