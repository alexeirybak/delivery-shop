export interface ChatMessage {
  _id?: string;
  orderId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isAdmin: boolean;
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
  isAdmin: boolean;
  userRole?: string;
}

export interface OrderChatModalProps {
  orderId: string;
  orderNumber: string;
  userName: string; 
  isOpen: boolean;
  onClose: () => void;
  currentUserRole?: string;
  currentUserName?: string; 
}