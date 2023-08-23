import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";

import { firebase } from '../../firebase';
import BackImg from '@assets/arrow_left.png';
import 'firebase/firestore';
import ArrowForwardImage from '@assets/arrow_forward.png';
import { ActivityIndicator } from "react-native";

const EventScoreBoardView = ({ navigation, route }) => {

  const [me, setMe] = useState(null);
  const [userIdsLoaded, setUserIdsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(route.params.event);
  const [userIdsInEvent, setUserIdsInEvent] = useState([]);
  const [eventUserProfiles, setEventUserProfiles] = useState([]);
  const [scores, setScores] = useState([]);

  const splitIdsArray = (ids) => {
    if (ids.length > 0) {
      let splittedIds = [];
      let seeker = 0;
      while (seeker < ids.length) {
        let elementSplitIds = [];
        for (let idx = 0; idx < 10; idx++) {
          if (seeker + idx < ids.length) {
            elementSplitIds.push(ids[seeker + idx]);
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

  const loadUserData = async () => {
    const userIdArraysArray = splitIdsArray(userIdsInEvent);
    let users = [];
    const promises = userIdArraysArray.map(async idsArray => {
      const querySnapshot = await firebase.firestore().collection("users")
        .where("uid", "in", idsArray)
        .get();
      
      querySnapshot.forEach(documentSnapshot => {
        let user = documentSnapshot.data();
        users = [...users, user];
      });
    });
    
    await Promise.all(promises);

    let sortedUsers = users.sort((user1, user2) => {
      const score1 = scores.find(score => score.userID == user1.uid);
      const score2 = scores.find(score => score.userID == user2.uid);

      console.log("comparing scores => ", score1, score2);

      const totalScore1 = score1 === undefined ? 0 : (score1.totalPoints === undefined ? 0 : score1.totalPoints);
      const totalScore2 = score2 === undefined ? 0 : (score2.totalPoints === undefined ? 0 : score2.totalPoints);

      const availableScore1 = score1 === undefined ? 0 : (score1.availablePoints === undefined ? 0 : score1.availablePoints);
      const availableScore2 = score2 === undefined ? 0 : (score2.availablePoints === undefined ? 0 : score2.availablePoints);

      if (totalScore1 > totalScore2) {
        return -1;
      } else if (totalScore1 < totalScore2) {
        return 1;
      } else {
        return availableScore1 > availableScore2 ? -1 : 1;
      }
    });
    setEventUserProfiles(sortedUsers);
    
    setLoading(false);
  }

  const loadScores = async () => {
    const pointData = await firebase.firestore().collection("playerEventChallengePoints")
      .where("eventID", "==", event.eventID)
      .get();
    
    let eventUserIds = [];
    let scoreData = [];

    pointData.forEach(documentSnapshot => {
      const point = documentSnapshot.data();
      const userId = point.userID;
      scoreData = [...scoreData, point];
      if (userId !== undefined && !eventUserIds.includes(userId)) {
        eventUserIds = [...eventUserIds, userId];
      }
    });
    
    setUserIdsInEvent(eventUserIds);
    setScores(scoreData);
    setUserIdsLoaded(true);
  }

  useEffect(() => {
    if (userIdsLoaded) {
      loadUserData();
    }
  }, [scores, userIdsInEvent, userIdsLoaded]);

  const findUserScore = (userId) => {
    const score = scores.find(score => score.userID == userId);
    if (score === undefined) {
      return "0/0"
    } else {
      return `${score.availablePoints} / ${score.totalPoints}pt`
    }
  }

  const renderUser = (userItem) => {
    return (
      <View style={{ flexDirection: 'column', backgroundColor: userItem.item.uid === me.uid ? 'rgba(0, 0, 0, 0.1)' : 'transparent'}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 60, paddingRight: 20 }}>
          <Text style={{ marginLeft: 20 }}>#{userItem.index + 1}</Text>
          <TouchableOpacity 
            style={{ width: 40, height: 40, marginLeft: 10, backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 20 }}>
              {(userItem.item.userAvatar !== undefined && userItem.item.userAvatar !== '') && 
                <Image style={{ width: 40, height: 40, borderRadius: 20 }}
                  source={{uri: userItem.item.userAvatar}} />
              }
          </TouchableOpacity>
          <Text style={{ flex: 1, marginLeft: 15 }}>{ userItem.item.userName }</Text>
          <Text>{findUserScore(userItem.item.uid)}</Text>
        </View>
        <View style={{height: 1, backgroundColor: 'rgba(0,0,0,0.2)'}} />
      </View>
    );
  };

  const renderHeaderView = useCallback(() => (
    <View style={{ flexDirection: 'column'}}>
      <Text style={{marginLeft: 15, marginTop: 15, width: '100%'}}>
        Your points - <Text style={{fontWeight: 'bold'}}>{findUserScore(me.uid)}</Text>
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
        <Text style={{marginLeft: 15, flex: 1}}>Challenge Scoreboard</Text>
        <Text style={{fontWeight: 'bold', marginRight: 15}}>Avail./Total</Text>
      </View>
      
    </View>
  ), [eventUserProfiles, loading]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setMe(user);
      } else {
        console.log("auth current user is Invalid");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setEvent(route.params.event);
  }, [route.params.event]);

  useEffect(() => {
    if (me) {
      loadScores();
    }
  }, [me, event]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ height: 40, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image style={{ tintColor: 'black' }} source={BackImg} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: 'black', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
          {route.params.event.eventName}
        </Text>
        <TouchableOpacity style={{ width: 40, height: 40 }}
          onPress={() => {
          }}>
        </TouchableOpacity>
      </View>
      {!loading ? 
        <View style={{ flexDirection: 'column', flex: 1}}>
          <FlatList 
            style={{ flex: 1}}
            data={ eventUserProfiles }
            ListHeaderComponent={ renderHeaderView() }
            renderItem={(item) => renderUser(item)}
            keyExtractor={(item) => item.uid}
           />
        </View>
      :
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      }
      
    </SafeAreaView>
  );
};

export default EventScoreBoardView;