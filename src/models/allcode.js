'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { //để định danh các mối quan hệ ví dụ như 1 bác sĩ có thể khám nhiều bệnh nhân
      // define association here
      // Allcode.hasMany(models.User, { foreignKey: 'positionId', as: 'positionData'})
      Allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' })
      Allcode.hasMany(models.Story_Chap, { foreignKey: 'chapId', as: 'chapTypeData' })
      Allcode.hasMany(models.Markdown, { foreignKey: 'chapId', as: 'chapKeyData' })

    }
  }
  Allcode.init({
    //muốn biết các kiểu dữ liệu trong sequelize thì gõ:   sequelize datatype
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Allcode',
  });
  return Allcode;
};