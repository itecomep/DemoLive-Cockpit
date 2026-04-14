
export const environment = {
  production: false,
  appVersion: require('../../package.json').version + '-dev',
  origin: window.location.origin,
  angularPath: '',
  logoUrl: "https://ecomepmcvstorage.blob.core.windows.net/assets/EMCPL_logo.png",
  logoUrl_two: "https://ecomepmcvstorage.blob.core.windows.net/assets/PCE_logo.png",
  azureBlobStorageRoot: 'blob.core.windows.net',
  vapidPublicKey: 'BI-r9AexuoH0gPpDYuVc8oqhsBrW6ZMZ6Pt60dNmLomjqnWSMtnSOQ-HUSKYoZGsBrrssK2IHVBz9BTUGPutfC4',
  
  //// for local test with Local API
  apiPath: 'http://localhost:5054',

  ////  for local test with Azure Prod API
  // apiPath: 'https://myecomep.com/api',

  //// for staging
  
   //apiPath: 'https://myecomep.com/staging-api',
};
