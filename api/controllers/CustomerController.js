module.exports = {
  register: async function (req, res) {
    try {
      const { phone, password } = req.body;
      if (!phone || !password) {
        return res.error(
          RespCode.INVALID_PARAMS.code,
          "Thiếu số điện thoại hoặc mật khẩu",
        );
      }
      const existingCustomer = await Customer.findOne({ phone });
      if (existingCustomer) {
        return res.error(
          RespCode.PHONE_EXISTED.code,
          RespCode.PHONE_EXISTED.message,
        );
      }
      const newCustomer = await Customer.create({ phone, password }).fetch();
      const newPocket = await Pocket.create({ owner: newCustomer.id }).fetch();

      return res.ok({
        customer: newCustomer,
        pocketId: newPocket.id,
        balance: newPocket.balance,
      });
    } catch (error) {
      console.error(error);
      return res.error(
        RespCode.SYSTEM_ERROR.code,
        RespCode.SYSTEM_ERROR.message,
      );
    }
  },

  login: async function (req, res) {
    try {
      const { phone, password } = req.body;
      if (!phone || !password) {
        return res.error(
          RespCode.INVALID_PARAMS.code,
          RespCode.INVALID_PARAMS.message,
        );
      }
      const customer = await Customer.findOne({ phone });
      if (!customer) {
        return res.error(
          RespCode.USER_NOT_FOUND.code,
          RespCode.USER_NOT_FOUND.message,
        );
      }
      if (customer.password !== password) {
        return res.error(
          RespCode.WRONG_PASSWORD.code,
          RespCode.WRONG_PASSWORD.message,
        );
      }
      const token = JwtService.issue({
        id: customer.id,
        phone: customer.phone,
      });
      return res.ok({ token });
    } catch (error) {
      console.error(error);
      return res.error(
        RespCode.SYSTEM_ERROR.code,
        RespCode.SYSTEM_ERROR.message,
      );
    }
  },
};
