// eslint-disable-next-line @typescript-eslint/no-require-imports
const articles = require("./articlesDatabase.json");

module.exports = {
  // async up(db) {
  //   await db.collection("articles").insertMany(articles);
  // },

  // migrate-mongo up <название-файла-миграции с расширением>
  async up(db) {
    await db.collection("articles").insertOne({
      id: 5,
      img: "/images/articles/article-3.jpeg",
      title: "ЗОЖ или ФАСТФУД. А вы на чьей стороне? Голосуем!",
      text: "Голосуйте за любимые категории...",
      createdAt: "2025-06-03",
    });
  },
  async down(db) {
    // Опционально: можно добавить откат миграции
    return db.collection("products").updateMany([]);
  }
};
