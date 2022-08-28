import { User } from '../../schemas/user.schema';

export interface ApiUser extends User {
  id: string;
  isSelf?: true;
  userName: string | undefined;
}

export interface ApiUserStatus {
  type: (
    'userStatusEmpty' | 'userStatusLastMonth' | 'userStatusLastWeek' |
    'userStatusOffline' | 'userStatusOnline' | 'userStatusRecently'
  );
  wasOnline?: number;
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
