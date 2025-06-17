// eslint-disable-next-line @typescript-eslint/no-require-imports
const products = require("./productsDatabase.json");

module.exports = {
  async up(db) {
    await db.collection("products").insertMany(products);
  },

  //migrate-mongo up <название-файла-миграции с расширением>
  
  // async down(db) {
  //   // Опционально: можно добавить откат миграции
  //   return db.collection("products").updateMany([]);
  // }
};