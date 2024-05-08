'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ChangePass extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) { //để định danh các mối quan hệ ví dụ như 1 bác sĩ có thể khám nhiều bệnh nhân
            ChangePass.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userData' })
        }
    }
    ChangePass.init({
        //muốn biết các kiểu dữ liệu trong sequelize thì gõ:   sequelize datatype
        statusId: DataTypes.STRING,//quy định là key của bảng allcode
        userId: DataTypes.INTEGER,
        token: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ChangePass',
    });
    return ChangePass;
};