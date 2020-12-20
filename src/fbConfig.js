import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions"

const firebaseConfig = {
  apiKey: "AIzaSyAhZIxqOpJHIKQKzOzgvOmHnqhhr8Ki6Ug",
  authDomain: "cool-neighbors.firebaseapp.com",
  databaseURL: "https://cool-neighbors.firebaseio.com",
  projectId: "cool-neighbors",
  storageBucket: "cool-neighbors.appspot.com",
  messagingSenderId: "117544325188",
  appId: "1:117544325188:web:9c83910351cafaab"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const functions = firebase.functions();


