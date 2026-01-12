import { 
  Image as ImageIcon, 
  Download, 
  Loader2, 
  Check, 
  X, 
  Palette,
  Sparkles,
  Camera,
  Brush,
  Zap,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Clock,
  PlayCircle
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ImageAIMenuProps {
  editor: any;
}

interface GenerationStatus {
  status: 'idle' | 'generating' | 'processing' | 'completed' | 'failed';
  operationId?: string;
  imageUrl?: string;
  error?: string;
}

export const ImageAIMenu = ({ editor }: ImageAIMenuProps) => {
  const [showModal, setShowModal] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generation, setGeneration] = useState<GenerationStatus>({ status: 'idle' });
  const [selectedAspect, setSelectedAspect] = useState<'1:1' | '4:3' | '3:4' | '16:9' | '9:16'>('1:1');
  const [selectedStyle, setSelectedStyle] = useState<'default' | 'realistic' | 'artistic' | 'sketch' | 'cartoon'>('default');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [apiInfo, setApiInfo] = useState<string>('');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Таймер для отслеживания времени
  useEffect(() => {
    if (generation.status === 'generating' || generation.status === 'processing') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedSeconds(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [generation.status]);

  // Опрос статуса генерации
  useEffect(() => {
    if (generation.status === 'processing' && generation.operationId) {
      const pollStatus = async () => {
        try {
          console.log('Polling status for operation:', generation.operationId);
          
          const response = await fetch(`/api/yandex-image?operationId=${generation.operationId}`);
          const data = await response.json();
          
          console.log('Polling response:', data);

          if (data.done) {
            // Останавливаем опрос
            if (pollingInterval) {
              clearInterval(pollingInterval);
              setPollingInterval(null);
            }
            
            if (data.imageUrl) {
              setGeneration({
                status: 'completed',
                operationId: generation.operationId,
                imageUrl: data.imageUrl
              });
              console.log('Image generation completed:', data.imageUrl);
            } else if (data.error) {
              setGeneration({
                status: 'failed',
                operationId: generation.operationId,
                error: data.error
              });
              console.error('Image generation failed:', data.error);
            }
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      };

      // Первый запрос сразу
      pollStatus();
      
      // Затем каждые 3 секунды
      const interval = setInterval(pollStatus, 3000);
      setPollingInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [generation.status, generation.operationId]);

  // Закрытие модального окна
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert('Введите описание изображения');
      return;
    }

    setGeneration({ 
      status: 'generating',
    });
    setElapsedSeconds(0);
    setApiInfo('');

    try {
      console.log('Starting image generation with YandexART:', { prompt, selectedAspect, selectedStyle });

      const response = await fetch('/api/yandex-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          aspect_ratio: selectedAspect,
          style: selectedStyle
        })
      });

      const data = await response.json();
      console.log('YandexART response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.details || data.error || `HTTP ${response.status}: Ошибка генерации`);
      }

      if (data.operationId) {
        // Переходим в режим опроса статуса
        setGeneration({
          status: 'processing',
          operationId: data.operationId,
        });
        
        setApiInfo(`✅ Запрос принят YandexART. Operation ID: ${data.operationId.substring(0, 20)}...`);
      } else {
        throw new Error('Не получен ID операции от YandexART');
      }

    } catch (err) {
      console.error('YandexART generation error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setGeneration({
        status: 'failed',
        error: errorMsg
      });
      
      alert(`Ошибка YandexART: ${errorMsg}`);
    }
  };

  const testAPI = async () => {
    try {
      setGeneration({ status: 'generating' });
      setApiInfo('Проверка подключения к YandexART API...');
      
      const response = await fetch('/api/yandex-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Тестовая генерация: красная панда',
          aspect_ratio: '1:1',
          style: 'default'
        })
      });

      const data = await response.json();
      console.log('YandexART test response:', data);

      if (data.success && data.operationId) {
        setApiInfo(`✅ YandexART API работает! Operation ID: ${data.operationId}\n\nМодель: ${data.model}`);
        alert(`✅ YandexART API подключен!\n\nID операции: ${data.operationId}\n\nМодель: ${data.model}`);
      } else {
        setApiInfo(`❌ Ошибка YandexART: ${data.details || data.error || 'Неизвестная ошибка'}`);
        alert(`❌ Ошибка YandexART API:\n\n${data.details || data.error || 'Неизвестная ошибка'}`);
      }
      
    } catch (err) {
      console.error('YandexART API test error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setApiInfo(`❌ Ошибка подключения к YandexART: ${errorMsg}`);
      alert(`❌ Ошибка подключения к YandexART:\n\n${errorMsg}`);
    } finally {
      setGeneration({ status: 'idle' });
    }
  };

  const downloadImage = () => {
    if (!generation.imageUrl) return;
    
    const link = document.createElement('a');
    link.href = generation.imageUrl;
    link.download = `yandex-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const insertImageToEditor = () => {
    if (generation.imageUrl && editor) {
      editor.chain().focus().setImage({ 
        src: generation.imageUrl, 
        alt: prompt,
        title: `Сгенерировано YandexART: ${prompt}`
      }).run();
      closeModal();
    }
  };

  const closeModal = () => {
    // Останавливаем таймеры и интервалы
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setShowModal(false);
    setPrompt("");
    setGeneration({ status: 'idle' });
    setApiInfo('');
    setElapsedSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const aspectRatios = [
    { id: '1:1', label: 'Квадрат', icon: '□', desc: '1024×1024' },
    { id: '4:3', label: 'Горизонтальный', icon: '▭', desc: '1024×768' },
    { id: '3:4', label: 'Вертикальный', icon: '▯', desc: '768×1024' },
    { id: '16:9', label: 'Широкий', icon: '▬', desc: '1024×576' },
    { id: '9:16', label: 'Высокий', icon: '▮', desc: '576×1024' },
  ];

  const styles = [
    { id: 'default', label: 'Авто', icon: <Sparkles className="w-4 h-4" />, color: 'text-gray-600' },
    { id: 'realistic', label: 'Реализм', icon: <Camera className="w-4 h-4" />, color: 'text-blue-600' },
    { id: 'artistic', label: 'Арт', icon: <Brush className="w-4 h-4" />, color: 'text-purple-600' },
    { id: 'sketch', label: 'Эскиз', icon: <Zap className="w-4 h-4" />, color: 'text-orange-600' },
    { id: 'cartoon', label: 'Мульт', icon: <Palette className="w-4 h-4" />, color: 'text-green-600' },
  ];

  return (
    <>
      {/* Кнопка в тулбаре */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          disabled={generation.status === 'generating' || generation.status === 'processing'}
          className={`p-2 rounded duration-300 cursor-pointer ${
            generation.status === 'generating' || generation.status === 'processing'
              ? 'bg-blue-100 text-blue-600' 
              : showModal 
                ? 'bg-blue-100 text-blue-600' 
                : 'hover:bg-gray-200 text-gray-600'
          }`}
          title="Генерация изображений с помощью YandexART"
        >
          {generation.status === 'generating' || generation.status === 'processing' ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </button>

        {(generation.status === 'generating' || generation.status === 'processing') && (
          <span className="text-xs text-blue-600 animate-pulse">
            {formatTime(elapsedSeconds)}
          </span>
        )}
        
        {generation.status === 'completed' && (
          <span className="text-xs text-green-600">✓</span>
        )}
        
        {generation.status === 'failed' && (
          <span className="text-xs text-red-600">✗</span>
        )}
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4">
          <div 
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-red-50 to-yellow-50">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Palette className="w-7 h-7 text-red-600" />
                  <span>Генератор изображений</span>
                  <span className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                    🇷🇺 YandexART
                  </span>
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Российская нейросеть для создания изображений по текстовому описанию
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={testAPI}
                  disabled={generation.status === 'generating' || generation.status === 'processing'}
                  className="text-sm px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                >
                  <AlertCircle className="w-4 h-4" />
                  Тест API
                </button>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white rounded-lg transition-colors ml-2"
                  disabled={generation.status === 'generating' || generation.status === 'processing'}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Основной контент */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Информация о подключении */}
              {apiInfo && (
                <div className={`mb-4 p-3 rounded-lg border ${
                  apiInfo.includes('✅') ? 'bg-green-50 border-green-200 text-green-800' :
                  apiInfo.includes('❌') ? 'bg-red-50 border-red-200 text-red-800' :
                  'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                  <div className="text-sm whitespace-pre-line">{apiInfo}</div>
                </div>
              )}

              {/* Промпт */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Что вы хотите увидеть?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Детально опишите изображение..."
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  rows={3}
                  disabled={generation.status === 'generating' || generation.status === 'processing'}
                />
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-1">Примеры запросов:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Закат над горами, фотореалистично</li>
                    <li>• Кот в космическом костюме, мультяшный стиль</li>
                    <li>• Портрет девушки в стиле импрессионизма</li>
                  </ul>
                </div>
              </div>

              {/* Настройки */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Соотношение сторон */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Формат изображения:
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio.id}
                        onClick={() => setSelectedAspect(ratio.id as any)}
                        disabled={generation.status === 'generating' || generation.status === 'processing'}
                        className={`p-3 rounded-lg border flex flex-col items-center ${
                          selectedAspect === ratio.id
                            ? 'bg-red-50 border-red-300 text-red-700'
                            : 'hover:bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                        title={`${ratio.label} (${ratio.desc})`}
                      >
                        <span className="text-xl mb-1">{ratio.icon}</span>
                        <span className="text-xs">{ratio.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Стиль */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Стиль изображения:
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id as any)}
                        disabled={generation.status === 'generating' || generation.status === 'processing'}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-1 ${
                          selectedStyle === style.id
                            ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                            : 'hover:bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                        title={style.label}
                      >
                        <span className={style.color}>{style.icon}</span>
                        <span className="text-xs">{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Статус генерации */}
              {(generation.status === 'generating' || generation.status === 'processing') && (
                <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="relative">
                      <RefreshCw className="w-12 h-12 text-yellow-600 animate-spin" />
                      <PlayCircle className="w-6 h-6 text-yellow-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-yellow-800">
                        {generation.status === 'generating' ? 'Запуск YandexART...' : 'YandexART генерирует...'}
                      </p>
                      <p className="text-sm text-yellow-600 mt-1 flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" />
                        Прошло: {formatTime(elapsedSeconds)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
                        style={{ width: `${Math.min(elapsedSeconds * 3, 100)}%` }}
                      />
                    </div>
                    
                    {generation.operationId && (
                      <div className="text-xs text-yellow-600 text-center mt-2">
                        ID операции: {generation.operationId.substring(0, 30)}...
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 text-center">
                      YandexART создает изображение. Это может занять до минуты.
                    </p>
                  </div>
                </div>
              )}

              {/* Результат */}
              {generation.status === 'completed' && generation.imageUrl && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Результат:</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={downloadImage}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Скачать
                      </button>
                      <a
                        href={generation.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Открыть
                      </a>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-300 p-4">
                    <img 
                      src={generation.imageUrl} 
                      alt="Сгенерированное изображение YandexART"
                      className="w-full h-auto max-h-[400px] object-contain mx-auto rounded-lg"
                      onError={(e) => {
                        console.error('Image load error');
                        e.currentTarget.src = `https://via.placeholder.com/1024x1024?text=Ошибка+загрузки+YandexART`;
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Стиль: {styles.find(s => s.id === selectedStyle)?.label} | 
                    Формат: {selectedAspect} | 
                    Время генерации: {formatTime(elapsedSeconds)}
                  </p>
                </div>
              )}

              {/* Ошибка */}
              {generation.status === 'failed' && generation.error && (
                <div className="mb-6 p-6 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-12 h-12 text-red-600" />
                    <div>
                      <p className="text-xl font-bold text-red-800">Ошибка YandexART</p>
                      <p className="text-sm text-red-600 mt-1">{generation.error}</p>
                      <p className="text-xs text-red-500 mt-2">
                        Проверьте настройки API и повторите попытку
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Футер */}
            <div className="border-t p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {generation.status === 'idle' && 'Введите описание для генерации'}
                  {generation.status === 'generating' && 'Запуск YandexART...'}
                  {generation.status === 'processing' && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>YandexART: {formatTime(elapsedSeconds)}</span>
                    </div>
                  )}
                  {generation.status === 'completed' && (
                    <span className="flex items-center gap-2 text-green-600">
                      <Check className="w-4 h-4" />
                      Готово!
                    </span>
                  )}
                  {generation.status === 'failed' && (
                    <span className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      Ошибка
                    </span>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    disabled={generation.status === 'generating' || generation.status === 'processing'}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
                  >
                    {generation.status === 'completed' ? 'Закрыть' : 'Отмена'}
                  </button>
                  
                  {generation.status === 'completed' ? (
                    <button
                      onClick={insertImageToEditor}
                      className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-lg hover:from-red-700 hover:to-yellow-700 font-medium flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Вставить в документ
                    </button>
                  ) : (
                    <button
                      onClick={generateImage}
                      disabled={
                        generation.status === 'generating' || 
                        generation.status === 'processing' || 
                        !prompt.trim()
                      }
                      className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-lg hover:from-red-700 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                    >
                      {generation.status === 'generating' || generation.status === 'processing' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          YandexART работает...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Создать изображение
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// "use client";

// import { useState, useEffect } from "react";
// import { ImageIcon, RefreshCw } from "lucide-react";
// import { GenerationStatus, TipTapMenuProps } from "../../../../types";
// import { ImageAIMenuModal } from "./ImageAIMenuModal";

// export const ImageAIMenu = ({ editor }: TipTapMenuProps) => {
//   const [showModal, setShowModal] = useState(false);
//   const [generation, setGeneration] = useState<GenerationStatus>({
//     status: "idle",
//   });
//   const [elapsedSeconds, setElapsedSeconds] = useState(0);

//   // Опрос статуса генерации
//   useEffect(() => {
//     if (generation.status === "processing" && generation.operationId) {
//       const pollStatus = async () => {
//         try {
//           const response = await fetch(
//             `/api/yandex-image?operationId=${generation.operationId}`
//           );
//           const data = await response.json();

//           if (data.done) {
//             if (data.imageUrl) {
//               setGeneration({
//                 status: "completed",
//                 operationId: generation.operationId,
//                 imageUrl: data.imageUrl,
//               });
//             } else if (data.error) {
//               setGeneration({
//                 status: "failed",
//                 operationId: generation.operationId,
//                 error: data.error,
//               });
//             }
//           }
//         } catch (error) {
//           console.error("Polling error:", error);
//         }
//       };

//       const interval = setInterval(pollStatus, 3000);
//       return () => clearInterval(interval);
//     }
//   }, [generation.status, generation.operationId]);

//   // Таймер
//   useEffect(() => {
//     if (
//       generation.status === "generating" ||
//       generation.status === "processing"
//     ) {
//       const timer = setInterval(() => {
//         setElapsedSeconds((prev) => prev + 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     } else {
//       setElapsedSeconds(0);
//     }
//   }, [generation.status]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <>
//       {/* Кнопка в тулбаре */}
//       <div className="flex items-center gap-1">
//         <button
//           type="button"
//           onClick={() => setShowModal(true)}
//           disabled={
//             generation.status === "generating" ||
//             generation.status === "processing"
//           }
//           className={`p-2 rounded duration-300 cursor-pointer ${
//             generation.status === "generating" ||
//             generation.status === "processing"
//               ? "bg-blue-100 text-blue-600"
//               : showModal
//                 ? "bg-blue-100 text-blue-600"
//                 : "hover:bg-gray-200 text-gray-600"
//           }`}
//           title="Генерация изображений с помощью YandexART"
//         >
//           {generation.status === "generating" ||
//           generation.status === "processing" ? (
//             <RefreshCw className="w-4 h-4 animate-spin" />
//           ) : (
//             <ImageIcon className="w-4 h-4" />
//           )}
//         </button>

//         {(generation.status === "generating" ||
//           generation.status === "processing") && (
//           <span className="text-xs text-blue-600 animate-pulse">
//             {formatTime(elapsedSeconds)}
//           </span>
//         )}

//         {generation.status === "completed" && (
//           <span className="text-xs text-green-600">✓</span>
//         )}

//         {generation.status === "failed" && (
//           <span className="text-xs text-red-600">✗</span>
//         )}
//       </div>

//       {/* Модальное окно */}
//       <ImageAIMenuModal
//         isOpen={showModal}
//         onCloseAction={() => setShowModal(false)}
//         editor={editor}
//       />
//     </>
//   );
// };
