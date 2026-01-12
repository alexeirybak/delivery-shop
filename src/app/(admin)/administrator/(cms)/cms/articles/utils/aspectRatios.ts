import { AspectRatioOption } from "../types";

export const aspectRatios: AspectRatioOption[] = [
  { id: '1:1', label: 'Квадрат', icon: '□', desc: '1024×1024' },
  { id: '4:3', label: 'Горизонтальный', icon: '▭', desc: '1024×768' },
  { id: '3:4', label: 'Вертикальный', icon: '▯', desc: '768×1024' },
  { id: '16:9', label: 'Широкий', icon: '▬', desc: '1024×576' },
  { id: '9:16', label: 'Высокий', icon: '▮', desc: '576×1024' },
];