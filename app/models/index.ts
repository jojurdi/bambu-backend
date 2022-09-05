const configModel = require("../config/db.config.ts");
 

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  configModel.DB,
  configModel.USER,
  configModel.PASSWORD,
  {
    host: configModel.HOST,
    dialect: configModel.dialect,
    operatorsAliases: 0,
    pool: {
      max: configModel.pool.max,
      min: configModel.pool.min,
      acquire: configModel.pool.acquire,
      idle: configModel.pool.idle
    }
  }
);

const dbModel = {
  ROLES:["user", "admin", "moderator"],
  Sequelize:Sequelize,
  sequelize:sequelize,
  user:require("../models/user.model.ts")(sequelize, Sequelize),
  role:require("../models/role.model.ts")(sequelize, Sequelize)
};
 

dbModel.role.belongsToMany(dbModel.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
dbModel.user.belongsToMany(dbModel.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
 
 
module.exports = dbModel;
