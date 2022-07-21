const userSeeds = require("./userSeed.json");
const { User } = require("../models/index");
const db = require('../config/connection');
db.once("open", async () => {
  try {
    await User.deleteMany({});
    await User.create(userSeeds);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log("all done!");
  process.exit(0);
});
