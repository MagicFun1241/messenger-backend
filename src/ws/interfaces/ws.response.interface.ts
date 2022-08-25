export interface WsResponse<T = unknown> {
  event: string;
  data: WsResponseData<T>;
}

interface WsResponseData<T = unknown> {
  status: boolean;
  data: T;
}
