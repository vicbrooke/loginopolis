const { Sequelize, sequelize } = require("./db");

const Post = sequelize.define("post", {
  title: Sequelize.STRING,
  body: Sequelize.STRING,
});

module.exports = { Post };
