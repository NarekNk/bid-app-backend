"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Bid extends Model {
    static associate({ User, Job }) {
      this.belongsTo(User, { foreignKey: "userId", as: "user" });
      this.belongsTo(Job, { foreignKey: "jobId", as: "job" });
    }
  }

  Bid.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
        },
      },
    },
    {
      sequelize,
      modelName: "Bid",
    }
  );

  return Bid;
};
