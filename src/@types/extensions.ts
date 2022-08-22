export interface ServiceInstance {
  dependencies: Array<string>;
  run: () => void;
}

export interface AuthenticationServiceCallbackContext {
  body: any;
  database: {
    users: {
      findByExternalId(q): Promise<any>;
      findByExternalId(q, cb): void;
    },
    externalTokens: {
      insert(doc, cb: (d: any) => void): void;
      insert(doc): Promise<any>;
    };
  };
}

export type AuthenticationServiceCallback = (ctx: AuthenticationServiceCallbackContext) => any;
