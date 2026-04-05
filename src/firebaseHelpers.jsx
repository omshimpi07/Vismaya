import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase, ref, set, get, child } from 'firebase/database'; // For Realtime Database
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase'; // Assuming Firebase setup is correct

// Register user function (Realtime Database)
export const registerUser = async (email, password, name, age, contact, address) => {
  try {
    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a user document in Realtime Database with additional information
    const userRef = ref(db, 'users/' + user.uid);
    await set(userRef, {
      name,
      email,
      age,
      contact,
      address,
      photoURL: "", // Placeholder for profile picture
    });

    console.log('User registered successfully:', user);
  } catch (error) {
    console.error('Error registering user:', error);
    throw error; // Rethrow error for handling in the component
  }
};

// Sign in user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// Sign out user
export const logOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

// Fetch user data from Realtime Database
export const fetchUserData = async (uid) => {
  try {
    const userRef = ref(db, 'users/' + uid);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.error("User data not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Upload profile picture to Firebase Storage and update Realtime Database
export const uploadProfilePicture = async (file, userId) => {
  try {
    const storageReference = storageRef(storage, `profilePictures/${userId}`);
    await uploadBytes(storageReference, file);
    const downloadURL = await getDownloadURL(storageReference);

    // Update Realtime Database with the download URL
    const userRef = ref(db, 'users/' + userId);
    await set(userRef, { photoURL: downloadURL }, { merge: true });

    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

// Get a user's profile picture URL from Realtime Database
export const getProfilePicture = async (userId) => {
  try {
    const userRef = ref(db, 'users/' + userId);
    const snapshot = await get(userRef);
    if (snapshot.exists() && snapshot.val().photoURL) {
      return snapshot.val().photoURL;
    } else {
      return `https://api.dicebear.com/6.x/initials/svg?seed=User`; // Default profile picture
    }
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    throw error;
  }
};
export const setUserData = (uid, name, email, contacts) => {
  const db = getDatabase();
  set(ref(db, 'users/' + uid), {
    name,
    email,
    contacts,
  });
};
