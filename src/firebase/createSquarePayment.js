const admin = require('firebase-admin');
const functions = require('firebase-functions');

// admin.initializeApp(functions.config().firebase);

 


const express = require('express');
const bodyParser = require('body-parser');
const { Client, Environment, ApiError } = require('square');

const app = express();
const port = 3000;

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


const accessToken = 'EAAAEFDErsUXN2inuG9jPQBLgVCETg51Nbx4S_UKNzX9oAZEndzIP9XMAnDxCmol';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));
const client = new Client({
  environment: Environment.Sandbox,
  accessToken: accessToken,
});

exports.createSquarePayment = functions.https.onRequest((req, res) => {
  (async ()=>{
    const requestParams = req.body;
  console.log('BODY_RECIEVED - ', JSON.stringify(requestParams));

  const paymentsApi = client.paymentsApi;
  const requestBody = {
    sourceId: requestParams.nonce,
    amountMoney: {
      amount: requestParams.amount,
      currency: 'USD'
    },
    locationId: 'L5Q7GWE4YJEVA',
    idempotencyKey: uuidv4(),
  };

  try {
    const response = await paymentsApi.createPayment(requestBody);
    console.log('RESPONSE_SQUARE - ', JSON.stringify(response));
    res.status(200).json({
      'paymentSuccess': true,
      'title': 'Payment Successful',
      'result': response.result
    });
  } catch (error) {
    let errorResult = null;
    if (error instanceof ApiError) {
      errorResult = error.errors;
    } else {
      errorResult = error;
    }
    res.status(500).json({
      'paymentSuccess': false,
      'title': 'Payment Failure',
      'result': errorResult
    });
  }
  })();
});

app.listen(
  port,
  () => console.log(`listening on - http://localhost:${port}`)
);


/*
Response From Square
{"body":"{\"payment\": {\"id\": \"XpHuXnns2vihpwLdL8FhnPCmnobZY\",\"created_at\": \"2020-12-29T12:12:48.169Z\",\"updated_at\": \"2020-12-29T12:12:48.367Z\",\"amount_money\": {\"amount\": 295,\"currency\": \"USD\"},\"status\": \"COMPLETED\",\"delay_duration\": \"PT168H\",\"source_type\": \"CARD\",\"card_details\": {\"status\": \"CAPTURED\",\"card\": {\"card_brand\": \"VISA\",\"last_4\": \"1111\",\"exp_month\": 11,\"exp_year\": 2024,\"fingerprint\": \"sq-1-SNsEbkMir-8-mPUGkSy2lF_h2eUnhsQJVXoPgwzZOevNI2NH07NDjFO2fgJo6tu-Tg\",\"card_type\": \"CREDIT\",\"bin\": \"411111\"},\"entry_method\": \"KEYED\",\"cvv_status\": \"CVV_ACCEPTED\",\"avs_status\": \"AVS_NOT_CHECKED\",\"statement_description\": \"SQ *DEFAULT TEST ACCOUNT\"},\"location_id\": \"L5Q7GWE4YJEVA\",\"order_id\": \"NWNYBHuBPoa8KByhuUSONA6HqoZZY\",\"risk_evaluation\": {\"created_at\": \"2020-12-29T12:12:48.302Z\",\"risk_level\": \"NORMAL\"},\"total_money\": {\"amount\": 295,\"currency\": \"USD\"},\"receipt_number\": \"XpHu\",\"receipt_url\": \"https://squareupsandbox.com/receipt/preview/XpHuXnns2vihpwLdL8FhnPCmnobZY\",\"delay_action\": \"CANCEL\",\"delayed_until\": \"2021-01-05T12:12:48.169Z\"}}\n","headers":{"date":"Tue, 29 Dec 2020 12:12:48 GMT","frame-options":"DENY","x-frame-options":"DENY","x-content-type-options":"nosniff","x-xss-protection":"1; mode=block","content-type":"application/json","square-version":"2020-12-16","squareup--connect--v2--common--versionmetadata-bin":"CgoyMDIwLTEyLTE2","vary":"Accept-Encoding, User-Agent","content-length":"1034","strict-transport-security":"max-age=631152000; includeSubDomains; preload","connection":"close"},"statusCode":200,"request":{"method":"POST","url":"https://connect.squareupsandbox.com/v2/payments","headers":{"user-agent":"Square-TypeScript-SDK/7.0.0","content-type":"application/json","authorization":"Bearer EAAAEFDErsUXN2inuG9jPQBLgVCETg51Nbx4S_UKNzX9oAZEndzIP9XMAnDxCmol","accept":"application/json"},"body":{"type":"text","content":"{\"source_id\":\"cnon:CBASENHnLrbCD99x_SR_pIyNfe0\",\"idempotency_key\":\"25cc1239-3d4d-4d42-949d-b8a4882dce1a\",\"amount_money\":{\"amount\":295,\"currency\":\"USD\"},\"location_id\":\"L5Q7GWE4YJEVA\"}"}},"result":{"payment":{"id":"XpHuXnns2vihpwLdL8FhnPCmnobZY","createdAt":"2020-12-29T12:12:48.169Z","updatedAt":"2020-12-29T12:12:48.367Z","amountMoney":{"amount":295,"currency":"USD"},"totalMoney":{"amount":295,"currency":"USD"},"status":"COMPLETED","delayDuration":"PT168H","delayAction":"CANCEL","delayedUntil":"2021-01-05T12:12:48.169Z","sourceType":"CARD","cardDetails":{"status":"CAPTURED","card":{"cardBrand":"VISA","last4":"1111","expMonth":11,"expYear":2024,"fingerprint":"sq-1-SNsEbkMir-8-mPUGkSy2lF_h2eUnhsQJVXoPgwzZOevNI2NH07NDjFO2fgJo6tu-Tg","cardType":"CREDIT","bin":"411111"},"entryMethod":"KEYED","cvvStatus":"CVV_ACCEPTED","avsStatus":"AVS_NOT_CHECKED","statementDescription":"SQ *DEFAULT TEST ACCOUNT"},"locationId":"L5Q7GWE4YJEVA","orderId":"NWNYBHuBPoa8KByhuUSONA6HqoZZY","riskEvaluation":{"createdAt":"2020-12-29T12:12:48.302Z","riskLevel":"NORMAL"},"receiptNumber":"XpHu","receiptUrl":"https://squareupsandbox.com/receipt/preview/XpHuXnns2vihpwLdL8FhnPCmnobZY"}}}
*/