import React, { Fragment, useState, } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  SafeAreaView,
} from "react-native";
import {
  CardField,
  useStripe,
} from "@stripe/stripe-react-native";
import Modal from "react-native-modal";
import { stripeProduction } from "../../../../../app.json";

const ENV = {
  sandbox:
    "https://us-central1-players-recreation-league.cloudfunctions.net/createStripePaymentSandbox",
  production:
    "https://us-central1-players-recreation-league.cloudfunctions.net/createStripePayments",
};
const PAYMENT_URL = stripeProduction ? ENV.production : ENV.sandbox;

const StripePaymentPopup = (props) => {
  const {
    visible,
    closeModal,
    total,
    eventName,
    charityName,
    email,
    eventID,
    onPaymentSuccess,
  } = props;
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const {createPaymentMethod} = useStripe();

  const createIntent = async () => {
    setLoading(true);
    try {
      const { error, paymentMethod } = await createPaymentMethod({
        type: "card",
        card: cardDetails,
      });
      console.log("Payment Response --> ", paymentMethod);
      if(error){
        console.log('Error ->>>>', error);
      }
      let reqBody = JSON.stringify({
        amount: total * 100,
        id: paymentMethod?.id,
        eventName: eventName,
        charityName: charityName,
        email: email,
        eventID: eventID,
      });
      const validatePayment = await fetch(PAYMENT_URL, {
      method: "post",
      body: reqBody,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    console.log("Payment Final ---> ", validatePayment.status);
    if (validatePayment.status == 200) {
      onPaymentSuccess(validatePayment);
      closeModal();
      setLoading(false);
    } else {
      closeModal();
      setLoading(false);
      Alert.alert("Oops..!", "Payment Failed..!");
    }
    } catch (error) {
      console.log('Error on Payment -> ', error);
    }
  };

  return (
    <SafeAreaView>
      <Modal
        style={{
          backgroundColor: "#C9C9C9",
          borderRadius: 10,
          width: Dimensions.get("screen").width,
          alignSelf: "center",
        }}
        isVisible={visible}
      >
          <View
            style={{
              marginBottom: 15,
              marginTop: 100,
              alignSelf: "center",
              backgroundColor: "#6bbfed",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 24, color: "#0b214d" }}>Stripe</Text>
          </View>
          <View style={{ height: 50, width: "100%" }}>
            <CardField
              postalCodeEnabled={false}
              placeholder={{
                number: "4242 4242 4242 4242",
              }}
              cardStyle={{ width: "100%", fontSize: 12 }}
              style={styles.cardFieldStyle}
              onCardChange={(cardDetails) => {
                setCardDetails(cardDetails);
              }}
              onFocus={(focusedField) => {
                console.log("focusField", focusedField);
              }}
            />
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() => {
                createIntent();
              }}
              disabled={loading}
            >
              <View
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: "#0b214d",
                  },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" size="large" />
                ) : (
                  <Text style={{ color: "#fff" }}>Pay - ${total}</Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => closeModal()} disabled={loading}>
              <View
                style={[, styles.submitButton, { backgroundColor: "#FFF" }]}
              >
                <Text>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
      </Modal>
    </SafeAreaView>
  );
};

export default StripePaymentPopup;

const styles = StyleSheet.create({
  cardFieldStyle: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonView: {
    flexDirection: "row",
    alignSelf: "center",
    width: "80%",
    justifyContent: "space-evenly",
    marginTop: 15,
  },
});
