// src/app/editor/page.tsx
'use client'

import { useState } from 'react'
import TipTapEditor from './TipTapEditor'

export default function EditorPage() {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')

  const handleSave = () => {
    console.log('Сохраняем контент:', {
      title,
      content
    })
    
    // Здесь отправка на сервер
    // await fetch('/api/posts', {
    //   method: 'POST',
    //   body: JSON.stringify({ title, content })
    // })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Редактор статей</h1>
      <p className="text-gray-600 mb-8">Создавайте и редактируйте статьи с изображениями</p>
      
      {/* Заголовок статьи */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Заголовок статьи
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="Введите заголовок..."
        />
      </div>

      {/* Редактор */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Содержание статьи
        </label>
        <TipTapEditor
          content={content}
          onChange={setContent}
          placeholder="Начните писать вашу статью здесь..."
          maxChars={10000}
        />
      </div>

      {/* Кнопки действий */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Сохранить статью
        </button>
        
        <button
          onClick={() => {
            setTitle('')
            setContent('')
          }}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Очистить
        </button>
        
        <button
          onClick={() => console.log('Предпросмотр:', { title, content })}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Предпросмотр
        </button>
      </div>

      {/* Предпросмотр (опционально) */}
      {content && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-4">Предпросмотр</h2>
          <div className="prose max-w-none">
            <h1 className="text-3xl font-bold mb-4">{title || 'Без заголовка'}</h1>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      )}
    </div>
  )
}