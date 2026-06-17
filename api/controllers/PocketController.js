module.exports = {
  getBalance: async function (req, res) {
    try {
      const pocket = await Pocket.findOne({ owner: req.customerId });
      if (!pocket) {
        return res.error(
          RespCode.POCKET_NOT_FOUND.code,
          RespCode.POCKET_NOT_FOUND.message
        );
      }
      return res.ok({
        balance: pocket.balance,
      });
    } catch (error) {
      console.error(error);
      return res.error(
        RespCode.SYSTEM_ERROR.code,
        RespCode.SYSTEM_ERROR.message
      );
    }
  },
};
