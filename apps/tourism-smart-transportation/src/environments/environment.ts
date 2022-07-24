// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL:
    'https://tourism-smart-transportation-api.azurewebsites.net/api/v1.0/',
  mapbox: {
    accessToken:
      'pk.eyJ1IjoiZHRzYW5nZHRkIiwiYSI6ImNreHB4bXUydDd5YWQydXEzenYyM3FhbjUifQ.B0CxoZBSmclwbWpxuMAajQ',
  },
  gongmap: {
    api_URL: 'https://rsapi.goong.io/',
    api_key: 'A7PVIT65dOI918nq1eGhmuE0dOnc4YtdnlmIlAVq',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
