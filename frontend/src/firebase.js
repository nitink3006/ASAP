import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASuMwYD1RqZ2XwIDOrzO8tV2jmvkwmPK8",
  authDomain: "asap-7701d.firebaseapp.com",
  projectId: "asap-7701d",
  storageBucket: "asap-7701d.appspot.com",
  messagingSenderId: "1043442782156",
  appId: "1:1043442782156:web:04313d2ed65a030ffcd769",
};
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(firebaseApp);
auth.useDeviceLanguage();

// Export required Firebase functions
export { auth, RecaptchaVerifier, signInWithPhoneNumber };
export default firebaseApp;