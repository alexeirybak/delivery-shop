const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/images/products/:path*",
        destination: "/api/uploads/products/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
      {
        source: "/blogCategories/:path*",
        destination: "/api/uploads/blog-categories/:path*",
      },
    ];
  },
};

module.exports = nextConfig;

// DBNAME=c500609_delivery_shop29_ru
// #DBNAME=delivery-shop
 
// # Сайт и БД на хостинге
// DB_CONNECTION_STRING=mongodb://c500609_delivery_shop29_ru:F.PqNu4z3-C-iTK@mongo7.c500609.h2/c500609_delivery_shop29_ru

// #Локальный хостинг для сайта + БД на хостинге
// #DB_CONNECTION_STRING=mongodb://c500609_delivery_shop29_ru:F.PqNu4z3-C-iTK@127.0.0.1:27020/c500609_delivery_shop29_ru

// #DB_CONNECTION_STRING="mongodb://localhost:27017"

// NEXT_PUBLIC_BASE_URL=https://delivery-shop29.ru

// ssh -L 127.0.0.1:27020:10.19.3.7:27017 -N c500609@h65.netangels.ru