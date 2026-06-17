module.exports.models = {
  schema: true,
  migrate: "alter",
  attributes: {
    createdAt: { type: "number", autoCreatedAt: true },
    updatedAt: { type: "number", autoUpdatedAt: true },
    id: { type: "string", columnName: "_id" },
  },
  dataEncryptionKeys: {
    default: "VnkS7UexN+yhxhPyk9B5Bxw4j1gjOozTsLItT9SCBfA=",
  },
  cascadeOnDestroy: true,
};
