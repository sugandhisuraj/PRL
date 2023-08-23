import React, { useState, useRef } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Alert
} from "react-native";

import Counter from "react-native-counters";
import DropDownPicker from "react-native-dropdown-picker";

import { firebase } from '../../../firebase';
import 'firebase/firestore';

const normalPlayerStyle = { flex: 1, backgroundColor: 'transparent', borderRadius: 22, borderColor: 'red', borderWidth: 1, justifyContent: 'center', color: 'white' };
const normalPlayerTextStyle = { textAlign: 'center', fontWeight: 'bold', color: 'red' };
const winnerSelectedStyle = { flex: 1, backgroundColor: 'red', borderRadius: 22, justifyContent: 'center', color: 'red' };
const winnerPlayerTextStyle = { textAlign: 'center', fontWeight: 'bold', color: 'white'};

export default class CreateChallengeView extends React.Component {

  selectedPoint = 0;
  selectedOpponentId = "";

  loadAudiencesList = () => {
    
    firebase.firestore().collection("userEnteredContests").where("eventID", "==", this.props.game.eventID)
      .get()
      .then(querySnapshot => {
        let userIds = [];
        querySnapshot.forEach(doc => {
          if (!userIds.includes(doc.data().userID) && (doc.data().userID !== firebase.auth().currentUser.uid)) {
            userIds = [...userIds, doc.data().userID];
          }
        });

        if (userIds.length > 0) {
          let splittedIds = [];
          let seeker = 0;
          while(seeker < userIds.length) {
            let elementSplitIds = [];
            for (idx = 0; idx < 4; idx++) {
              if (seeker + idx < userIds.length) {
                elementSplitIds.push(userIds[seeker + idx]);
              }
            }

            splittedIds.push(elementSplitIds);

            seeker = seeker + 4;
          }

          var users = [];
          splittedIds.forEach(loadingUserIds => {
            firebase.firestore().collection("users").where(firebase.firestore.FieldPath.documentId(), "in", loadingUserIds)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                users.push(doc.data());
              });

              var audiencesList = [{ label: 'Open to all audience members', value: 'all' }];
              users.forEach(user => {
                if (user.id !== firebase.auth().currentUser.uid) {
                  let userNameLabel = user.userName;
                  if (userNameLabel === undefined || userNameLabel === "") {
                    userNameLabel = user.userNickname;
                    if (userNameLabel === undefined || userNameLabel === "") {
                      userNameLabel = user.email;
                    }
                  }
                  audiencesList = [...audiencesList, { value: user.uid, label: userNameLabel }];
                }
              });

              this.setState({ audiences: audiencesList });
            });
          });
        }
      });
  }

  onCreateChallenge = () => {
    if (this.selectedPoint === 0) {
      Alert.alert("", "Please choose challenging point.", [{ text: 'OK', onPress: () => { } }]);
      return;
    }

    if (this.selectedOpponentId === "") {
      Alert.alert("", "Please choose who is the challenge for.", [{ text: 'OK', onPress: () => { } }]);
      return;
    }

    if (this.state.selectedWinnerId === "") {
      Alert.alert("", "Please choose who is going to win.", [{ text: 'OK', onPress: () => { } }]);
      return;
    }

    this.setState({loading: true});
    let ref = firebase.firestore().collection("challenges").doc();
    ref.set({
      id: ref.id,
      gameScheduleId: this.props.gameScheduleId,
      eventID: this.props.game.eventID,
      gameID: this.props.game.gameID,
      challengeSenderId: firebase.auth().currentUser.uid,
      status: "pending",
      opponent: this.selectedOpponentId,
      points: this.selectedPoint,
      challengeGameWinnerId: this.state.selectedWinnerId,
      declinedUsers: [],
      users: [firebase.auth().currentUser.uid, this.selectedOpponentId],
      createdAt: (new Date()).getTime()
    }).then(() => {
      this.setState({loading: false});
      this.props.onDismiss();
    }).catch(err => {
      this.setState({loading: false});
      Alert.alert("", err, [{ text: 'OK' }]);
    });
  }

  constructor(props) {
    super(props);
    console.log("Create ChallengeView Event ID => ", props.game.eventID);
    this.loadAudiencesList();
    this.state = {
      loading: false,
      audiences: [{ label: 'Open to all audience members', value: 'all' }],
      selectedWinnerId: ""
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{ flex: 1, flexDirection: 'column', padding: 15 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            Who do you think is going to win?
          </Text>
          <View style={{ flexDirection: 'row', height: 44, marginTop: 20 }}>
            <TouchableOpacity
              style={this.state.selectedWinnerId == this.props.player1Id ? winnerSelectedStyle : normalPlayerStyle}
              onPress={() => {
                this.setState({ selectedWinnerId: this.props.player1Id });
              }}>
              <Text style={this.state.selectedWinnerId == this.props.player1Id ? winnerPlayerTextStyle : normalPlayerTextStyle}>{this.props.player1Name}</Text>
            </TouchableOpacity>
            <View style={{ width: 20 }} />
            <TouchableOpacity
              style={this.state.selectedWinnerId == this.props.player2Id ? winnerSelectedStyle : normalPlayerStyle}
              onPress={() => {
                this.setState({ selectedWinnerId: this.props.player2Id });
              }}>
              <Text style={this.state.selectedWinnerId == this.props.player2Id ? winnerPlayerTextStyle : normalPlayerTextStyle}>{this.props.player2Name}</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 20 }}>
            How many points are you picking?
          </Text>
          <View style={{ alignItems: 'center', height: 60, justifyContent: 'center' }}>
            <Counter
              start={0}
              onChange={(value) => {
                this.selectedPoint = value;
              }}
              buttonStyle={{ borderColor: 'transparent' }}
              buttonTextStyle={{ color: 'black' }}
              countTextStyle={{ color: 'black', fontSize: 18 }} />
          </View>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            Who is the pick for?
          </Text>
          <DropDownPicker
            items={this.state.audiences}
            defaultNull
            placeholder="Select a name from the dropdown"
            placeholderStyle={{ color: 'rgba(0, 0, 0, 0.6)' }}
            containerStyle={{ height: 40, marginTop: 20 }}
            style={{ backgroundColor: '#ffffff' }}
            itemStyle={{ justifyContent: 'flex-start' }}
            dropDownMaxHeight={200}
            onChangeItem={(item) => {
              this.selectedOpponentId = item.value;
            }} />
          <TouchableOpacity style={
            {
              backgroundColor: 'transparent',
              borderRadius: 22,
              borderColor: 'red',
              borderWidth: 1,
              justifyContent: 'center',
              height: 44,
              width: 200,
              position: 'absolute',
              bottom: 50,
              left: '50%',
              marginLeft: -100
            }}
            onPress={this.onCreateChallenge}>
            <Text style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>Confirm Pick</Text>
          </TouchableOpacity>
        </View>
        {this.state.loading && 
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', width: '100%', height: '100%', position: 'absolute'}}>
              <ActivityIndicator style={{ width: '100%', height: '100%'}} color={"white"}/>
          </View>
        }
      </View>
    );
  }
};