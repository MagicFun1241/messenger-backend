import { User } from '../../schemas/user.schema';

export interface ApiUser extends Omit<User, 'shortName'> {
  id: string;
  userName?: string;
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

// export interface User {
//   id: string;
//   isVerified?: true;
//   isPremium?: boolean;
//   type: ApiUserType;
//   firstName?: string;
//   lastName?: string;
//   username: string;
//   phoneNumber?: string;
//   hasVideoAvatar?: boolean;
//   photos?: string[];
//   botPlaceholder?: string;
//   canBeInvitedToGroup?: boolean;
//   commonChats?: {
//     ids: string[];
//     maxId: string;
//     isFullyLoaded: boolean;
//   };
//   fakeType?: ApiFakeType;
//   isAttachMenuBot?: boolean;
//
//   fullInfo?: ApiUserFullInfo;
// }
