export interface ChatMessage {
  _id?: string;
  orderId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  userRole?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  unreadCount: number;
}

export interface ChatMessage {
  _id?: string;
  orderId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  userRole?: string;
}

export interface OrderChatModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}
