module.exports = {
  transfer: async function (req, res) {
    try {
      const { receiverPhone, amount } = req.body;
      const senderId = req.customerId;
      if (!receiverPhone || !amount) {
        return res.error(RespCode.MISS_INFO.code, RespCode.MISS_INFO.message);
      }
      const receiver = await Customer.findOne({ phone: receiverPhone });
      if (!receiver) {
        return res.error(
          RespCode.USER_NOT_FOUND.code,
          RespCode.USER_NOT_FOUND.message,
        );
      }
      if (receiver.id === senderId) {
        return res.error(
          RespCode.TRANSFER_SELF.code,
          RespCode.TRANSFER_SELF.message,
        );
      }
      const senderPocket = await Pocket.findOne({ owner: senderId });
      const receiverPocket = await Pocket.findOne({ owner: receiver.id });
      if (!senderPocket || !receiverPocket) {
        return res.error(
          RespCode.POCKET_NOT_FOUND.code,
          RespCode.POCKET_NOT_FOUND.message,
        );
      }
      if (senderPocket.balance < amount) {
        return res.error(
          RespCode.INSUFFICIENT_BALANCE.code,
          RespCode.INSUFFICIENT_BALANCE.message,
        );
      }

      const newSenderBalance = senderPocket.balance - amount;
      const newReceiverBalance = receiverPocket.balance + amount;

      await Pocket.updateOne({ id: senderPocket.id }).set({
        balance: newSenderBalance,
      });
      await Pocket.updateOne({ id: receiverPocket.id }).set({
        balance: newReceiverBalance,
      });

      const transaction = await Transaction.create({
        fromPocket: senderPocket.id,
        toPocket: receiverPocket.id,
        amount,
        status: "SUCCESS",
      }).fetch();
      return res.ok({
        transactionId: transaction.id,
        currentBalance: newSenderBalance,
      });
    } catch (error) {
      console.error(error);
      return res.error(
        RespCode.SYSTEM_ERROR.code,
        RespCode.SYSTEM_ERROR.message,
      );
    }
  },

  history: async function (req, res) {
    try {
      const customerId = req.customerId;
      const pocket = await Pocket.findOne({ owner: customerId });
      if (!pocket) {
        return res.error(
          RespCode.POCKET_NOT_FOUND.code,
          RespCode.POCKET_NOT_FOUND.message,
        );
      }
      const transactions = await Transaction.find({
        or: [{ fromPocket: pocket.id }, { toPocket: pocket.id }],
      })
        .populate("fromPocket")
        .populate("toPocket")
        .sort("createdAt DESC");
      return res.ok({ transactions });
    } catch (error) {
      console.error(error);
      return res.error(
        RespCode.SYSTEM_ERROR.code,
        RespCode.SYSTEM_ERROR.message,
      );
    }
  },
};
