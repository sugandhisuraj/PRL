import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";

import { firebase } from '../../../firebase';
import 'firebase/firestore';

const AudienceModeView = (props) => {

  const unsubscribeRef = useRef();

  const [gameChallenges, setGameChallenges] = useState();

  const loadMyChallenges = async () => {

    if (unsubscribeRef?.current) {
      console.log("unsubscribed snapshot in AudienceView.");
      unsubscribeRef?.current();
    }

    unsubscribeRef.current = firebase.firestore().collection("challenges")
      .where("users", "array-contains", firebase.auth().currentUser.uid)
      .where("gameScheduleId", "==", props.gameScheduleId)
      .onSnapshot(async snapshot => {
        let challenges = [];
        for (const doc of snapshot.docs) {
          let challenge = doc.data();
          if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
            if (challenge.opponent !== "all") {
              let playerRef = firebase.firestore().collection("users").doc(challenge.opponent)
              let playerSnap = await playerRef.get();
              if (playerSnap.exists) {
                challenge.opponentEmail =  playerSnap.data().email;
              }
            }
          } else {
            let playerRef = firebase.firestore().collection("users").doc(challenge.challengeSenderId)
            let playerSnap = await playerRef.get();
            if (playerSnap.exists) {
              challenge.opponentEmail =  playerSnap.data().email;
            }
          }
          challenges = [...challenges, challenge];
        }
        console.log("got challenges of mine", challenges.length);
        setGameChallenges(challenges);
      });
  };

  useEffect(() => {
    loadMyChallenges();

    return () => {
      if (unsubscribeRef?.current) {
        console.log("unsubscribed snapshot in AudienceView componentWillUnmount.");
        unsubscribeRef?.current();
      }
    }
  }, []);

  const renderItem = (challenge) => {
    return (
      <View style={{ height: 40, borderColor: 'rgba(0, 0, 0, 0.1)', borderRadius: 5, borderWidth: 1, marginTop: 5, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', flex: 1}}>
          {challenge.points}
          {challenge.challengeGameWinnerId === props.player1Id ? props.player1Name : props.player2Name} Win
        </Text>
        <Text style={{flex: 1, fontWeight: 'bold', color: 'red', textAlign: 'center'}}>
          {challenge.points}pt
        </Text>
        <Text style={{flex: 2, textAlign: 'center', fontSize: 12}}>
          {challenge.opponent === 'all' ? 'Open to All' : challenge.opponentEmail.substring(0, challenge.opponentEmail.lastIndexOf("@"))}
        </Text>
        {challenge.status == "pending" && 
          <View style={{height: 20, width: 60, backgroundColor: 'red', borderRadius: 10, overflow:'hidden', justifyContent: 'center'}}>
            <Text style={{fontSize: 12, fontWeight: 'bold', color: 'white', textAlign: 'center'}}>
              Pending
            </Text>
          </View>
        }
      </View>
    );
  }


  return (
    <View style={{ flex: 1 }}>
      {(!gameChallenges || gameChallenges.length == 0) ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text>
            There seems to be no picks now.
          </Text>
          <TouchableOpacity style={{ backgroundColor: 'red', width: 160, height: 50, justifyContent: 'center', marginTop: 10, borderRadius: 25 }}
            onPress={props.onCreateChallenge}>
            <Text style={{ textAlign: 'center', color: 'white' }}>
              Create Pick
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList 
          data={gameChallenges}
          renderItem={(item) => renderItem(item.item) }
          keyExtractor={(item) => item.id}/>
      )}
    </View>
  );
}

export default AudienceModeView;