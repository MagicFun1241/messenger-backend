export interface ApiMessage {
  id: string;
  chatId: string;
  content: {
    text?: string;
  };
  date: number;
  isOutgoing: boolean;
  senderId?: string;
  replyToChatId?: string;
  replyToMessageId?: number;
  replyToTopMessageId?: number;
  sendingState?: 'messageSendingStatePending' | 'messageSendingStateFailed';
  // forwardInfo?: ApiMessageForwardInfo;
  isDeleting?: boolean;
  previousLocalId?: number;
  views?: number;
  forwards?: number;
  isEdited?: boolean;
  editDate?: number;
  isMentioned?: boolean;
  // isMediaUnread?: boolean;
  groupedId?: string;
  isInAlbum?: boolean;
  hasUnreadMention?: boolean;
  // inlineButtons?: ApiKeyboardButtons;
  // keyboardButtons?: ApiKeyboardButtons;
  keyboardPlaceholder?: string;
  isKeyboardSingleUse?: boolean;
  viaBotId?: string;
  // threadInfo?: ApiThreadInfo;
  adminTitle?: string;
  isScheduled?: boolean;
  shouldHideKeyboardButtons?: boolean;
  isFromScheduled?: boolean;
  seenByUserIds?: string[];
  isProtected?: boolean;
  transcriptionId?: string;
  isTranscriptionError?: boolean;
  reactors?: {
    nextOffset?: string;
    count: number;
    reactions: [];
  };
  reactions?: [];
}
