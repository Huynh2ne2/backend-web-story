'use strict';
const {
    Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Story extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) { //để định danh các mối quan hệ ví dụ như 1 bác sĩ có thể khám nhiều bệnh nhân
            Story.belongsTo(models.Category, { foreignKey: 'categoryId', targetKey: 'id', as: 'categoryData' }),
            Story.belongsTo(models.User, { foreignKey: 'authorId', targetKey: 'id', as: 'authorData' })
            Story.hasOne(models.Markdown, { foreignKey: 'storyId' })
            Story.hasMany(models.Story_Chap, { foreignKey: 'storyId', targetKey: 'id', as: 'storyChapData' })
        }
    }

    Story.init({
        //muốn biết các kiểu dữ liệu trong sequelize thì gõ:   sequelize datatype
        categoryId: DataTypes.INTEGER,
        authorId: DataTypes.INTEGER,
        storyName: DataTypes.STRING,
        preview: DataTypes.TEXT('long'),
        img: DataTypes.STRING

    }, {
        sequelize,
        modelName: 'Story',
    });
    return Story;
};