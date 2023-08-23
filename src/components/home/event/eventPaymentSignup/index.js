import { FirebaseEmail } from "@classes";
import {
  CollapsibleViewWithHeading,
  CustomModalDropDown,
  EventFeesInputRow,
  Header,
  Root,
  StaticEventImageHeader,
  TextInputHeading,
  TouchableButton,
  TripleHeading,
} from "@component";
import { useLoader } from "@hooks";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import {
  getFromToDate,
  getHp,
  getLargeNum,
  getWp,
  transformFirebaseValues,
} from "@utils";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";
import { useSelector } from "react-redux";
import { stripeProduction } from "../../../../../app.json";
import {
  charitiesPaymentCollection,
  db,
  eventContestFeesCollection,
  eventProfileQuestionsCollection,
  playerEventProfileCollection,
  stripeTransactionsCollection,
  userEnteredContestsCollection,
} from "../../../../firebase";
import FeesModel from "./Fees.model";
import Styles from "./indexCss";
import PaymentHostInfo from "./PaymentHostInfo";

const EventFees = (props) => {
  const formsRef = useRef({
    charityData: useRef(),
  });
  const { eventData = {} } = props.route.params;
  const [feesModel, setFeesModel] = useState(FeesModel);
  const [stripeModel, setStripeModel] = useState(false);
  const [selectedFeesType, setSelectedFeesType] = useState([]);
  const authState = useSelector((state) => state.auth);
  const { firebaseAllCollectionData } = useSelector((s) => s);
  const [setLoader, LoaderComponent] = useLoader();
  const [allPaymentConfig, setAllPaymentConfig] = useState([]);
  const [charityData, setCharityData] = useState([]);
  const [sqAppId, setSqAppId] = useState();
  const [payCharity, setPayCharity] = useState(0);

  const [paymentMode, setPaymentMode] = useState("Square");
  const [currentPayInfo, setCurrentPayInfo] = useState();

  const loadData = async (eventPropData) => {
    const contestFeeColData = await eventContestFeesCollection
      .where("eventID", "==", eventPropData.eventID)
      .get();
    const preSignupRes = await userEnteredContestsCollection
      .where("eventID", "==", eventPropData.eventID)
      .where("userID", "==", authState.userId)
      .get();
    const preSignupData = transformFirebaseValues(preSignupRes, "eventID");
    const allCharityData = [
      ...firebaseAllCollectionData.firebaseCollectionData.charityData,
    ];

    const charityPaymentData = await charitiesPaymentCollection.get();
    let d = [];
    charityPaymentData.docs.map((SingleCharityData) => {
      d.push(SingleCharityData.data());
    });
    setAllPaymentConfig(d);

    setFeesModel(
      feesModel.onInit(
        contestFeeColData,
        eventPropData,
        preSignupData,
        allCharityData
      )
    );

    if (
      !(
        eventData?.charityID == 0 &&
        !feesModel?.selectedCharityData?.charityName
      )
    ) {
      console.log(
        "Event Data Charity ID --> ",
        eventData?.charityData?.charityID
      );
      const paymentData = d.find(
        (s) => s.charityID == eventData?.charityData?.charityID
      );
      const universalPaymentData = d.find((s) => s.charityID == 0);
      let usingPaymentData = {};
      if (paymentData && paymentData.enablePaymentProcessing) {
        console.log("enable --> ", paymentData);
        usingPaymentData = paymentData;
        setPayCharity(eventData?.charityData?.charityID);
      } else {
        usingPaymentData = universalPaymentData;
        setPayCharity(0);
      }
      let HostInfo = new PaymentHostInfo(usingPaymentData);
      HostInfo.initPaymentInfoProcess();
      let host = HostInfo.getActivePaymentHosts();
      let hostPayInfo = HostInfo.getCurrentPaymentInfo();
      setPaymentMode(host[0]);
      setCurrentPayInfo(hostPayInfo);
      console.log("Host Data -> ", HostInfo.getActivePaymentHosts());
      console.log("Use Effect Current Payment Info -> ", hostPayInfo);
    }
    loadCharity();
  };

  const loadCharity = () => {
    let Arr = [];
    if (
      eventData?.charityType &&
      eventData?.charityType === "Student Athlete"
    ) {
      Arr = feesModel?.allCharityData.filter(
        (s) => s?.charityType === eventData?.charityType
      );
      Arr.sort((a, b) => a.charityID - b.charityID);
      setCharityData(Arr);
    } else {
      Arr = feesModel?.allCharityData.filter(
        (s) => s?.charityType === "Charity" && s?.charityID !== 0
      );
      setCharityData(Arr);
    }
  };

  useEffect(() => {
    setFeesModel(feesModel.resetScreen());
    //console.log('EVENT_PROP_DATA - ', JSON.stringify(eventData));
    setTimeout(() => {
      loadData(eventData);
    }, 500);
  }, [eventData.eventID]);

  let playerEventProfileModalCol = {
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

  const createPlayerProfileEntry = async () => {
    let isProfileExist = await playerEventProfileCollection
      .where("userID", "==", authState.userId)
      .where("eventID", "==", eventData.eventID)
      .get();
    if (isProfileExist.docs.length > 0) {
      return isProfileExist.docs[0].data;
    }
    const getEventProfileQuestions =
      await eventProfileQuestionsCollection.get();
    const getEventProfileQuestionsTrans = transformFirebaseValues(
      getEventProfileQuestions,
      "eventID"
    );
    let profileQuestion = {};
    getEventProfileQuestionsTrans.map((i) => {
      if (i.eventID == eventData.eventID) {
        profileQuestion = { ...i };
      }
    });
    ////console.log('GOT_PLAYER_QUESTIONS - ', JSON.stringify(profileQuestion));
    if (Object.keys(profileQuestion).length == 0) {
      return;
    }
    let playerEventProfileModal = { ...playerEventProfileModalCol };
    playerEventProfileModal.eventID = eventData.eventID;
    (playerEventProfileModal.profilePlayerForCharityID = eventData.charityID),
      (playerEventProfileModal.profileFirstName = authState.userCol.userName);
    playerEventProfileModal.profileID = Date.now();
    playerEventProfileModal.profileImageQ = profileQuestion.profileImageQ;
    playerEventProfileModal.profileNickname = authState.userCol.userNickname;
    playerEventProfileModal.profileQ1Label = profileQuestion.profileQ1Label;
    playerEventProfileModal.profileQ2Label = profileQuestion.profileQ2Label;
    playerEventProfileModal.profileQ3Label = profileQuestion.profileQ3Label;
    playerEventProfileModal.profileQ4Label = profileQuestion.profileQ4Label;
    playerEventProfileModal.profileVideoQ = profileQuestion.profileVideoQ;
    playerEventProfileModal.userID = authState.userId;
    ////console.log('CREATE_PLAYER_EVENT_PROFILE - ', JSON.stringify(playerEventProfileModal));
    const savePlayerEventProfile = await playerEventProfileCollection.add(
      playerEventProfileModal
    );
    ////console.log('PLAYER_EVENT_PROFILE_CREATED - ', savePlayerEventProfile.id);
    return savePlayerEventProfile.id;
  };

  const saveFeesDataToFirebase = (firebaseSaveData) => {
    try {
      console.log("START_SAVING_TO_ENTERED_CONTEST --> ", ...firebaseSaveData);
      var batch = db.batch();
      firebaseSaveData.forEach((doc) => {
        var docRef = userEnteredContestsCollection.doc();
        batch.set(docRef, doc);
      });
      batch.commit();
      console.log("START_SAVING_TO_ENTERED_CONTEST_DONE");
      //return props.navigation.goBack();
      //return props.navigation.pop(2)
    } catch (error) {
      return Alert.alert(
        "Message",
        "Something went wrong! - saveFeesDataToFirebase"
      );
    }
  };

  const sendEmailToUser = async () => {
    let itemsPaidFor = "";
    feesModel.allContestTypeFees.map((i) => {
      if (i.isSelected) {
        itemsPaidFor = itemsPaidFor.concat(i.contestName + ", ");
      }
    });
    feesModel.allEventTypeFees.map((i) => {
      if (i.isSelected) {
        itemsPaidFor = itemsPaidFor.concat(i.contestName + ", ");
      }
    });
    const sendEmailResponse = await FirebaseEmail.sendMail(
      FirebaseEmail.paymentConfirmation({
        event: eventData.eventName,
        eventDate: eventData.eventDate,
        itemsPaidFor: itemsPaidFor,
        totalPayment: `$0`,
        userName: authState.userCol.userName,
        toUids: authState.userId,
      })
    );
    return sendEmailResponse.id;
  };

  const paymentOnPress = async () => {
    try {
      // const isNotChecked = feesModel.allContestTypeFees.every(i => !i.isSelected);
      // if (isNotChecked) {
      //     return Alert.alert('Message', 'Please Select Contest Fees for Event');
      // }
      setLoader(true);
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
      setSelectedFeesType(firebaseSaveData);
      console.log("FIREBASE_SAVE_TEST_22 - ", JSON.stringify(firebaseSaveData));

      let firstCheckFee = feesModel.getTotal(true).selectedTotalFees;
      if (firstCheckFee == 0) {
        await createPlayerProfileEntry();
        await saveFeesDataToFirebase(firebaseSaveData);
        await sendEmailToUser();
        setLoader(false);
        setTimeout(() => {
          props.navigation.navigate("EPConfirmationScreen", {
            eventData,
            selectedFeesData: firebaseSaveData,
          });
        }, 200);
        return;
      }
      setLoader(false);

      setTimeout(() => {
        console.log("new pay info --> ", JSON.stringify(currentPayInfo));
        props.navigation.navigate("EventInfoStack", {
          screen: "EPCreditCardScreen",
          params: {
            eventData: eventData,
            selectedFeesData: firebaseSaveData,
            feesModel: feesModel,
            saveFeesDataToFirebase: () => {
              saveFeesDataToFirebase(firebaseSaveData);
            },
            paymentIntent: () => {
              createPaymentInit();
            },
            currentPayInfo: currentPayInfo,
          },
        });
        //createPaymentInit();
        //setStripeModel(true);
      }, 500);

      return false;
    } catch (error) {
      setLoader(false);
      setTimeout(() => {
        Alert.alert("Message", "Something went wrong - Event Payment Screen!");
      }, 200);
    }
  };

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

  const getTotalAmount = () => {
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
        total += parseInt(i.userContestPaidAmount / 100);
      }
    });

    return total;
  };

  const createPaymentInit = async () => {
    try {
      console.log("Seleted Charity Data --> ", feesModel?.selectedCharityData);
      const env = stripeProduction ? "PRODUCTION" : "SANDBOX";
      let PaymentIntent = {};
      await fetch(
        `https://us-central1-players-recreation-league.cloudfunctions.net/function-1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number(feesModel.getTotal(true).selectedTotalFees) * 100,
            type: env,
            description: `PRLm - ${eventData.eventName} - ${
              feesModel?.selectedCharityData?.charityName
                ? feesModel?.selectedCharityData?.charityName
                : eventData?.charityData?.charityName
            } -${authState.userCol.email}`,
            secretKey: stripeProduction
              ? currentPayInfo.productionSecretKey
              : currentPayInfo.sandboxSecretKey,
          }),
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((ResJson) => {
          console.log("JSon Response 2 --> ", ResJson);
          PaymentIntent = ResJson.data;
        });

      const { error: errorInitPaymentSheet } = await initPaymentSheet({
        paymentIntentClientSecret: PaymentIntent.client_secret,
        applePay: false,
        googlePay: false,
        merchantDisplayName: "PRL",
      });
      if (errorInitPaymentSheet) {
        throw { error: errorInitPaymentSheet };
      }

      const { error } = await presentPaymentSheet({
        clientSecret: PaymentIntent.client_secret,
      });

      if (error && error?.code == "Canceled") {
        return;
      }
      if (error && error?.code != "Canceled") {
        throw { error: error };
      }
      await onCardEntryComplete({});
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const CharityDropDownComponent = () => {
    return (
      <CustomModalDropDown
        ref={formsRef.current.charityData}
        onSelect={(charity) => {
          setFeesModel(feesModel.update("selectedCharityData", { ...charity }));
          const PaymentData = allPaymentConfig.find(
            (s) => s.charityID == charity.charityID
          );
          const UniversalPaymentData = allPaymentConfig.find(
            (s) => s.charityID == 0
          );
          let usingPaymentData = {};
          if (PaymentData && PaymentData.enablePaymentProcessing) {
            usingPaymentData = PaymentData;
            setPayCharity(charity.charityID);
          } else {
            usingPaymentData = UniversalPaymentData;
            setPayCharity(0);
          }
          let HostInfo = new PaymentHostInfo(usingPaymentData);
          HostInfo.initPaymentInfoProcess();
          let host = HostInfo.getActivePaymentHosts();
          let hostPayInfo = HostInfo.getCurrentPaymentInfo();
          if (host[0] == "Square") {
            return Alert.alert("Message", "Select another Charity");
          } else if (host[0] == "Stripe") {
            if (stripeProduction) {
              setPaymentMode(host[0]);
              setCurrentPayInfo(hostPayInfo);
            } else {
              setPaymentMode(host[0]);
              setCurrentPayInfo(hostPayInfo);
            }
          }
          setFeesModel(feesModel.update("selectedCharityData", { ...charity }));
        }}
        width={getWp(240)}
        height={getHp(37)}
        items={feesModel?.allCharityData?.length > 0 ? charityData : []}
        placeholder={
          feesModel?.selectedCharityData?.charityName
            ? feesModel?.selectedCharityData?.charityName
            : "Select"
        }
      />
    );
  };

  return (
    <Root childViewStyle={Styles.childViewStyle}>
      <LoaderComponent />
      <Spinner visible={feesModel.loading} />
      <KeyboardAwareScrollView contentContainerStyle={Styles.container}>
        <Header
          hideMenu
          heading={`Payment Overview`}
          menuOnPress={() => props.navigation.openDrawer()}
          leftOnPress={() => props.navigation.goBack()}
        />
        <StaticEventImageHeader
          eventImageURI={eventData?.eventLogo}
          eventName={eventData?.eventName}
          date={getFromToDate(eventData.eventDate, eventData.eventDateEnd)}
          charity={eventData?.charityData?.charityName}
          containerStyle={Styles.staticEventImageContainerStyle}
          renderCharityDropDown={eventData?.charityID == 0}
          CharityDropDownComponent={CharityDropDownComponent}
        />
        <TripleHeading
          left={eventData?.eventSubCategory}
          center={eventData?.eventGenre}
          right={eventData?.eventCategory}
          containerStyle={Styles.tripleHeadingContainer}
        />
        <TextInputHeading
          heading={"Payment Terms"}
          placeholder={"Type Payment Terms..."}
          value={eventData?.eventPaymentTerms || " "}
          editable={false}
          onChangeText={() => {}}
          textInputStyle={{ height: getHp(140) }}
        />
        <CollapsibleViewWithHeading
          defaultCollapseValue={false}
          heading={"See Details"}
          // collapseStyle={{ minHeight: getHp(300) }}
          containerStyle={{ marginTop: getHp(30) }}
        >
          {feesModel.allContestTypeFees.map((cFees, index) => {
            return (
              <EventFeesInputRow
                isAlreadyPaid={cFees.isAlreadyPaid}
                editable={false}
                text={cFees?.contestName || ""}
                value={"" + cFees?.eventContestFeeCents / 100}
                selectable
                isSelected={cFees.isSelected}
                onPress={() => {
                  setFeesModel(
                    feesModel.pressBtns(cFees, index, "allContestTypeFees")
                  );
                }}
              />
            );
          })}

          {feesModel.allEventTypeFees.map((eFees, index) => {
            return (
              <EventFeesInputRow
                isAlreadyPaid={eFees.isAlreadyPaid}
                editable={false}
                text={eFees?.contestName || ""}
                value={"" + eFees?.eventContestFeeCents / 100}
                selectable
                isSelected={eFees.isSelected}
                onPress={() => {
                  setFeesModel(
                    feesModel.pressBtns(eFees, index, "allEventTypeFees")
                  );
                }}
                renderIncluded={
                  eFees.contestName == "Spectator" &&
                  feesModel.isSpectatorMode.mode &&
                  feesModel.conditionCheck()
                }
              />
            );
          })}

          <View style={{ height: getHp(10) }} />
        </CollapsibleViewWithHeading>
        <View style={Styles.feeSummaryContainer}>
          <Text style={Styles.feeSummaryTextStyle}>Fee Summary</Text>
          <Text style={Styles.feeSummaryTextStyle}>
            Total: {feesModel.getTotal()}
          </Text>
        </View>

        {feesModel.shouldRenderPayButton() && (
          <TouchableButton
            title={feesModel.getPayButtonText()}
            type={"paymentBTN"}
            containerStyle={Styles.creaditCartStyle}
            onPress={() => {
              if (
                eventData.charityID == 0 &&
                Object.keys(feesModel.selectedCharityData).length == 0
              ) {
                return Alert.alert("Message", "Select the Charity");
              }
              return paymentOnPress();
            }}
            //onPress={() => sendEmailToUser()}
          />
        )}

        <View style={{ marginVertical: 20 }} />
      </KeyboardAwareScrollView>
    </Root>
  );
};

export default EventFees;
