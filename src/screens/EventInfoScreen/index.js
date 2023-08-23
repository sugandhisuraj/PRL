import React, { Fragment, useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

//Import Custom Component
import HeaderSection from "../EventInfoDetail/HeaderSection";
import EventDetail from "../EventInfoDetail/EventDetail";
import EventDesc from "../EventInfoDetail/EventDesc";
import ContestDetails from "../EventInfoDetail/ContestDetails";
import ParticipationSection from "../EventInfoDetail/ParticipationSection";
import Gallery from "../EventInfoDetail/Gallery";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StaticEventImageHeader, Root } from "@component";
import { getFromToDate, getHp } from "@utils";
import {
  contestsCollection,
  eventProfileQuestionsCollection,
} from "../../firebase";
import { useSelector, useDispatch, connect } from "react-redux";
import EventInfoModel from "./eventInfo.model";
import EditEventScreen from "./editEvent";

const EventInfo = (props) => {
  const { firebaseAllCollectionData, auth } = useSelector((s) => s);
  const [eventIModel, setEventIModel] = useState(() => EventInfoModel);
  const [arrow, setArrow] = useState(false);
  const getEventData = async () => {
    try {
      //setLoader(true);
      const currentEventData = props.route.params?.eventData || undefined;
      console.log("TEST_DYNAMIC - ", JSON.stringify(firebaseAllCollectionData));
      if (currentEventData) {
        const firebaseCollectionData = {
          ...firebaseAllCollectionData.firebaseCollectionData,
        };
        const contestCollectionResponse = await contestsCollection
          .where("eventID", "==", currentEventData.eventID)
          .get();
        const playerProfileResponse = await eventProfileQuestionsCollection
          .where("eventID", "==", currentEventData.eventID)
          .get();
        setEventIModel(
          eventIModel.init(
            currentEventData,
            firebaseCollectionData,
            contestCollectionResponse,
            playerProfileResponse
          )
        );
      }
    } catch (error) {
      console.log("ERROR_ON_EVENTINFO - ", error);
      setTimeout(() => {
        Alert.alert("Message", "Something went wrong!");
      }, 200);
    }
  };
  useEffect(() => {
    setEventIModel(eventIModel.onRefresh());
    setTimeout(() => {
      getEventData();
    }, 500);
  }, [props?.route?.params]);

  const onAddContest = () => {
    console.log(
      "CURRENT_EVENT_DATA - ",
      JSON.stringify(eventIModel.currentEventData)
    );
    props.navigation.navigate("AddNewContestScreen", {
      eventIModel: eventIModel,
      setEventIModel: setEventIModel,
    });
  };

  return (
    <Root>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"always"}
        style={styles.scrollView}
      >
        <Spinner visible={eventIModel.loading} />

        {!eventIModel.loading && (
          <Fragment>
            {eventIModel.mode == 0 ? (
              <Fragment>
                <HeaderSection
                  shouldEdit={
                    auth.userCol.userType == "admin"
                      ? true
                      : eventIModel.currentEventData.organizerID == auth.userId
                      ? true
                      : false
                  }
                  onEditPress={() => {
                    setEventIModel(eventIModel.update("mode", 1));
                  }}
                  data={{ ...eventIModel.currentEventData }}
                  navigation={props.navigation}
                />
                <StaticEventImageHeader
                  eventImageURI={eventIModel.currentEventData.eventLogo}
                  eventName={eventIModel.currentEventData.eventName}
                  date={getFromToDate(
                    eventIModel.currentEventData.eventDate.length !== 0 &&
                      eventIModel.currentEventData.eventDateEnd.length !== 0
                      ? eventIModel.currentEventData.eventDate
                      : "",
                    eventIModel.currentEventData.eventDateEnd.length !== 0 &&
                      eventIModel.currentEventData.eventDate.length !== 0
                      ? eventIModel.currentEventData.eventDateEnd
                      : ""
                  )}
                  charity={
                    eventIModel.currentEventData.charityData?.charityName || ""
                  }
                  containerStyle={styles.staticEventImageContainerStyle}
                />
                <EventDesc data={eventIModel.currentEventData} />
                <ContestDetails
                  onAddContest={onAddContest}
                  icon={arrow}
                  onClose={() => setArrow(!arrow)}
                  shouldEdit={
                    auth.userCol.userType == "admin"
                      ? true
                      : eventIModel.currentEventData.organizerID == auth.userId
                      ? true
                      : false
                  }
                  data={eventIModel.currentEventData}
                  ContestData={eventIModel.currentEventData.contestData}
                  navigation={props.navigation}
                />
                <ParticipationSection
                  //shouldNotSignUp={eventIModel.currentEventData.organizerID == auth.userId}
                  shouldNotSignUp={false}
                  data={eventIModel.currentEventData}
                  navigation={props.navigation}
                />
                <Gallery data={eventIModel.currentEventData} />
                <View style={styles.spacingView} />
              </Fragment>
            ) : (
              <EditEventScreen
                eventIModel={eventIModel}
                setEventIModel={setEventIModel}
              />
            )}
          </Fragment>
        )}
      </KeyboardAwareScrollView>
    </Root>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFF",
  },
  spacingView: {
    marginVertical: 20,
  },
  staticEventImageContainerStyle: {
    marginVertical: getHp(20),
  },
});

export default connect()(EventInfo);
