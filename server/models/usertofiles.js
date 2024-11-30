'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserToFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserToFiles.init({
    userId: DataTypes.INTEGER,
    filename: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserToFiles',
    timestamps: true,
  });
  return UserToFiles;
};