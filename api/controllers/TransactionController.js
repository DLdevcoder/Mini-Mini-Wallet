module = {
  transfer: async function (req, res) {
    try {
      const { receiverPhone, amount } = req.body;
      const senderId = req.session.customerId;
      if (!receiverPhone || !amount) {
        return res.error(RespCode.MISS_INFO.code, RespCode.MISS_INFO.message);
      }
      const receiver = await Customer.findOne({ phone: receiverPhone });
      if (!receiver) {
        return res.error(
          RespCode.RECEIVER_NOT_FOUND.code,
          RespCode.RECEIVER_NOT_FOUND.message
        );
      }
      if (receiver.id === senderId) {
        return res.error(
          RespCode.INVALID_RECEIVER.code,
          RespCode.INVALID_RECEIVER.message
        );
      }
      const senderPocket = await Pocket.findOne({ owner: senderId });
      const receiverPocket = await Pocket.findOne({ owner: receiver.id });
      if (!senderPocket || !receiverPocket) {
        return res.error(
          RespCode.POCKET_NOT_FOUND.code,
          RespCode.POCKET_NOT_FOUND.message
        );
      }
      if (senderPocket.balance < amount) {
        return res.error(
          RespCode.INSUFFICIENT_BALANCE.code,
          RespCode.INSUFFICIENT_BALANCE.message
        );
      }

      const newTransaction = senderPocket.balance - amount;
      const newReceiverBalance = receiverPocket.balance + amount;

      await Pocket.updateOne({ id: senderPocket.id }).set({
        balance: newTransaction,
      });
      await Pocket.updateOne({ id: receiverPocket.id }).set({
        balance: newReceiverBalance,
      });

      const transaction = await Transaction.create({
        fromPocket: senderPocket.id,
        toPocket: receiverPocket.id,
        amount,
      }).fetch();
      return res.ok({ transaction });
    } catch (error) {
      console.error(error);
      return res.error(
        RespCode.SYSTEM_ERROR.code,
        RespCode.SYSTEM_ERROR.message
      );
    }
  },
};
