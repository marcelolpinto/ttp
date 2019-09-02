import { google } from 'googleapis';

const googleConfig = {
  clientId: '478083504438-at2j4a6ak6i1c2bgecrieh8bot3c8708.apps.googleusercontent.com', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: 'drheCepCILyHct2aAPdHH9nI', // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: 'http://localhost:3000/google-auth' // this must match your google api settings
};

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

console.log('aui')
createConnection();