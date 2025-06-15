// eslint-disable-next-line @typescript-eslint/no-require-imports
const products = require("./productsDatabase.json");

module.exports = {
  async up(db) {
    await db.collection("products").insertMany(products);
  },

  // async down(db) {},
};
