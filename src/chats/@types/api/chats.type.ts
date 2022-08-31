import { ApiMessage } from '@/messages/@types/api/messages.type';

import { Types } from 'mongoose';
import { Chat, ChatMember } from '../../schemas/chats.schema';

export type ApiChatType = (
  'chatTypePrivate' | 'chatTypeSecret' |
  'chatTypeBasicGroup' | 'chatTypeSuperGroup' |
  'chatTypeChannel'
  );

export interface ApiTypingStatus {
  userId?: string;
  action: string;
  timestamp: number;
  emoji?: string;
}

export interface ApiChatMember extends Omit<ChatMember, 'userId'> {
  userId: string;
  joinedDate?: Date;
  inviterId?: Types.ObjectId;
  kickedByUserId?: Types.ObjectId;
}

export interface ApiChatFullInfo {
  about?: string;
  onlineCount?: number;
  members?: ApiChatMember[];
  // kickedMembers?: ApiChatMember[];
  // adminMembers?: ApiChatMember[];
  // canViewMembers?: boolean;
  // isPreHistoryHidden?: boolean;
  // inviteLink?: string;
  // groupCallId?: string;
  // slowMode?: {
  //   seconds: number;
  //   nextSendDate?: number;
  // };
  // migratedFrom?: {
  //   chatId: string;
  //   maxMessageId?: number;
  // };
  // linkedChatId?: string;
  // botCommands?: ApiBotCommand[];
  // enabledReactions?: string[];
  // sendAsId?: string;
  // canViewStatistics?: boolean;
  // recentRequesterIds?: string[];
  // requestsPending?: number;
  // statisticsDcId?: number;
  // stickerSet?: ApiStickerSet;
  // profilePhoto?: ApiPhoto;
}

export interface ApiChat extends Omit<Chat, 'members' | 'about'> {
  id: string;
  type: ApiChatType;

  hasUnreadMark?: boolean;
  lastMessage?: ApiMessage;
  lastReadOutboxMessageId?: number;
  lastReadInboxMessageId?: number;
  unreadCount?: number;
  unreadMentionsCount?: number;
  unreadReactionsCount?: number;
  isVerified?: boolean;
  isMuted?: boolean;
  isSignaturesShown?: boolean;
  hasPrivateLink?: boolean;
  accessHash?: string;
  isMin?: boolean;
  hasVideoAvatar?: boolean;
  avatarHash?: string;
  username?: string;
  membersCount?: number;
  joinDate?: number;
  isSupport?: boolean;
  photos?: string[];
  draftDate?: number;
  isProtected?: boolean;
  // fakeType?: ApiFakeType;

  // Calls
  isCallActive?: boolean;
  isCallNotEmpty?: boolean;

  // Current user permissions
  isNotJoined?: boolean;
  isListed?: boolean;
  isCreator?: boolean;
  isForbidden?: boolean; // Forbidden - can't send messages (user was kicked, for example)
  isRestricted?: boolean; // Restricted - can't access the chat (user was banned or chat is violating rules)
  // restrictionReason?: ApiRestrictionReason;
  // adminRights?: ApiChatAdminRights;
  // currentUserBannedRights?: ApiChatBannedRights;
  // defaultBannedRights?: ApiChatBannedRights;

  // Obtained from GetChatSettings
  // settings?: ApiChatSettings;

  // Obtained from GetFullChat / GetFullChannel
  fullInfo?: ApiChatFullInfo;
  // Obtained with UpdateUserTyping or UpdateChatUserTyping updates
  typingStatus?: ApiTypingStatus;

  // joinRequests?: ApiChatInviteImporter[];
  isJoinToSend?: boolean;
  isJoinRequest?: boolean;
  sendAsIds?: string[];

  unreadReactions?: number[];
  unreadMentions?: number[];
}
