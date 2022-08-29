export interface ExternalSearchApiResponse {
  status: boolean,
  result: Array<ExternalSearchApiResult>,
}

export interface ExternalSearchApiResult {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
}

export interface SearchUserItem {
  id: string,
  title: string,
  label: string,
  avatar: string | undefined,
  verified: boolean,
  isLinked: boolean,
}
