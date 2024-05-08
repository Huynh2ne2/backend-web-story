'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('changepasses', {
            // statusId: DataTypes.STRING,//quy định là key của bảng allcode
            // doctorId: DataTypes.INTEGER,
            // patientId: DataTypes.INTEGER,
            // date: DataTypes.DATE,//là kiểu Timestamp
            // timeType: DataTypes.STRING   

            id: {
                allowNull: false,
                autoIncrement: true,//nó chỉ cho phép cách tăng dữ liệu theo kiểu interger thôi
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            statusId: {
                type: Sequelize.STRING
            },
            userId: {
                type: Sequelize.INTEGER
            },
            token: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('changepasses');
    }
};