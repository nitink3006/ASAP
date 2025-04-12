import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDgACK3EA6Uz22oETK_ynpcUBYovS2kNxU",
  authDomain: "asap-cba08.firebaseapp.com",
  projectId: "asap-cba08",
  storageBucket: "asap-cba08.firebasestorage.app",
  messagingSenderId: "13050158424",
  appId: "1:13050158424:web:8ca19bf8f8f74d595b592d",
  measurementId: "G-MYL3ES0F53"
};
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(firebaseApp);
auth.useDeviceLanguage();

// Export required Firebase functions
export { auth, RecaptchaVerifier, signInWithPhoneNumber };
export default firebaseApp;



// type: "service_account",
// project_id: "asap-cba08",
// private_key_id: "5caee1cdeae683ff4087fdab5982f1b7dd6e22d7",
// private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDJ5QnOj77PoWhW\nIxrU1gMrr8E0Rj+a2CX2Lc6b8/7Y3UY05ZafNpLubqDn1nfMOs9Lm2UD7ga84vQw\nT/dMdAFKl0PVl95G6EZPDKclpVZQbNtHlqx+YkF4XNDHKprN8cdeXAN8qKffoFdC\nEqmsUuPbWIUkwNjawk7+Nfc79rOeitJhJQPGYDFqRM+uipQonjLNe9duEWZ5wISY\nLBgMKCbNCo8/Z9I96Zu6jEbTo6VPh/UQhyYkIUEOm2GQ3xye+OXPzshUJhJ0/x+r\nXv0Pub5pt4fiJnMF7UVGcn4VYtdxdhsZtcErAuJad9aDtzXBXzFBX2AwdGG2q1/Y\nQ0OjC+vRAgMBAAECggEAIRUx5TIyzy0gvrSj6epjvJ3hJ+K2+3Wdytg4ud9ijEC+\nB17zroUv0Hg6T6MaIFIms7nz9I/ldMAvyVbhLBr6NzHQQMjQ+IeJNdzZ6tZL7YPY\n7sMm4tLQ7Zsv7uLxWPvccn7bZ2rvjzpj8gTC3uT6R3Aa6SncnwQmE4veRmonhrvo\nKFqIoSRO1MCLomYqcs10RzeAy6YbYWPh3lOUw+8+AfwfaUGLBXouv7WU9+NdXp5k\nTQVdQCbGu/B39+ugXBGu5Ac7+5zvZV6J16KtsU50KNe65N9zBPmnMoIAZE7lJuF+\nFgE2IxvfvLSMTzsVyFvsiNnQuI5rHOLFNb9GPprD7QKBgQDtNzJovqCpD7I/Rt3S\nhEMcZkeXge0Zk/uR+C6+3HB7EAiC65QbaBve5CCCaB6N7WsPVxsR1p95dKWuQ3aL\nW9+zOYYTFId9DHSstJofKegX2wb1ODLti6Lben4cPdlHvTT7KlbJ85y0LHExw2oC\nqYgIK5+XsynYjB8gpSrZdbhz9wKBgQDZ4dH4prQpkjPGCuaXhTmqCrdui+68I6W8\nuLMEqstvKN+XoTUWVMMHYfZ3aTMa6Waz6omDYI2bMoU1ngoW4h997FBJ0A7Wkzyi\nu1n3wz/2n5HmM/F5T12ZWbFTyzTB46ExrskpgfcY7Q9Fzu3MVtoqqeVpCCVtaT7X\naz85SZkcdwKBgQDP23fuVGtO+JQF4kDpAEAWGIFO/ugVa5gatc+wKlTdYJU0stxa\nj4Usb9UUr8tmLc2L6ZWssdWXhWDQLAkp391KnHMhMPHv3wQ1eSM7f2sBzEhyg0YM\n5DhV/SWX9ZH4zJAqLVVTLIX5Up/1LPgtUQQDtMXpFXLrbwyvfErptb9kzQKBgEFc\naOy6tZky7q0eYAZcROwpwtU6zSdLWlC+55Ui11xFWq3WAmLskoUIcjNoL5iHI/Qd\nC5uJv3ErOqLXAhfTRbc0yPEbpRfhm3MF2Ptmay3EuLPiKTJHCMEUEwocD3uKmbSZ\nxmbZQhMMKmS6qsN92nyp8tQLSY8E34En/xNkbLYJAoGBAJXKxUynBD0R7yvhBOKy\nQYo7e+rTZcTIhvnceWGxGWt8PXQEA5Lylq+lI2Ny3ZOM5U9ntEzNFKxXD5NtYL2b\nem/F1DCIx/VGls/HLI2+2GMT6+wiKDUHna5jiQmyBvRKiGm30N9qpVnRatxDL+1M\nGdQTAfBB+MEZE8OxR6q9wUQH\n-----END PRIVATE KEY-----\n",
// client_email: "firebase-adminsdk-fbsvc@asap-cba08.iam.gserviceaccount.com",
// client_id: "114603405067856627648",
// auth_uri: "https://accounts.google.com/o/oauth2/auth",
// token_uri: "https://oauth2.googleapis.com/token",
// auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
// client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40asap-cba08.iam.gserviceaccount.com",
// universe_domain: "googleapis.com"