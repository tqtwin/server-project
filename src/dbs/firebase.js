const admin = require('firebase-admin');
const path = require('path');

// Import your Firebase service account key file
const serviceAccount = require(path.resolve(__dirname, 'serviceAccountKey.json')); // Adjust the path as needed

// Initialize Firebase Admin if it hasn't been initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'single-object-393509.appspot.com', // Replace with your Firebase project storage bucket
  });
}

// Export the necessary Firebase services for use in other parts of your app
const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
