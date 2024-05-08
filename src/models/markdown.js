'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Markdown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { //để định danh các mối quan hệ ví dụ như 1 bác sĩ có thể khám nhiều bệnh nhân
      // define association here
      Markdown.belongsTo(models.Story, { foreignKey: 'storyId' })
      Markdown.belongsTo(models.Allcode, { foreignKey: 'chapId', as: 'chapKeyData' })
    }
  }
  Markdown.init({
    //muốn biết các kiểu dữ liệu trong sequelize thì gõ:   sequelize datatype
    contentHTML: DataTypes.TEXT('long'),
    contentMarkdown: DataTypes.TEXT('long'),
    storyId: DataTypes.INTEGER,
    chapId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Markdown',
  });
  return Markdown;
};