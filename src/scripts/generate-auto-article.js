// generator-runner.js
console.log('='.repeat(60));
console.log('🚀 ЗАПУСК ДОЛГОЙ ГЕНЕРАЦИИ (до 2 минут)');
console.log('='.repeat(60));
console.log('⚠️  Ожидайте...\n');

// Node.js 18+ имеет встроенный fetch
async function generate() {
  const start = Date.now();
  let dots = 0;
  
  // Показываем прогресс
  const progress = setInterval(() => {
    const elapsed = Math.floor((Date.now() - start) / 1000);
    process.stdout.write(`\r⏳ Генерация${'.'.repeat(dots % 4)} [${elapsed} сек]`);
    dots++;
  }, 500);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 минуты

    const response = await fetch('http://localhost:3000/api/auto-generate/article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    clearInterval(progress);
    
    console.log('\n\n📊 Статус:', response.status);
    
    const data = await response.json();
    const total = Math.floor((Date.now() - start) / 1000);
    
    console.log('📦 Ответ:', JSON.stringify(data, null, 2));
    console.log(`\n⏱️  Всего времени: ${total} секунд`);
    
    if (data.success) {
      console.log('\n✅ УСПЕХ!');
      console.log(`📝 Статья: ${data.data?.name || data.topic}`);
      console.log(`🖼️  Изображение: ${data.data?.hasImage ? '✅' : '❌'}`);
      if (data.data?.imageUrl) {
        console.log(`📸 URL: ${data.data.imageUrl}`);
      }
      
      if (data.data?.slug) {
        console.log(`🔗 Ссылка: http://localhost:3000/articles/${data.data.slug}`);
      }
    } else {
      console.error('\n❌ ОШИБКА:');
      console.log(data.error || data.message);
    }
    
  } catch (error) {
    clearInterval(progress);
    const total = Math.floor((Date.now() - start) / 1000);
    
    console.error(`\n\n💥 Ошибка через ${total} секунд:`);
    console.error(error.message);
    
    if (error.name === 'AbortError') {
      console.error('\n⏰ ТАЙМАУТ: Генерация заняла больше 3 минут!');
      console.error('Но возможно изображение все еще генерируется...');
      console.error('\n💡 Проверьте:');
      console.error('1. Консоль сервера на наличие ошибок');
      console.error('2. Базу данных на наличие новой статьи');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n🔌 ОШИБКА ПОДКЛЮЧЕНИЯ:');
      console.error('Сервер не запущен! Запустите: npm run dev');
    }
  }
}

// Запускаем
generate();