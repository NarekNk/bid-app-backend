"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: "userId", as: "user" });
    }
  }

  Job.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        description: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title should not be empty.",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        description: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Description should not be empty.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Job",
    }
  );

  return Job;
};
