import React, { createRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList
} from "react-native";

import { firebase } from '../../../firebase';
import 'firebase/firestore';

export default class IncomingChallngesListView extends React.Component {

  async loadIncomingChallenges() {

    if (this.unsubscribeRef?.current) {
      console.log("unsubscribed snapshot in IncomingChallengesView.");
      this.unsubscribeRef?.current();
    }

    this.unsubscribeRef.current = firebase.firestore().collection("challenges")
      .where("status", "==", "pending")
      .where("gameScheduleId", "==", this.props.gameScheduleId)
      .where("opponent", "in", [firebase.auth().currentUser.uid, "all"])
      .onSnapshot(async snapshot => {
        let challenges = [];
        for (const doc of snapshot.docs) {
          let challenge = doc.data();
          if (challenge.opponent !== 'all' || !(challenge.declinedUsers !== undefined && challenge.declinedUsers.includes(firebase.auth().currentUser.uid))) {
            if (challenge.challengeSenderId !== firebase.auth().currentUser.uid) {
              let playerRef = firebase.firestore().collection("users").doc(challenge.challengeSenderId)
              let playerSnap = await playerRef.get();
              challenge.senderEmail = playerSnap.data().email;
              challenges = [...challenges, challenge];
            }  
          }
        }
        this.setState({ challenges: challenges });
      });
  };

  acceptChallenge(challenge) {
    let updatingData = {
      acceptedAt: new Date().getTime(),
      status: "accepted",
      opponent: firebase.auth().currentUser.uid,
      users: [...challenge.users, firebase.auth().currentUser.uid]
    };

    if (challenge.opponent === 'all') {
      updatingData.users.filter(value => value !== 'all');
    }
    let ref = firebase.firestore().collection("challenges").doc(challenge.id);
    ref.update(updatingData);
  }

  denyChallenge(challenge) {
    if (challenge.opponent === "all") {
      if (challenge.declinedUsers === undefined) {
        challenge.declinedUsers = [firebase.auth().currentUser.uid];
      } else {
        challenge.declinedUsers = [...challenge.declinedUsers, firebase.auth().currentUser.uid];
      }
      let ref = firebase.firestore().collection("challenges").doc(challenge.id)
      ref.update({declinedUsers: challenge.declinedUsers});
    } else {
      let ref = firebase.firestore().collection("challenges").doc(challenge.id)
      ref.update({declinedAt: new Date().getTime(), status:"declined"});
    }
  }

  renderItem = (challenge) => {
    return (
      <View style={{
        height: 100,
        backgroundColor: 'white',
        borderColor: 'rgba(255, 0, 0, 0.5)',
        borderRadius: 15,
        borderWidth: 1,
        marginTop: 5,
        flexDirection: 'column',
        padding: 10
      }}>
        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
          {challenge.senderEmail.substring(0, challenge.senderEmail.lastIndexOf("@"))} 
          bets&nbsp;
          {challenge.points}pts&nbsp;on&nbsp;{challenge.challengeGameWinnerId === this.props.player1Id ? this.props.player1Name : this.props.player2Name} 
          to win
          {challenge.opponent === 'all' ? "" : " (sent you directly)"}
        </Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <TouchableOpacity style={{ backgroundColor: 'red', width: 120, height: 40, borderRadius: 20, justifyContent: 'center' }}
            onPress={() => { this.acceptChallenge(challenge); }}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              Accept Pick
            </Text>
          </TouchableOpacity>
          <View style={{ width: 20 }} />
          <TouchableOpacity style={{ backgroundColor: 'transparent', width: 120, height: 40, borderRadius: 20, borderColor: 'red', borderWidth: 1, justifyContent: 'center' }}
            onPress={() => {
              this.denyChallenge(challenge);
            }}>
            <Text style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
              Deny Pick
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      challenges: []
    };
    this.unsubscribeRef = createRef();
    this.loadIncomingChallenges();
  }

  componentWillUnmount() {
    if (this.unsubscribeRef?.current) {
      console.log("unsubscribed snapshot in IncomingChallengesView componentWillUnmount.");
      this.unsubscribeRef?.current();
    }
  }

  render() {
    return (
      <>
        {this.state.challenges.length > 0 &&
          <View style={{ position: "absolute", width: '100%', height: '100%', left: 10, top: 10, backgroundColor: 'red' }}>
            <FlatList
              data={this.state.challenges}
              renderItem={({ item }) => this.renderItem(item)}
              keyExtractor={(item) => item.gameScheduleId} />
          </View>
        }
      </>
    );
  }
}