import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: "AIzaSyAx9dWPR-ZG-YlQ3C_3SSvZxZ5Ky_S6tto",
  authDomain: "players-recreation-league.firebaseapp.com",
  databaseURL: "https://players-recreation-league.firebaseio.com",
  projectId: "players-recreation-league",
  storageBucket: "players-recreation-league.appspot.com",
  messagingSenderId: "119355010184",
  appId: "1:119355010184:web:1d14b74448c5e799dd033d",
  measurementId: "G-CN4TF1JER0"
};

firebase.initializeApp(firebaseConfig);

const firebaseStorageRef = firebase.storage().ref();
const db = firebase.firestore();
const usersCollection = db.collection('users');
const eventsCollection = db.collection('events');
const contestTypesCollection = db.collection('contestTypes');
const contestsCollection = db.collection('contests');
const gameScheduleCollection = db.collection('gameSchedule');
const gameScoresScheduleCollection = db.collection('gameScores');
const playerEventProfileCollection = db.collection('playerEventProfile');
const charitiesCollection = db.collection('charities');
const eventCategoriesCollection = db.collection("eventCategories");
const eventSubCategoriesCollection = db.collection("eventSubCategories");
const eventGenreTypesCollection = db.collection("eventGenreTypes");
const contestBracketTypesCollection = db.collection('contestBracketTypes');
const contestScoringTypesCollection = db.collection('contestScoringTypes');
const eventProfileQuestionsCollection = db.collection('eventProfileQuestions');
const eventContestFeeTypesCollection = db.collection('eventContestFeeTypes');
const eventContestFeesCollection = db.collection('eventContestFees');
const userEnteredContestsCollection = db.collection('userEnteredContests');
const prlAboutTermsPrivacyCollection = db.collection('prlAboutTermsPrivacy');
const squareTransactionsCollection = db.collection('squareTransactions');
const stripeTransactionsCollection = db.collection('stripeTransactions');
const charitiesPaymentCollection = db.collection('charitiesPaymentProcessing');
const emailPaymentConfirmationCollection = db.collection('emailPaymentConfirmation');
const emailSentCollection = db.collection('emailSent');
const userEventInviteListCollection = db.collection('userEventInviteList');
const notificationsCloudCollection = db.collection('notificationsCloud');
const gameScheduleDetailsCollection = db.collection('gameScheduleDetails');
const bracketInfoDetailsCollection = db.collection('bracketInfoDetails');

export {
  db,
  firebase,
  usersCollection,
  eventsCollection,
  contestTypesCollection,
  contestsCollection,
  gameScheduleCollection,
  gameScoresScheduleCollection,
  playerEventProfileCollection,
  charitiesCollection,
  eventCategoriesCollection,
  eventSubCategoriesCollection,
  eventGenreTypesCollection,
  firebaseStorageRef,
  contestBracketTypesCollection,
  contestScoringTypesCollection,
  eventProfileQuestionsCollection,
  eventContestFeeTypesCollection,
  eventContestFeesCollection,
  userEnteredContestsCollection,
  prlAboutTermsPrivacyCollection,
  squareTransactionsCollection,
  stripeTransactionsCollection,
  charitiesPaymentCollection,
  emailPaymentConfirmationCollection,
  emailSentCollection,
  userEventInviteListCollection,
  notificationsCloudCollection,
  gameScheduleDetailsCollection,
  bracketInfoDetailsCollection
}