const { sequelize } = require("./db");
const { User, Post } = require("./");
const users = require("./seedData");
const bcrypt = require("bcrypt");

const seed = async () => {
  await sequelize.sync({ force: true }); // recreate db

  // Create hashed password
  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      user.password = await bcrypt.hash(user.password, 5);
      return user;
    })
  );

  // Create posts for each user
  const promises = hashedUsers.map(async (user) => {
    const createdUser = await User.create(user);

    const posts = user.posts.map((post) => {
      post.user_id = createdUser.id;
      return post;
    });

    await Post.bulkCreate(posts);
  });

  await Promise.all(promises);
};

module.exports = seed;
