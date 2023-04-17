const { sequelize } = require("./db");
const { User } = require("./");
const users = require("./seedData");
const bcrypt = require("bcrypt");

const seed = async () => {
  await sequelize.sync({ force: true }); // recreate db

  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      user.password = await bcrypt.hash(user.password, 5);
      return user;
    })
  );

  await User.bulkCreate(hashedUsers);
};

module.exports = seed;
