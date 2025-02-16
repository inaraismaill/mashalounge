import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDDo6xwdbQKSraqKsmHfLo97UXusNfFnCA" ,
  authDomain: "push-notification-7b0fd.firebaseapp.com",
  projectId: "push-notification-7b0fd",
  storageBucket: "push-notification-7b0fd.firebasestorage.app",
  messagingSenderId: "1008103185208",
  appId: "1:1008103185208:web:adceb13106e24ab956ffcd",
  measurementId: "G-1QXK0PSWJ4"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const analytics = getAnalytics(app);

export { messaging, onMessage,analytics };
