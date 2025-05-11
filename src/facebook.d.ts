// facebook.d.ts
export {};

declare global {
  interface Window {
    FB: {
      init: (params: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: {
          authResponse: {
            accessToken: string;
            expiresIn: number;
            signedRequest: string;
            userID: string;
          };
          status: string;
        }) => void,
        options: { scope: string }
      ) => void;
      logout: (callback: () => void) => void;
      getLoginStatus: (
        callback: (response: {
          status: string;
          authResponse?: {
            accessToken: string;
            expiresIn: number;
            signedRequest: string;
            userID: string;
          };
        }) => void
      ) => void;
      api: (
        path: string,
        method: "GET" | "POST",
        params: any,
        callback: (response: any) => void
      ) => void;
      api: (
        path: string,
        params: any,
        callback: (response: any) => void
      ) => void;
      AppEvents: {
        logPageView: () => void;
      };
      XFBML: {
        parse: () => void;
      };
    };
    fbAsyncInit: () => void;
  }
}
