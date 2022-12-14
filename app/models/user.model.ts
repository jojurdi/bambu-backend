module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    token: {
      type: Sequelize.STRING
    },
    tokenExpires: {
      type: Sequelize.DATE
    },
    status: {
      type: Sequelize.ENUM("inactive", "active"),
      defaultValue: "inactive"
     },
  });

  return User;
};
