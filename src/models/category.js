'use strict';
const {
    Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) { //để định danh các mối quan hệ ví dụ như 1 bác sĩ có thể khám nhiều bệnh nhân
            Category.hasMany(models.Story, { foreignKey: 'categoryId', as: 'categoryData' })
        }
    }
    Category.init({
        //muốn biết các kiểu dữ liệu trong sequelize thì gõ:   sequelize datatype
        categoryName: DataTypes.STRING

    }, {
        sequelize,
        modelName: 'Category',
    });
    return Category;
};