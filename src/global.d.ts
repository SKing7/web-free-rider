/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    _AMapSecurityConfig: {
      securityJsCode: string;
    };
    AMapLoader: {
      load: (options: { key: string }) => Promise<any>;
    };
    AMap: any;
  }

}

export { };