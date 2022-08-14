export interface WsFormatExceptionInterface {
  event: string,
  code: number,
  message: WsFormatExceptionErrorsInterface[] | string,
  isCloseWs: boolean,
}

export interface WsFormatExceptionErrorsInterface {
  key: string,
  values: Array<string>,
}
