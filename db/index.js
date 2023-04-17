const { User } = require("./User");
const { Post } = require("./Post");
const { sequelize, Sequelize } = require("./db");

Post.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Post, { foreignKey: "user_id" });

module.exports = {
  User,
  Post,
  sequelize,
  Sequelize,
};
