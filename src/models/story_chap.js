'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Story_Chap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // models.Story.belongsToMany(models.Allcode, { through: Story_Chap, key: 'keyMap' })
      // models.Allcode.belongsToMany(models.Story, { through: Story_Chap, key: 'id' })
      Story_Chap.belongsTo(models.Allcode, { foreignKey: 'chapId', targetKey: 'keyMap', as: 'chapTypeData' })
      Story_Chap.belongsTo(models.Story, { foreignKey: 'storyId', targetKey: 'id', as: 'storyChapData' })
    }
  }
  Story_Chap.init({
    storyId: DataTypes.INTEGER,
    chapId: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Story_Chap',
  });
  return Story_Chap;
};