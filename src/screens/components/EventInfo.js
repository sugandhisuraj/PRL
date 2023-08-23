import React, { Fragment, useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';

//Import Custom Component
import HeaderSection from "../EventInfoDetail/HeaderSection";
import EventDetail from "../EventInfoDetail/EventDetail";
import EventDesc from "../EventInfoDetail/EventDesc";
import ContestDetails from "../EventInfoDetail/ContestDetails";
import ParticipationSection from "../EventInfoDetail/ParticipationSection";
import Gallery from "../EventInfoDetail/Gallery";
import {
  StaticEventImageHeader
} from '@component';
import {
  getFromToDate,
  getHp
} from '@utils';
import {
  firebase,
  playerEventProfileCollection,
  eventsCollection,
  contestsCollection,
  charitiesCollection
} from "../../firebase";

const EventInfo = (props) => {
  const [eventDetail, setEventDetails] = useState({});
  const [contestData, setContestData] = useState([]);
  const [loader, setLoader] = useState(true);
  const getEventData = async () => {
    try {
      //setLoader(true);
      const currentEventData = props.route.params?.eventData || undefined;
      if (currentEventData) {
        let contestData = [];
        console.log('SINGLE_ID_TEST - ', currentEventData.id);
        const eventCollectionResponse = await eventsCollection.doc(currentEventData.id).get();
        console.log('EVENT_SINGLE_RESPONSE - ', eventCollectionResponse.data());
        const contestCollectionResponse = await contestsCollection.get();
        const charitiesCollectionResponse = await charitiesCollection.get();
        let charityData = {};
        charitiesCollectionResponse.docs.map(snap => {
          let currentData = snap.data();
          if (eventCollectionResponse.data()?.charityID == currentData?.charityID) {
            charityData = { ...currentData };
          }
        });
        contestCollectionResponse.docs.map((snap) => {
          let currentData = snap.data();
          if (currentData.eventID == currentEventData.eventID) {
            contestData.push(currentData);
          }
        });
        setContestData(() => contestData);
        setEventDetails(() => ({
          ...eventCollectionResponse.data(),
          charityData,
          contestData: contestData
        }));
        setLoader(false);
      } else {
        setLoader(false);
        setTimeout(() => {
          Alert.alert("Message", "Something went wrong!");
        }, 200);

      }
    } catch (error) {
      console.log('ERROR_ON_EVENTINFO - ', error);
      setTimeout(() => {
        Alert.alert("Message", "Something went wrong!");
      }, 200);

    }
  }
  useEffect(() => {
    getEventData();
  }, [props?.route?.params]); 

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps={"always"}
      style={styles.scrollView}
    >
      <Spinner visible={loader} />

      {
        !loader &&
        <Fragment>
          <HeaderSection data={{...eventDetail}} navigation={props.navigation} />
          <StaticEventImageHeader
            eventImageURI={eventDetail.eventLogo}
            eventName={eventDetail.eventName}
            date={getFromToDate(eventDetail.eventDate.length!==0 && eventDetail.eventDateEnd.length!==0 ? eventDetail.eventDate : "", eventDetail.eventDateEnd.length!==0 && eventDetail.eventDate.length!==0 ? eventDetail.eventDateEnd : "" )}
            charity={eventDetail?.charityData?.charityName || ''}
            containerStyle={styles.staticEventImageContainerStyle}
          />
          <EventDesc data={eventDetail} />
          <ContestDetails data={eventDetail} ContestData={contestData} navigation={props.navigation} />
          <ParticipationSection data={eventDetail} navigation={props.navigation} />
          <Gallery data={eventDetail} />
          <View style={styles.spacingView} />
        </Fragment>
      }
    </ScrollView>

  );
}


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFF",
  },
  spacingView: {
    marginVertical: 20
  },
  staticEventImageContainerStyle: {
    marginVertical: getHp(20)
  }
});

export default EventInfo;
