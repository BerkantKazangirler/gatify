declare module "passport-linkedin-oauth2" {
  import { Strategy as OAuth2Strategy } from "passport-oauth2";

  export interface Profile {
    id: string;
    displayName?: string;
    name?: {
      givenName?: string;
      familyName?: string;
    };
    emails?: Array<{ value: string }>;
    photos?: Array<{ value: string }>;
    provider: string;
    _raw: string;
    _json: any;
  }

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    state?: boolean;
  }

  export class Strategy extends OAuth2Strategy {
    constructor(
      options: StrategyOptions,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void,
      ) => void,
    );
  }
}
