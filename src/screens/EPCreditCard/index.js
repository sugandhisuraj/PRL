// External Imports
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
//import { Picker } from '@react-native-community/picker'
import Icon from "react-native-vector-icons/Feather";
import styles from "./indexCss";
import { Button, CheckBox } from "native-base";
import HeaderBlack from "../Header/HeaderBlack";
import DropDownPicker from "react-native-dropdown-picker";
import { SquarePayment, FirebaseEmail } from "@classes";
import {
  squareTransactionsCollection,
  stripeTransactionsCollection,
  eventProfileQuestionsCollection,
  playerEventProfileCollection,
} from "../../firebase";
import {
  StripeProvider,
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { useSelector, connect } from "react-redux";
import { transformFirebaseValues } from "@utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { PRLLogo } from "@component";
import appJSON from "../../../app.json";
import { stripeProduction } from "../../../app.json";

function EPCreditCardScreen(props) {
  // const [] = useState(playerEventProfileModal);
  //const [squarePayment] = useState(() => new SquarePayment(onCardEntryComplete, onCardEntryCancel));
  const [showDropdown, setDropdown] = useState(true);
  const [stripeModel, setStripeModel] = useState(false);
  const [selectedFeesType, setSelectedFeesType] = useState([]);
  const {
    eventData,
    selectedFeesData,
    saveFeesDataToFirebase = () => {},
    feesModel,
    paymentIntent = () => {},
    currentPayInfo,
  } = props.route.params;
  const { auth } = useSelector((state) => state);
  let playerEventProfileModal = {
    eventID: 0,
    profileA1: "",
    profileA2: "",
    profileA3: "",
    profileA4: "",
    profileFirstName: "",
    profileID: "",
    profileImage: "",
    profileImageQ: "",
    profileNickname: "",
    profilePlayerForCharityID: 1,
    profilePlayerPicture: "",
    profileQ1Label: "",
    profileQ2Label: "",
    profileQ3Label: "",
    profileQ4Label: "",
    profileVideo: "",
    profileVideoQ: "",
    userID: "",
  };
  const data2 = ["America", "California", "Los Angeles"];
  useEffect(() => {
    setSelectedFeesType(selectedFeesData);
  }, [eventData, selectedFeesData]);

  const createPlayerProfileEntry = async () => {
    try {
      let isProfileExist = await playerEventProfileCollection
        .where("userID", "==", auth.userId)
        .where("eventID", "==", eventData.eventID)
        .get();
      if (isProfileExist.docs.length > 0) {
        return isProfileExist.docs[0].data();
      }
      const getEventProfileQuestions = await eventProfileQuestionsCollection
        .where("eventID", "==", eventData.eventID)
        .get();

      if (getEventProfileQuestions.docs.length == 0) {
        return null;
      }
      const getEventProfileQuestionsTrans = transformFirebaseValues(
        getEventProfileQuestions,
        "eventID"
      );

      let profileQuestion = getEventProfileQuestionsTrans[0];
      //console.log('GOT_PLAYER_QUESTIONS - ', JSON.stringify(profileQuestion));
      if (Object.keys(profileQuestion).length == 0) {
        return;
      }
      playerEventProfileModal.eventID = eventData?.eventID || "";
      (playerEventProfileModal.profilePlayerForCharityID =
        eventData?.charityID || ""),
        (playerEventProfileModal.profileFirstName =
          auth?.userCol?.userName || "");
      playerEventProfileModal.profileID = Date.now();
      playerEventProfileModal.profileImageQ =
        profileQuestion?.profileImageQ || "";
      playerEventProfileModal.profileNickname =
        auth?.userCol?.userNickname || "";
      playerEventProfileModal.profileQ1Label =
        profileQuestion?.profileQ1Label || "";
      playerEventProfileModal.profileQ2Label =
        profileQuestion?.profileQ2Label || "";
      playerEventProfileModal.profileQ3Label =
        profileQuestion?.profileQ3Label || "";
      playerEventProfileModal.profileQ4Label =
        profileQuestion?.profileQ4Label || "";
      playerEventProfileModal.profileVideoQ =
        profileQuestion?.profileVideoQ || "";
      playerEventProfileModal.userID = auth?.userId || "";
      console.log(
        "CREATE_PLAYER_EVENT_PROFILE - ",
        JSON.stringify(playerEventProfileModal)
      );
      const savePlayerEventProfile = await playerEventProfileCollection.add(
        playerEventProfileModal
      );
      console.log("PLAYER_EVENT_PROFILE_CREATED - ", savePlayerEventProfile.id);
      return savePlayerEventProfile.id;
    } catch (error) {
      return Alert.alert(
        "Message",
        "Something went wrong! - createPlayerProfileEntry"
      );
    }
  };

  // const onCardEntryComplete = async (paymentResponse) => {
  //   try {
  //     const squareTransactionsBody = {};
  //     squareTransactionsBody.paymentResponse = JSON.stringify(paymentResponse);
  //     squareTransactionsBody.eventID = eventData.eventID;
  //     squareTransactionsBody.userID = auth.userId;
  //     squareTransactionsBody.createtdAt = new Date();
  //     squareTransactionsBody.env = appJSON.squareProduction
  //       ? "PRODUCTION"
  //       : "SANDBOX";
  //     console.log(
  //       "SQUARE_TRANSACTION_SAVE_3 - ",
  //       JSON.stringify(squareTransactionsBody)
  //     );
  //     const saveSquareTransaction = await squareTransactionsCollection.add(
  //       squareTransactionsBody
  //     );
  //     console.log(
  //       "SAVE_SQUARE_TRANSACTION_DONE_4 - ",
  //       saveSquareTransaction.id
  //     );
  //     await createPlayerProfileEntry();
  //     saveFeesDataToFirebase();
  //     let itemsPaidFor = selectedFeesType.map((i) => i.contestName).join(", ");
  //     //console.log("SELECTED_FEES_TYPE_2 - ", selectedFeesType);
  //     //console.log('ITEMS_PAID_FOR_CHECK_2 - ', itemsPaidFor);

  //     const sendEmailResponse = await FirebaseEmail.sendMail(
  //       FirebaseEmail.paymentConfirmation({
  //         event: eventData.eventName,
  //         eventDate: eventData.eventDate,
  //         itemsPaidFor: itemsPaidFor,
  //         totalPayment: `$${getTotalAmount()}`,
  //         userName: auth.userCol.userName,
  //         toUids: auth.userId,
  //       })
  //     );
  //     console.log("EMAIL_FINAL_CHECK__3 - ", sendEmailResponse.id);
  //     props.navigation.navigate("EPConfirmationScreen", {
  //       eventData,
  //       selectedFeesData,
  //     });
  //     //return saveFeesDataToFirebase();
  //   } catch (error) {
  //     console.log("ERROR_SAVE_TRANSACTION_INFO - ", error);
  //     return Alert.alert(
  //       "Message",
  //       "Something went wrong! - onCardEntryComplete"
  //     );
  //   }
  // };

  const onCardEntryComplete = async (paymentResponse) => {
    setLoader(true);
    try {
      const stripeTransactionsBody = {};
      stripeTransactionsBody.paymentResponse = JSON.stringify(paymentResponse);
      stripeTransactionsBody.eventID = eventData.eventID;
      stripeTransactionsBody.userID = authState.userId;
      stripeTransactionsBody.createtdAt = new Date();

      stripeTransactionsBody.amountPaid =
        feesModel.getTotal(true).selectedTotalFees;

      stripeTransactionsBody.charityID = feesModel?.selectedCharityData
        .charityID
        ? feesModel?.selectedCharityData?.charityID
        : eventData?.charityData?.charityID;

      stripeTransactionsBody.charityName = feesModel?.selectedCharityData
        .charityName
        ? feesModel?.selectedCharityData?.charityName
        : eventData?.charityData?.charityName;

      stripeTransactionsBody.env = stripeProduction ? "PRODUCTION" : "SANDBOX";
      const saveStripeTransaction = await stripeTransactionsCollection.add(
        stripeTransactionsBody
      );
      const getData = await userEnteredContestsCollection.get();
      const transData = transformFirebaseValues(
        getData,
        "userEnteredContestID"
      );
      let savedId = getLargeNum(transData, "userEnteredContestID");
      let firebaseSaveData = feesModel.getFirebaseData(
        authState?.user?.uid,
        ++savedId
      );
      await createPlayerProfileEntry();
      await saveFeesDataToFirebase(firebaseSaveData);
      let itemsPaidFor = firebaseSaveData.map((i) => i.contestName).join(", ");

      const sendEmailResponse = await FirebaseEmail.sendMail(
        FirebaseEmail.paymentConfirmation({
          event: eventData.eventName,
          eventDate: eventData.eventDate,
          itemsPaidFor: itemsPaidFor,
          totalPayment: `$${feesModel.getTotal(true).selectedTotalFees}`,
          userName: authState.userCol.userName,
          toUids: authState.userId,
        })
      );
      console.log("EMAIL_FINAL_CHECK__3 - ", sendEmailResponse.id);
      setLoader(false);
      props.navigation.navigate("EPConfirmationScreen", {
        eventData,
        selectedFeesData: selectedFeesType,
      });
      //return saveFeesDataToFirebase();
    } catch (error) {
      setLoader(false);
      console.log("ERROR_SAVE_TRANSACTION_INFO - ", error);
      return Alert.alert(
        "Message",
        "Something went wrong! - onCardEntryComplete"
      );
    }
  };

  function onCardEntryCancel() {}

  const handlePayment = async () => {
    try {
      let squarePayment = new SquarePayment(
        onCardEntryComplete,
        onCardEntryCancel
      );
      await squarePayment.onStartCardEntry(
        getTotalAmount() * 100,
        auth.userCol.email
      );
    } catch (error) {
      console.log("ERROR- ", error);
      return Alert.alert("Message", "Something went wrong! - handlePayment()");
    }

    //props.navigation.navigate('EPConfirmationScreen')
  };

  const getTotalAmount = () => {
    // eFees.contestName == 'Spectator' &&
    // feesModel.isSpectatorMode.mode &&
    // feesModel.conditionCheck()
    if (selectedFeesType.length == 0) {
      return 0;
    }
    let total = 0;
    selectedFeesType.map((i) => {
      if (
        i.userContestParticipationType == "Spectator" &&
        feesModel.isSpectatorMode.mode &&
        feesModel.conditionCheck()
      ) {
      } else {
        total += parseFloat(i.userContestPaidAmount / 100);
      }
    });

    return total.toFixed(2);
  };
  return (
    <StripeProvider
      publishableKey={
        stripeProduction
          ? currentPayInfo.productionPublishableKey
          : currentPayInfo.sandboxPublishableKey
      }
      merchantIdentifier="merchant.identifier"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <HeaderBlack onBackPress={() => props.navigation.goBack()} />
        <KeyboardAwareScrollView>
          <View
            style={{ justifyContent: "space-between", flexDirection: "column" }}
          >
            <PRLLogo
              containerStyle={{
                alignSelf: "center",
                height: 100,
                width: 100,
              }}
              imgStyle={{
                height: 100,
                width: 100,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 40,
                paddingTop: 10,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 15, color: "#0B214D", fontWeight: "bold" }}
                >
                  {eventData.eventName}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 0,
                }}
              >
                <Text
                  style={{ fontSize: 15, color: "#0B214D", fontWeight: "bold" }}
                >
                  Total: ${getTotalAmount()}
                </Text>
                <Icon
                  name="chevron-down"
                  size={20}
                  onPress={() => setDropdown(!showDropdown)}
                  hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
                />
              </View>
            </View>

            {showDropdown && (
              <View style={{ paddingHorizontal: 40, paddingVertical: 5 }}>
                {selectedFeesType.length > 0 &&
                  selectedFeesType.map((itr) => {
                    // if(itr.contestID == 0) {
                    //   return null;
                    // }
                    if (
                      itr.userContestParticipationType == "Spectator" &&
                      feesModel.isSpectatorMode.mode &&
                      feesModel.conditionCheck()
                    ) {
                      return null;
                    }
                    return (
                      <View
                        style={{
                          paddingBottom: 5,
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: "black" }}>
                          {itr.contestName}
                        </Text>
                        <Text style={{ fontWeight: "bold", color: "black" }}>
                          $
                          {parseFloat(itr.userContestPaidAmount / 100).toFixed(
                            2
                          )}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            )}
            <View style={styles.formContainer}>
              <TextInput
                containerStyle={styles.inputContainerStyle}
                placeholder={"Enter Address"}
                style={styles.Field}
                // value={loginForm.email}
                // onChangeText={(email) => {
                //   if (error.email.length > 0) {
                //     setError(error.setErrors("email", ""));
                //   }
                //   setLoginForm(loginForm.setData("email", email));
                // }}
              />
              <TextInput
                containerStyle={styles.inputContainerStyle}
                placeholder={"Zip Code"}
                style={styles.Field}
                // value={loginForm.email}
                // onChangeText={(email) => {
                //   if (error.email.length > 0) {
                //     setError(error.setErrors("email", ""));
                //   }
                //   setLoginForm(loginForm.setData("email", email));
                // }}
              />
            </View>
            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "space-evenly",
                paddingBottom: 10,
              }}
            >
              <View>
                <Button
                  onPress={() => paymentIntent()}
                  style={styles.ButtonView}
                >
                  <Text style={styles.ButtonText}>
                    Pay with Stripe {!appJSON.stripeProduction && `(Sandbox)`}
                  </Text>
                </Button>
              </View>
              {/* <View>
              <Button style={styles.ButtonView}>
                <Text style={styles.ButtonText}>Paypal</Text>
              </Button>
            </View> */}
            </View>
          </View>

          <Text
            style={{
              width: "80%",
              alignSelf: "center",
              color: "black",
              marginTop: 30,
              fontWeight: "700",
            }}
          >
            Note: Players Recreation League utilizes Stripe, a secure third
            party, for credit card processing. PRL does not save any of your
            credit card information.
          </Text>

          {stripeModel && (
            <StripePaymentPopup
              visible={stripeModel}
              total={`${getTotalAmount()}`}
              eventName={eventData.eventName}
              charityName={
                feesModel?.selectedCharityData?.charityName
                  ? feesModel?.selectedCharityData?.charityName
                  : " "
              }
              email={authState.user.email}
              eventID={eventData.eventID}
              onPaymentSuccess={(res) => onCardEntryComplete(res)}
              closeModal={() => setStripeModel(false)}
            />
          )}

          {/* <View style={{ alignItems: 'center', paddingTop: 10 }}>
          <View>
            <View >
              <Text style={{ fontSize: 14, color: '#0B214D', fontWeight: 'bold', textAlign: 'left' }}>Email</Text>
            </View>

            <View style={{ paddingBottom: 10 }}>
              <TextInput
                style={{ height: 40, width: 300, elevation: 2, backgroundColor: '#FFFFFF', borderRadius: 8 }}
                placeholder="example@gmail.com"

              />
            </View>

            <View >
              <Text style={{ fontSize: 14, color: '#0B214D', fontWeight: 'bold', textAlign: 'left' }}>Card Information</Text>
            </View>

            <View style={{ paddingBottom: 10 }}>
              <TextInput
                style={{ height: 40, width: 300, elevation: 2, backgroundColor: '#FFFFFF', borderRadius: 8 }}
                placeholder="number"

              />
            </View>

            <View style={{ paddingBottom: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
              <TextInput
                style={{ height: 40, width: 148, elevation: 2, backgroundColor: '#FFFFFF', borderRadius: 8 }}
                placeholder="MM/YY"
              />
              <TextInput
                style={{ height: 40, width: 148, elevation: 2, backgroundColor: '#FFFFFF', borderRadius: 8 }}
                placeholder="CVV"
              />
            </View>
            <View>
              <Text style={{ fontSize: 14, color: '#0B214D', fontWeight: 'bold', textAlign: 'left' }}>Country or Region</Text>
            </View>
            <View>
            </View>

            <View style={{ paddingBottom: 15 }}>
              <DropDownPicker
                items={data2}
                defaultNull
                placeholder="Country name"
                placeholderStyle={{ color: 'rgba(0, 0, 0, 0.6)' }}
                containerStyle={{ height: 40, marginTop: 5 }}
                style={{ backgroundColor: '#ffffff', position: 'absolute', borderRadius: 16 }}
                itemStyle={{ justifyContent: 'flex-start' }}
                dropDownMaxHeight={200}
              />

            </View>
            <View style={{ paddingBottom: 10 }}>
              <TextInput
                style={{ height: 40, width: 300, borderWidth: 0.5, borderColor: '#8e8e8e', backgroundColor: '#FFFFFF', borderRadius: 8 }}
                placeholder="Zip Code"

              />
            </View>
          </View>

          <View style={styles.checkboxContainer}>
            <CheckBox checked={true} color={"#0B214D"} style={{ borderRadius: 30, borderColor: 'black', borderWidth: 1 }} />
            <Text style={styles.label}>Remember this card?</Text>
          </View>


          <View style={{ paddingBottom: 20 }}>
            <Button style={styles.SubmitButton} onPress={() => handlePayment()}>
              <Text style={styles.SubmitButtonView}>Submit Payment</Text>
            </Button>
          </View>

        </View> */}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </StripeProvider>
  );
}

export default connect()(EPCreditCardScreen);
