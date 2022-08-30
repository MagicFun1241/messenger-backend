export interface UserItem {
  id: string;
  firstName: string;
  lastName: string;

  photo?: string;
  tags: Array<string>;

  dateOfBirth?: Date;

  policy?: any;
}
