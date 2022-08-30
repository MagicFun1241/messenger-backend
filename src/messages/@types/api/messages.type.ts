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
  content: {
    text?: string;
    // photo?: ApiPhoto;
    // video?: ApiVideo;
    // document?: ApiDocument;
    // sticker?: ApiSticker;
    // contact?: ApiContact;
    // poll?: ApiPoll;
  };
  senderId?: string;
  date: Date;
  isOutgoing: boolean;
  replyToChatId?: string;
  replyToMessageId?: number;
  replyToTopMessageId?: number;
  sendingState?: 'messageSendingStatePending' | 'messageSendingStateFailed';
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
