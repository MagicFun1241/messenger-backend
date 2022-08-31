import { User } from '../../schemas/user.schema';

export interface ApiUser extends Partial<Pick<User, 'userName'>>, Omit<User, 'userName'> {
  id: string;
}

export interface ApiUserStatus {
  type: (
    'userStatusEmpty' | 'userStatusLastMonth' | 'userStatusLastWeek' |
    'userStatusOffline' | 'userStatusOnline' | 'userStatusRecently'
  );
  lastActivity?: Date;
  expires?: number;
}

export type ApiFakeType = 'fake' | 'scam';

export interface ApiUserFullInfo {
  isBlocked?: boolean;
  bio?: string;
  commonChatsCount?: number;
  pinnedMessageId?: number;
  // botInfo?: ApiBotInfo;
  profilePhoto?: string;
}

export type ApiUserSearch = Partial<Pick<ApiUser, 'id'>> & Omit<ApiUser, 'id'>;
