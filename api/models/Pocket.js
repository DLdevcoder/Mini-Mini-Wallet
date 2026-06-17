module.exports = {
  attributes: {
    balance: {
      type: "number",
      defaultsTo: 1000000,
    },
    owner: {
      model: "customer",
      required: true,
      unique: true,
    },
  },
};
