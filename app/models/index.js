const dbConfig = require("../../config/db.config");

// Define database ORM (using sequelize for object relational mapping) for easy interfacing
// and modeling with database
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const UserModel = require("./users.model");
const DeviceModel = require("./devices.model");
const LocationModel = require("./locations.model");

console.log(UserModel);
db.Models = {
  User: UserModel.User.init(sequelize),
  Device: DeviceModel.Device.init(sequelize),
  Location: LocationModel.Location.init(sequelize)
}

// Initialize all associations if they exist
Object.values(db.Models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(db.Models));

module.exports = db;