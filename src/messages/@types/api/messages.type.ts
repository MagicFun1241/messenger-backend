export interface ApiChatContent {
  text?: string,
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
  // content: {
  //   text?: string;
  //   photo?: ApiPhoto;
  //   video?: ApiVideo;
  //   document?: ApiDocument;
  //   sticker?: ApiSticker;
  //   contact?: ApiContact;
  //   poll?: ApiPoll;
  // };
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
