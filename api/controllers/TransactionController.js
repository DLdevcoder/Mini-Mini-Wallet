const { ObjectId } = require("mongodb");
module.exports = {
  transfer: async function (req, res) {
    try {
      const { receiverPhone, amount } = req.body;
      const senderId = req.customerId;
      if (!receiverPhone || !amount || amount <= 0) {
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
      const db = Pocket.getDatastore().manager;
      const pocketCollection = db.collection(Pocket.tableName);
      const transactionCollection = db.collection(Transaction.tableName);
      const session = db.client.startSession();
      let transactionId = null;
      let newSenderBalance = null;
      try {
        await session.withTransaction(async () => {
          const senderUpdateResult = await pocketCollection.findOneAndUpdate(
            { owner: new ObjectId(senderId), balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            { session, returnDocument: "after" },
          );
          const updatedDoc =
            senderUpdateResult && senderUpdateResult.value !== undefined
              ? senderUpdateResult.value
              : senderUpdateResult;
          if (!updatedDoc) {
            throw new Error("INSUFFICIENT_BALANCE");
          }
          newSenderBalance = updatedDoc.balance;
          await pocketCollection.updateOne(
            { owner: new ObjectId(receiver.id) },
            { $inc: { balance: amount } },
            { session },
          );
          const newTx = await transactionCollection.insertOne(
            {
              fromPocket: updatedDoc._id,
              toPocket: new ObjectId(receiver.pocket),
              amount: amount,
              status: "SUCCESS",
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
            { session },
          );
          transactionId = newTx.insertedId;
        });
      } catch (error) {
        if (error.message === "INSUFFICIENT_BALANCE") {
          return res.error(
            RespCode.INSUFFICIENT_BALANCE.code,
            RespCode.INSUFFICIENT_BALANCE.message,
          );
        }
        throw error;
      } finally {
        await session.endSession();
      }

      return res.ok({
        transactionId: transactionId,
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
