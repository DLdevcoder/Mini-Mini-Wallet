module.exports = {
  attributes: {
    fromPocket: {
      model: "pocket",
      required: true,
    },
    toPocket: {
      model: "pocket",
      required: true,
    },
    amount: {
      type: "number",
      required: true,
    },
    status: {
      type: "string",
      isIn: ["SUCCESS", "FAILED", "PENDING"],
      defaultsTo: "SUCCESS",
    },
  },
};
