'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('stories', {
            id: {
                allowNull: false,
                autoIncrement: true,//nó chỉ cho phép cách tăng dữ liệu theo kiểu interger thôi
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            categoryId: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            authorId: {
                allowNull: false,
                type: Sequelize.INTEGER
            },

            storyName: {
                type: Sequelize.STRING
            },
            preview: {
                type: Sequelize.TEXT('long')
            },
            img: {
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
        await queryInterface.dropTable('stories');
    }
};