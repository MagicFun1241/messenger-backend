export interface ExternalSearchApiResponse {
  status: boolean,
  result: Array<ExternalSearchApiResult>,
}

export interface ExternalSearchApiResult {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  middlename: string;
}

export interface ExternalSearchItem {
  externalId: string;
  title: string;
}
