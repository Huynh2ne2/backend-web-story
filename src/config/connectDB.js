const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('story_web', 'root', null, {
  host: 'localhost',//địa chỉ server
  dialect: 'mysql',
  logging: false
});

//Để dùng từ khóa await phải có async : đây chính là hàm bất đồng bộ
let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = connectDB;