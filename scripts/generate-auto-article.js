console.log('='.repeat(50));
console.log('🚀 ЗАПУСК ГЕНЕРАЦИИ СТАТЬИ');
console.log('='.repeat(50));

async function generateArticle() {
  try {
    console.log('📡 Отправляю запрос на localhost:3000...');
    
    const response = await fetch('http://localhost:3000/api/auto-generate/article', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📊 Статус ответа:', response.status);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ СТАТЬЯ СОЗДАНА!');
      console.log('='.repeat(30));
      console.log('📝 Название:', data.topic || data.name);
      console.log('🔗 Slug:', data.slug);
      console.log('🔢 ID:', data.numericId || data.articleId);
    } else {
      console.error('\n❌ ОШИБКА API:', data.error || data.message);
    }
    
  } catch (error) {
    console.error('\n💥 ОШИБКА СЕТИ:', error.message);
    console.log('\n💡 ПРОВЕРЬТЕ:');
    console.log('1. Запущен ли сервер? Запустите: npm run dev');
    console.log('2. Дождитесь полного запуска сервера');
    console.log('3. Откройте в браузере: http://localhost:3000');
  }
}

// Запускаем
generateArticle();