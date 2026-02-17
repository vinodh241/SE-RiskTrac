// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  domain: "secureyesdev.com",
  umapiUrl: "http://10.0.1.32:6002", // DEV
  // umapiUrl: "http://localhost:46002", // DEV
  // umapiUrl: "http://10.0.1.6:8002", // QA
  // umapiUrl: "http://localhost:46002", // local API
  hostUrl: "https://serisktrac.secureyes.net",
  userManagementUrl: "https://serisktrac.secureyes.net/user-management",
  ormUrl: "https://serisktrac.secureyes.net/orm",
  bcmUrl: "https://serisktrac.secureyes.net/bcm",
  dmsUrl: "https://serisktrac.secureyes.net/dms",
  tppUrl: "https://serisktrac.secureyes.net/tpt"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
