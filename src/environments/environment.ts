// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  API: 'http://localhost:8081/api/',
  SOCKET: 'http://localhost:8081/',
  STRIPE_KEY: 'pk_test_51GvL7NFBexKqC7NAlOGIRUczJOVrLvMJKHUDoauUsIyOTkDOiCGMBiC4Xpn0VdMoeWm0NyvjWGaRtBPh5GWLsNl600J0K4pDOQ',
  // API: 'https://businesscloud-api.herokuapp.com/api/',
  // SOCKET: 'https://businesscloud-api.herokuapp.com/',
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
