// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Import the functions you need from the SDKs you need
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Import for local emulator
//import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA9VT3ZslNHapg5TpO2y0qU_1wLf_8IAOQ",
    authDomain: "feria-a-ti.firebaseapp.com",
    databaseURL: "https://feria-a-ti-default-rtdb.firebaseio.com",
    projectId: "feria-a-ti",
    storageBucket: "feria-a-ti.appspot.com",
    messagingSenderId: "720839460183",
    appId: "1:720839460183:web:28530f886ac5c356656a12",
    measurementId: "G-L8MT5GBJ4T",
};

// Initialize Firebase for deploy
export const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
export const storage = getStorage(app);

if (
    (navigator.product == "ReactNative" && __DEV__) ||
    !process.env.NODE_ENV ||
    process.env.NODE_ENV === "development"
) {
    let localAddress = "localhost";
    if (navigator.product == "ReactNative" && __DEV__) {
        localAddress = "192.168.214.106" || "/firebase";
    }
    // Point to function emulator on localhost.
    connectFunctionsEmulator(functions, localAddress, 5001);
    // Point to the Storage emulator running on localhost.
    connectStorageEmulator(storage, localAddress, 9199);
}
console.log(storage.app.options.databaseURL);

export const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: "https://feria-a-ti.firebaseapp.com/finishSignUp?cartId=1234",
    // This must be true.
    handleCodeInApp: true,
    iOS: {
        bundleId: "com.example.ios",
    },
    android: {
        packageName: "com.example.android",
        installApp: true,
        minimumVersion: "12",
    },
    dynamicLinkDomain: "example.page.link",
};
