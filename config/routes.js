module.exports.routes = {
  "POST /api/register": "CustomerController.register",
  "POST /api/login": "CustomerController.login",
  "POST /api/pocket/balance": "PocketController.getBalance",
  "POST /api/transaction/transfer": "TransactionController.transfer",
};
