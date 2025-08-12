// functions/index.js

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid"); // Used to generate unique filenames

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Get a reference to Firebase Storage
const storage = admin.storage();

/**
 * This is an "onCall" function, which is the recommended way to call a function
 * from a client app (like your React app). It automatically handles things like
 * CORS and authentication information.
 */
exports.uploadScreenshot = functions.https.onCall(async (data, context) => {
  // 1. Check if the user is authenticated.
  // This is a security measure to ensure only logged-in users can upload.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to upload a file."
    );
  }

  // 2. Get the base64 encoded image string from the React app.
  const base64File = data.file;
  if (!base64File) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a 'file' argument."
    );
  }

  // 3. Create a buffer from the base64 string.
  // This is the raw file data that can be uploaded.
  const fileBuffer = Buffer.from(base64File, "base64");

  // 4. Define the path and filename in Firebase Storage.
  // We'll store screenshots in a 'screenshots' folder.
  // The filename will be unique to prevent overwrites.
  const bucket = storage.bucket();
  const uniqueFilename = `${context.auth.uid}-${uuidv4()}.jpg`;
  const filePath = `screenshots/${uniqueFilename}`;
  const file = bucket.file(filePath);

  // 5. Upload the file buffer to Firebase Storage.
  try {
    await file.save(fileBuffer, {
      metadata: {
        contentType: "image/jpeg", // Assume JPEG, but you could pass this from the client
      },
    });

    // 6. Make the file publicly readable.
    await file.makePublic();

    // 7. Get the public URL.
    const downloadURL = file.publicUrl();

    // 8. Return the URL to the React app.
    console.log(`Successfully uploaded file and got URL: ${downloadURL}`);
    return { downloadURL: downloadURL };

  } catch (error) {
    console.error("Error uploading file:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while uploading the file."
    );
  }
});
