import { Alert } from 'react-native';
// import {
//   SQIPCardEntry,
//   SQIPCore
// } from 'react-native-square-in-app-payments';
// import {
//   APP_CONFIGURATIONS
// } from '@constants';
import appJSON from '../../../../app.json';


const ENV_TYPE = {
  PRODUCTION: `PRODUCTION`,
  SANDBOX: `SANDBOX`
};
const CURRENT_ENV = appJSON.squareProduction ? ENV_TYPE.PRODUCTION : ENV_TYPE.SANDBOX;
const ENV = {
  [ENV_TYPE.PRODUCTION]: {
    appId: 'sq0idp-MKdpSnb4Il5-VOkGitsGYQ',
    accessToken: 'EAAAEHfa2xUiDfkTOoTYTKBneMey43hdCxOVba62OLvqEZmV52aTIticI5IzYZn7',
    locationId: 'LW6W9TMGG86WA',
    firebaseFunction: `https://us-central1-players-recreation-league.cloudfunctions.net/createSquarePayment`
  },
  [ENV_TYPE.SANDBOX]: {
    appId: 'sandbox-sq0idb-0NIOt3WorBEPSHOwz_jbfg',
    accessToken: 'EAAAEBR3y7yHIUEoRFT_-NyVuCuvioUwNPVTxqsz6Cu2-AxLAKuEF1Jd_ZVTR9hA',
    locationId: 'LKDWCPEH2P96J',
    firebaseFunction: `https://us-central1-players-recreation-league.cloudfunctions.net/createSquarePaymentSandbox`
  }
};
class SquarePayment {
  constructor(onCardEntryComplete = () => { }, onCardEntryCancel = () => { }) {
    this.cardEntryConfig = {
      collectPostalCode: false,
    };
    this.onCardEntryCompleteProp = onCardEntryComplete;
    this.oncardEntryCancelProp = onCardEntryCancel;
    this.amount = 0;
    this.email = '';
  }

  onStartCardEntry = async (amount, email) => {
    try {
      this.amount = amount;
      this.email = email;
      //await SQIPCore.setSquareApplicationId(ENV[CURRENT_ENV].appId);

      if (Platform.OS === 'ios') {
        // await SQIPCardEntry.setIOSCardEntryTheme({
        //   saveButtonFont: {
        //     size: 25,
        //   },
        //   saveButtonTitle: 'Pay 💳',
        //   keyboardAppearance: 'Dark',
        //   saveButtonTextColor: {
        //     r: 255,
        //     g: 0,
        //     b: 125,
        //     a: 0.5,
        //   },
        // });
      }

      // await SQIPCardEntry.startCardEntryFlow(
      //   this.cardEntryConfig,
      //   this.onCardNonceRequestSuccess,
      //   this.onCardEntryCancel,
      // );
    } catch (e) {
      console.log('ERROR_ON_CARD_ENTRY_', e);
      return Alert.alert('Message', 'Something went wrong! - onStartCardEntry()');
    } 
  }

  onCardEntryCancel = () => {
    console.log('CARD_ENTRY_CANCEL');
    this.oncardEntryCancelProp();
  }

  onCardEntryComplete = async (paymentResponse) => {
    console.log('CARD_ENTRY_COMPLETE');
    this.onCardEntryCompleteProp(paymentResponse);
  }

  onCardNonceRequestSuccess = async (cardNounce) => {
    try { 
      let reqBody = JSON.stringify({
        nonce: cardNounce.nonce,
        amount: this.amount,
        email: this.email
      });
      console.log('PAYMENT_REQUEST_BODY - ', reqBody);

      const validatePayment = await fetch(
        ENV[CURRENT_ENV].firebaseFunction, {
        method: 'post',
        body: reqBody,
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
      const validatePaymentResponse = await validatePayment.json();
      console.log('VALIDATE_PAYMENT_RESPONSE - ', JSON.stringify(validatePaymentResponse));
      if (validatePaymentResponse.paymentSuccess) {
        // await SQIPCardEntry.completeCardEntry(
        //   await this.onCardEntryComplete(validatePaymentResponse),
        // );
        return;
      }
      throw new Error(validatePaymentResponse);
    } catch (ex) {
      //await SQIPCardEntry.showCardNonceProcessingError('Invalid Card Details! - onCardNonceRequestSuccess');
      console.log('CARD_NOUNCE_REQ_FAIL_', JSON.stringify(ex));
    }
  }
}

export default SquarePayment;

/*
  Sandbox token - sandbox-sq0idb-wfHpKLbqe4g0MIBJBfv3Ow
  JSON response from the react-native-square-in-app-payments
  {
    "card": {
      "prepaidType":"UNKNOWN",
      "type":"UNKNOWN",
      "postalCode":null,
      "expirationYear":2022,
      "expirationMonth":8,
      "lastFourDigits":"1111",
      "brand":"VISA"
    },
    "nonce": "cnon:CBASEJZfNFJzRAHRxRgAmGsYtrE"
  }
*/
