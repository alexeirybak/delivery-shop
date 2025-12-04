'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { useState, useRef, useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Check,
  Loader2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code
} from 'lucide-react'

interface TipTapEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  maxChars?: number
}

export default function TipTapEditor({
  content = '',
  onChange,
  placeholder = 'Начните писать здесь...',
  maxChars = 5000
}: TipTapEditorProps) {
  const [uploading, setUploading] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4'
          }
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic'
          }
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-100 rounded p-3 font-mono text-sm'
          }
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-2'
        },
        inline: true,
        allowBase64: true
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-500 underline hover:text-blue-700 cursor-pointer'
        }
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxChars,
      }),
    ],
    content: isMounted ? content : '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[250px] p-2',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          event.preventDefault()
          const file = event.dataTransfer.files[0]
          if (file.type.startsWith('image/')) {
            handleImageUpload(file)
            return true
          }
        }
        return false
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items
        if (items) {
          for (const item of items) {
            if (item.type.startsWith('image/')) {
              event.preventDefault()
              const file = item.getAsFile()
              if (file) {
                handleImageUpload(file)
                return true
              }
            }
          }
        }
        return false
      }
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleImageUpload = async (file: File) => {
    if (!editor) return
    
    setUploading(true)
    
    try {
      // Создаем Object URL для предпросмотра
      const objectUrl = URL.createObjectURL(file)
      
      // Вставляем изображение
      editor.chain().focus().setImage({ 
        src: objectUrl,
        alt: file.name || 'Изображение',
        title: file.name || ''
      }).run()
      
      // Параллельно пытаемся загрузить на сервер
      try {
        const uploadedUrl = await uploadToServer(file)
        
        // Если загрузка на сервер успешна, заменяем Object URL на серверный URL
        if (uploadedUrl && uploadedUrl !== objectUrl) {
          replaceImageUrl(objectUrl, uploadedUrl)
        }
      } catch (uploadError) {
        console.warn('Ошибка загрузки на сервер, оставляем локальную версию:', uploadError)
      }
      
    } catch (error) {
      console.error('Ошибка при обработке изображения:', error)
    } finally {
      setUploading(false)
    }
  }

  const uploadToServer = async (file: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.url) {
        throw new Error('Сервер не вернул URL изображения')
      }
      
      return data.url
      
    } catch (error) {
      console.error('Ошибка при загрузке на сервер:', error)
      // Возвращаем Object URL как fallback
      return URL.createObjectURL(file)
    }
  }

  const replaceImageUrl = (oldUrl: string, newUrl: string) => {
    if (!editor) return
    
    const state = editor.state
    const tr = state.tr
    
    state.doc.descendants((node, pos) => {
      if (node.type.name === 'image' && node.attrs.src === oldUrl) {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          src: newUrl
        })
      }
    })
    
    if (tr.docChanged) {
      editor.view.dispatch(tr)
    }
  }

  const addLink = () => {
    if (!editor) return
    
    if (showLinkInput) {
      if (linkUrl) {
        editor.chain().focus().setLink({ href: linkUrl }).run()
      }
      setShowLinkInput(false)
      setLinkUrl('')
    } else {
      const previousUrl = editor.getAttributes('link').href
      setLinkUrl(previousUrl || '')
      setShowLinkInput(true)
    }
  }

  const removeLink = () => {
    if (!editor) return
    editor.chain().focus().unsetLink().run()
    setShowLinkInput(false)
  }

  const formatText = (action: 'bold' | 'italic' | 'underline') => {
    if (!editor) return
    
    switch (action) {
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        editor.chain().focus().toggleItalic().run()
        break
      case 'underline':
        editor.chain().focus().toggleUnderline().run()
        break
    }
  }

  if (!isMounted) {
    return (
      <div className="border rounded-lg p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="border-b bg-gray-50 p-3 flex flex-wrap gap-2 items-center">
        <div className="flex items-center border-r pr-3 mr-3 gap-1">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded transition ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-gray-800 shadow-inner' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
            title="Заголовок 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded transition ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-800 shadow-inner' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
            title="Заголовок 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded transition ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-gray-800 shadow-inner' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
            title="Заголовок 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center border-r pr-3 mr-3 gap-1">
          <button
            onClick={() => formatText('bold')}
            className={`p-2 rounded transition ${editor.isActive('bold') ? 'bg-gray-200 text-gray-800 shadow-inner' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
            title="Жирный (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText('italic')}
            className={`p-2 rounded transition ${editor.isActive('italic') ? 'bg-gray-200 text-gray-800 shadow-inner' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
            title="Курсив (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => formatText('underline')}
            className={`p-2 rounded transition ${editor.isActive('underline') ? 'bg-gray-200 text-gray-800 shadow-inner' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
            title="Подчеркивание (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center border-r pr-3 mr-3 gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded transition ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-800 shadow-inner' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
            title="Маркированный список"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded transition ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-800 shadow-inner' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
            title="Нумерованный список"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center border-r pr-3 mr-3 gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded transition ${editor.isActive('blockquote') ? 'bg-gray-200 text-gray-800 shadow-inner' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
            title="Цитата"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded transition ${editor.isActive('codeBlock') ? 'bg-gray-200 text-gray-800 shadow-inner' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
            title="Блок кода"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center border-r pr-3 mr-3 gap-1">
          <button
            onClick={addLink}
            className={`p-2 rounded transition ${editor.isActive('link') ? 'bg-blue-100 text-blue-600 shadow-inner' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
            title="Добавить ссылку (Ctrl+K)"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          {editor.isActive('link') && (
            <button
              onClick={removeLink}
              className="p-2 rounded transition hover:bg-red-50 text-red-500 hover:text-red-600"
              title="Удалить ссылку"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageUpload(file)
              e.target.value = ''
            }}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`p-2 rounded transition flex items-center gap-2 ${uploading ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
            title="Добавить изображение"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ImageIcon className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Изображение</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showLinkInput && (
        <div className="px-4 py-3 border-b bg-blue-50 flex items-center gap-2">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addLink()
              }
              if (e.key === 'Escape') {
                setShowLinkInput(false)
                setLinkUrl('')
              }
            }}
            autoFocus
          />
          <button
            onClick={addLink}
            className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            title="Добавить ссылку"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setShowLinkInput(false)
              setLinkUrl('')
            }}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
            title="Отмена"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="min-h-[350px] max-h-[600px] overflow-y-auto">
        <EditorContent 
          editor={editor} 
          className="min-h-[300px] p-4"
        />
      </div>

      <div className="border-t px-4 py-3 text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 gap-2">
        <div className="flex items-center gap-4">
          <span className="bg-white px-2 py-1 rounded border">
            {editor.storage.characterCount.characters()}/{maxChars} символов
          </span>
          <span className="bg-white px-2 py-1 rounded border">
            {editor.storage.characterCount.words()} слов
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="px-3 py-1 text-sm rounded border hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed disabled:border-gray-200 transition-colors"
          >
            Отменить (Ctrl+Z)
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="px-3 py-1 text-sm rounded border hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed disabled:border-gray-200 transition-colors"
          >
            Повторить (Ctrl+Y)
          </button>
        </div>
      </div>
    </div>
  )
}