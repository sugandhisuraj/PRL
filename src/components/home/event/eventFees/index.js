import React, { Fragment, useState, useEffect } from "react";
import { ScrollView, View, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Header,
  Root,
  StaticEventImageHeader,
  TripleHeading,
  TextInputHeading,
  CollapsibleViewWithHeading,
  TouchableButton,
  EventFeesInputRow,
  EventFeesTypeInputRow,
  CreateEventProgress
} from "@component";
import Styles from "./indexCss";
import EventFeesModel from "./EventFees.model";
import { getFromToDate, getHp, getWp, FONTSIZE } from "@utils";
import { useLoader, useFirebaseUpload } from "@hooks";
import {
  eventContestFeeTypesCollection,
  db,
  eventContestFeesCollection,
  eventsCollection,
  userEnteredContestsCollection
} from "../../../../firebase";
import { updateEventModel } from "../../../../store/actions";
import { transformFirebaseValues, getLargeNum } from '@utils';
import Spinner from 'react-native-loading-spinner-overlay';

const EventFees = (props) => {
  var { convertToBlob, uploadBlobToFirebase } = useFirebaseUpload();
  var { firebaseAllCollectionData, auth } = useSelector(s => s);
  const eventModalProps = useSelector((state) => state.event.eventModel);
  const setEventModel = (newEventModel) => {
    dispatch(updateEventModel(newEventModel));
  };
  const [eventFeesModel, setEventFeesModel] = useState(() => EventFeesModel);
  const [setLoader, LoaderComponent] = useLoader();
  const dispatch = useDispatch();

  const loadData = async () => {
    const eventContestData = await eventContestFeeTypesCollection.get();
    setEventFeesModel(eventFeesModel.loadContent(eventContestData, eventModalProps));
  };
  useEffect(() => {
    loadData();
  }, []);

  const saveEventRemainFeilds = async () => {
    try {
      const remainFields = eventModalProps.saveRemainFields();
      const updatedRemainFields = await eventsCollection.doc(remainFields.id).update(remainFields.data);
      return updatedRemainFields;
    } catch (error) {
      console.log('ERROR_REMAIN_SAVE_FIELDS - ', error);
      throw new Error(error);
    }
  }
  const addedEntrytoUserEnteredCollection = async () => {
    try {
      const getData = await userEnteredContestsCollection.get();
      const transData = transformFirebaseValues(getData, 'userEnteredContestID');
      let savedId = getLargeNum(transData, 'userEnteredContestID'); 
      let userContestColEntry = {
        contestID: eventFeesModel.allContestCreated[0].uploadedData.contestID,
        //contestName: eventFeesModel.allContestCreated[0].uploadedData.contestName,
        contestName: 'HOST',
        eventID: eventModalProps.EventFormFields.eventID,
        userContestPaidAmount: parseInt(eventFeesModel.allContestCreated[0].fees) * 100,
        userContestPaidStatus: 'Paid',
        userContestParticipationType: 'Host',
        userContestSignupDate: new Date().toString(),
        userEnteredContestID: ++savedId,
        userID: auth.userId
      }
      console.log('ENTRY_USER_ENTERED_COLL - ', JSON.stringify(userContestColEntry));
      let savedContestCol = await userEnteredContestsCollection.add(userContestColEntry);
      return savedContestCol.id;
    } catch (error) {
      console.log('ERROR_USER_ENTERED_CONTEST - ', error);
      throw new Error(error);
    }

  };
  const onEventFeeCreateHandler = async () => {
    try {
      setLoader(true);
      //Saving Event Profile Data
      const isProfileCreated = await props.route.params.saveProfile();
      console.log('EVENT_PROFILE_CREATED - ', isProfileCreated.id);
      //Saving Event Fees Data
      let eventFeeData = eventFeesModel.getDataForFirebase(
        eventModalProps
      );
      console.log('EVENT_FEES_DATA_TEST_FLOAT - ', JSON.stringify(eventFeeData)); 
      let batch = db.batch();
      eventFeeData.forEach((doc) => {
        let docRef = eventContestFeesCollection.doc();
        batch.set(docRef, doc);
      });
      await batch.commit();
      //Saving Event Fees Data Finish

      //Add entry to the UserEntered Collection
      await addedEntrytoUserEnteredCollection();
      //Added entry to the UserEntered Collection 

      // Saving Event Data termsdata
      await saveEventRemainFeilds();

      //Reseting the forms
      setEventFeesModel(eventFeesModel.resetFeesModel());
      //clear profileModel
      props.route.params.clearProfileModal();
      //clear event model
      setEventModel(eventModalProps.resetEventModalForm(true));
      //Resting the forms

      setLoader(false);
      setTimeout(() => {
        Alert.alert('Message', 'Event Successfully Created', [
          {
            text: 'Okay',
            onPress: () => {
              props.navigation.navigate('CreateEventScreen', {
                resetForm: true
              });
            }
          }
        ])
      }, 400);
    } catch (error) {
      console.log('ERROR_EVENT_FEE_CREATE_HANDLER - ', error);
      setLoader(false);
      setTimeout(() => {
        Alert.alert('Message', 'Something went wrong!');
      }, 300);
    }
  };
  return (
    <Root childViewStyle={Styles.childViewStyle}>
      <LoaderComponent />
      <Spinner visible={eventFeesModel.spinner} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={Styles.container}>
        <Header
          hideMenu
          heading={"Create Event - Enter Event Fees"}
          menuOnPress={() => props.navigation.openDrawer()}
          leftOnPress={() => props.navigation.goBack()}
        />
        <StaticEventImageHeader
          eventImageURI={eventModalProps.EventFormFields.eventLogo}
          eventName={eventModalProps.EventFormFields.eventName}
          date={getFromToDate(
            eventModalProps.EventFormFields.eventDate,
            eventModalProps.EventFormFields.eventDateEnd
          )}
          charity={eventModalProps.selectedCharityData.charityName || ""}
          containerStyle={Styles.staticEventImageContainerStyle}
        />
        <TripleHeading
          left={eventModalProps.EventFormFields?.eventCategory || ""}
          center={eventModalProps.EventFormFields?.eventGenre || ""}
          right={eventModalProps.EventFormFields.eventSubCategory || ""}
          containerStyle={Styles.tripleHeadingContainer}
        />
        <TextInputHeading
          heading={"Payment Terms"}
          placeholder={"Type Payment Terms..."}
          value={eventModalProps.EventFormFields.eventPaymentTerms}
          onChangeText={(eventPaymentTerms) => {
            setEventModel(
              eventModalProps.updateEventForm("eventPaymentTerms", eventPaymentTerms)
            );
          }}
        />
        <CollapsibleViewWithHeading
          defaultCollapseValue={false}
          heading={"Enter Participation Fees"}
          // collapseStyle={{ minHeight: getHp(300) }}
          containerStyle={{ marginTop: getHp(30) }}
        >
          {
            eventFeesModel?.allContestCreated.length > 0 && 
            eventFeesModel?.allContestCreated?.map((i, index) => {
              return (
                <EventFeesInputRow
                  //text={eventModalProps?.selectedEventContestType?.contestType || ''}
                  text={i.uploadedData.contestName}
                  value={i.fees}
                  onChangeText={(contestFee) =>
                    setEventFeesModel(eventFeesModel.updateAllContestFee(contestFee, index))
                  }
                />
              );
            })
          }

          {eventFeesModel.eventContestFeeTypes.map((feeType, index) => {
            return (
              <EventFeesTypeInputRow
                checked={feeType.isSelected}
                text={feeType.value}
                value={feeType.eventContestFeeCents}
                onChangeText={(fees) => {
                  setEventFeesModel(
                    eventFeesModel.onChangeTextEventContestFeeTypes(index, fees)
                  );
                }}
                onCheckboxPress={() => {
                  setEventFeesModel(
                    eventFeesModel.onSelectEventContestFeeTypes(index)
                  );
                }}
              />
            );
          })}
          <View style={{ height: getHp(10) }} />
        </CollapsibleViewWithHeading>

        {/* <CollapsibleViewWithHeading
          heading={"Finish Payment Setup"}
          containerStyle={Styles.paymentSetupContainer}
          headingTextStyle={Styles.paymentSetupHeadingTextStyle}
          headingContainerStyle={Styles.paymentheadingContainerStyle}
        > */}

        <TextInputHeading
          containerStyle={{ marginTop: 40 }}
          heading={"Charity Thank You Note"}
          placeholder={"Type charity thank you note..."}
          value={eventModalProps.EventFormFields.eventThankYou}
          onChangeText={(eventThankYou) => {
            setEventModel(
              eventModalProps.updateEventForm("eventThankYou", eventThankYou)
            );
          }}
        />
        <TextInputHeading
          containerStyle={{ marginBottom: 20 }}
          textInputStyle={{ height: getHp(100) }}
          heading={"Event Information"}
          placeholder={
            "Type event information (starting date, when game schedules will be issued, any instructions)... "
          }
          value={eventModalProps.EventFormFields.eventInformation}
          onChangeText={(eventInformation) => {
            setEventModel(
              eventModalProps.updateEventForm("eventInformation", eventInformation)
            );
          }}
        />
        {/* </CollapsibleViewWithHeading> */}

        {/* <View style={Styles.bottomButtonsTray}>
          <TouchableButton
            type={"small"}
            backgroundColor={"#EC2939"}
            // title={eventFeesModel.getCreateBtnTitle()}
            title={"Save"}
            onPress={onEventFeeCreateHandler}
          />
          <TouchableButton
            type={"small"}
            backgroundColor={"#EDCF80"}
            title={"Clear"}
          /> 
          <TouchableButton
            type={"small"}
            backgroundColor={"#0B214D"}
            title={"Cancel"}
          />
        </View> */}

        <View style={Styles.bottomButtonsTray}>
          <TouchableButton
            type={"prevStep"}
            title={"Previous Step"}
            onPress={() => props.navigation.goBack()}
          />
          <View style={{ width: getWp(20) }} />
          <TouchableButton
            type={"nextStep"}
            title={"Finish"}
            onPress={onEventFeeCreateHandler}
            titleStyle={{ fontSize: FONTSIZE.Text16 }}
          />


        </View>
        <CreateEventProgress
          containerStyle={{ marginTop: getHp(25), marginBottom: getHp(40) }}
          selectedIndex={4}
        />
      </KeyboardAwareScrollView>
    </Root>
  );
};

export default EventFees;
