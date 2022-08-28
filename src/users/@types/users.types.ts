export interface UserItem {
  id: string;
  firstName: string;
  lastName: string;

  photo?: string;
  tags: Array<string>;

  dateOfBirth?: Date;

  policy?: any;
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
