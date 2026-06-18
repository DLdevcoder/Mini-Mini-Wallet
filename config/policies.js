module.exports.policies = {
  "*": false,
  CustomerController: {
    register: true,
    login: true,
  },
  PocketController: {
    getBalance: "isAuthenticated",
  },
  TransactionController: {
    transfer: "isAuthenticated",
    history: "isAuthenticated",
  },
};
