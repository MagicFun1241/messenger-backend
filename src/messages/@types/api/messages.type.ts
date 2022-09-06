interface PhotoAttachment {
  type: 'photo',
  file: string;
}

interface DocumentAttachment {
  type: 'document',
  file: string;
}

export type Attachment = PhotoAttachment | DocumentAttachment;

export interface ApiChatContent {
  text?: string,
  attachments?: Array<Attachment>;
}

export interface ApiMessageForwardInfo {
  date: Date;
  isChannelPost: boolean;
  channelPostId?: number;
  isLinkedChannelPost?: boolean;
  fromChatId?: string;
  senderUserId?: string;
  fromMessageId?: string;
  hiddenUserName?: string;
  adminTitle?: string;
}

export interface ApiMessage {
  id: string;
  chatId: string;
  senderId?: string;
  replyToChatId?: string;
  replyToMessageId?: string;
  replyToTopMessageId?: string;
  date: Date;
  isOutgoing: boolean;
  sendingState?: 'messageSendingStatePending' | 'messageSendingStateFailed';
  content: ApiChatContent;
  forwardInfo?: ApiMessageForwardInfo;
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
