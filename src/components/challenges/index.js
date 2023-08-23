import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar
} from "react-native";

import { firebase } from '../../firebase';
import 'firebase/firestore';

import Feather from "react-native-vector-icons/Feather";
import ArrowRightImage from '@assets/arrow_right.png';

Feather.loadFont();

const ChallengeHistoryView = (props) => {

  const { navigation } = props;

  const [refreshing, setRefreshing] = useState(false);
  const [me, setMe] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [eventPointProfiles, setEventPointProfiles] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const splitEventIdsArray = (eventIds) => {
    if (eventIds.length > 0) {
      let splittedIds = [];
      let seeker = 0;
      while(seeker < eventIds.length) {
        let elementSplitIds = [];
        for (let idx = 0; idx < 10; idx++) {
          if (seeker + idx < eventIds.length) {
            elementSplitIds.push(eventIds[seeker + idx]);
          }
        }

        splittedIds.push(elementSplitIds);
        seeker = seeker + 10;
      }
      return splittedIds;
    } else {
      return [];
    }
  }

  const loadEvents = async (eventIds) => {
    let eventSplittedIdsArray = splitEventIdsArray(eventIds);
    let evs = [];
    let eventPointBallances = [];
    const promises = eventSplittedIdsArray.map(async idsArray => {
      const querySnapshot = await firebase.firestore().collection("events")
        .where("eventID", "in", idsArray)
        .get();
      
      querySnapshot.forEach(documentSnapshot => {
        let event = documentSnapshot.data();
        evs = [...evs, event];
      });

      const eventBallanceQuerySnapshot = await firebase.firestore().collection("playerEventChallengePoints")
        .where("eventID", "in", idsArray)
        .where("userID", "==", me.uid)
        .get();

      eventBallanceQuerySnapshot.forEach(documentSnapshot => {
        let eventBallanceProfile = documentSnapshot.data();
        eventPointBallances = [...eventPointBallances, eventBallanceProfile];
      });
    });
    
    await Promise.all(promises);
    console.log("eventPointBallances", eventPointBallances);
    
    setAllEvents(evs.filter(ev => ev.eventID !== undefined && ev.eventID !== "" && false !== ev.eventChallengesEnabled).sort((event1, event2) => event1.eventName > event2.eventName));
    setEventPointProfiles(eventPointBallances);
  };

  const findEventPointData = (eventID) => {
    const pointSummaryData = eventPointProfiles.find(data => data.eventID === eventID);
    if (pointSummaryData === undefined) {
      return {};
    } else {
      return pointSummaryData;
    }
  }

  const eventTotalPoints = (eventID) => {
    let eventData = findEventPointData(eventID);
    if (eventData === undefined) {
      return 0
    } else {
      return eventData.totalPoints;
    }
  }

  const eventAvailablePoints = (eventID) => {
    let eventData = findEventPointData(eventID);
    if (eventData === undefined) {
      return 0
    } else {
      return eventData.availablePoints;
    }
  }

  const loadMyEvents = async () => {
    const userContestsQuery = await firebase.firestore().collection("userEnteredContests")
      .where("userID", "==", me.uid)
      .get();

    let myEventIds = [];
    
    userContestsQuery.forEach(documentSnapshot => {
      const userContest = documentSnapshot.data();
      const eventId = userContest.eventID;
      if (eventId !== undefined && !myEventIds.includes(eventId)) {
        myEventIds = [...myEventIds, eventId];
      }
    });

    console.log("My event ids => ", myEventIds);
    await loadEvents(myEventIds);
    setLoadingData(false);
    setRefreshing(false);
  };

  const renderEvent = (event) => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <TouchableOpacity style={{ height: 120 }}
          onPress={() => {
            navigation.navigate('Event Challenges Summary', {
              event: event,
              eventPointsSummary: findEventPointData(event.eventID)
            })
          }}>
          <View style={{ height: '100%', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 60, height: 60, backgroundColor: '#C4C4C4', marginLeft: 15 }}>
              <Image source={{ uri: event.eventLogo }} style={{width: 60, height: 60}} />
            </View>
            <View style={{ flex: 1, flexDirection: 'column', marginTop: 20, marginBottom: 20, marginLeft: 15, marginRight: 15, flexShrink: 1}}>
              <Text style={{ fontSize: 20, fontWeight: 'bold'}}>{ event.eventName }</Text>
              {/* <Text style={{ flex: 1, fontSize: 16}} numberOfLines={1}>{ event.eventDescription }</Text> */}
              <View style={{ flexDirection: 'row', marginTop: 10}}>
                <TouchableOpacity style={{
                  backgroundColor: '#0B214D', 
                  height: 30, 
                  width: 80, 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color:'white', 
                  borderRadius: 5}}
                  onPress={() => {
                    navigation.navigate("Event Challenges List", {
                      event: event,
                      show: 'all'
                    });
                  }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>Picks</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  marginLeft: 15,
                  backgroundColor: '#0B214D', 
                  height: 30, 
                  width: 80, 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color:'white', 
                  borderRadius: 5}}
                  onPress={() => {
                    navigation.navigate("Event Score Board", {
                      event: event,
                      show: 'all'
                    });
                  }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>Scores</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={{marginRight: 15, fontWeight: 'bold'}}>
              { eventAvailablePoints(event.eventID) }Pt
            </Text>
            <Image source={ArrowRightImage} style={{tintColor:'black', marginRight: 15}} tintColor='black'/>
          </View>
        </TouchableOpacity>
        <View style={{height: 1, backgroundColor: 'rgba(0,0,0,0.2)'}} />
      </View>
    );
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("my user id => ", user.uid);
        setMe(user);
      } else {
        console.log("auth current user is Invalid");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (me) {
      loadMyEvents();
    }
  }, [me]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ width: "100%", backgroundColor:'white', alignSelf: "center", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: 15, paddingRight: 0 }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Feather name="menu" size={25} color={'#000'} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center', marginRight: 25 }}>
          Pick History
        </Text>
      </View>
      {loadingData ? 
        <ActivityIndicator />
      : 
      <FlatList
        style={{ marginTop: 10 }}
        data={ allEvents }
        renderItem={(item) => renderEvent(item.item)}
        keyExtractor={(item) => item.eventID}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => {
              setRefreshing(true);
              loadMyEvents();
            }} />
        }/>
      }
    </SafeAreaView>
  );
};

export default ChallengeHistoryView;