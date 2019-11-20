import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyARy7WERt2ydPhsUgwvAEMTw8ljBnJH72w",
  authDomain: "finalproject-cafc4.firebaseapp.com",
  databaseURL: "https://finalproject-cafc4.firebaseio.com",
  projectId: "finalproject-cafc4",
  storageBucket: "finalproject-cafc4.appspot.com",
  messagingSenderId: "426971232569",
  appId: "1:426971232569:web:006129ae5a2bbfec5ad0e8"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();
