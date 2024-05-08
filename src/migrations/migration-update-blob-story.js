module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('stories', 'img', {
                type: Sequelize.BLOB('long'),//tiny, long, medium //tiny nó sẽ giới hạn mb
                allowNull: true,
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('stories', 'img', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ])
    }
};