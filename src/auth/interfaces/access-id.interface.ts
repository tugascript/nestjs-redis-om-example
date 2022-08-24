export interface IAccessId {
  id: string;
}

export interface IAccessIdResponse extends IAccessId {
  iat: number;
  exp: number;
}
