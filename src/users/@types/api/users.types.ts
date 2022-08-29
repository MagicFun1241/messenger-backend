import {ExternalAccount, UserType} from '../../schemas/user.schema';

export interface ApiUser {
  id: string;
  type: UserType;
  firstName: string;
  lastName: string;
  middleName: string;
  userName: string | undefined;

  verified: boolean;

  externalAccounts: Array<ExternalAccount>;

  lastActivity?: Date;
}

export interface ApiUserStatus {
  type: (
    'userStatusEmpty' | 'userStatusLastMonth' | 'userStatusLastWeek' |
    'userStatusOffline' | 'userStatusOnline' | 'userStatusRecently'
  );
  lastActivity?: number;
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
