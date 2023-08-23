import React, { useState, useRef, createRef } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Image,
  TouchableOpacity
} from "react-native";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import BackImg from '@assets/arrow_left.png';
import { firebase } from '../../../firebase';
import 'firebase/firestore';
import { ScrollView } from "react-native-gesture-handler";

MaterialIcons.loadFont();

export default class UpcomingGameView extends React.Component {

  loadUserProfiles = (game) => {
    firebase.firestore().collection("users")
    .where(firebase.firestore.FieldPath.documentId(), "in", [game.player1ID, game.player2ID])
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (doc.id === game.player1ID) {
          this.setState({player1Profile: doc.data()});
        } else {
          this.setState({player2Profile: doc.data()});
        }
      });
    });
  };

  registerAudience = () => {
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(doc => {
      if (doc.exists) {
        let userData = doc.data();
        let myUsername = userData.email.substring(0, userData.email.lastIndexOf("@"));
        let ref = firebase.firestore().collection("gameSchedule").doc(props.route.params.game.gameScheduleId).collection("audiences").doc(doc.id);
        return ref.set({ id: ref.id, joined: true, name: myUsername, user_id: firebase.auth().currentUser.uid });
      } else {
        throw new Error("My profile does not exists");
      }
    })
      .then(() => console.log("Successfully registered as an audience."))
      .catch(err => {
        console.log("Error while registering as audience", err);
      });
  }

  loadEventDetails = (eventID) => {
    firebase.firestore().collection("events").where("eventID", "==", eventID)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          let event = documentSnapshot.data();
          this.setState({ event: event });
          return;
        });
      })
      .catch(error => {

      });
  };

  renderChallengeItem = (challenge) => {
    
    return (
      <View style={{ height: 40, borderColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 5, borderWidth: 1, marginTop: 5, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', flex: 1, color: 'white' }}>
          {challenge.points}
          {challenge.challengeGameWinnerId === this.props.player1ID ? this.props.player1Name : this.props.player2Name} Win
        </Text>
        <Text style={{ flex: 1, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
          {challenge.points}pt
        </Text>
        <Text style={{ flex: 2, textAlign: 'center', fontSize: 12, color: 'white' }}>
          {challenge.opponent === 'all' ? 'Open to All' : challenge.opponentEmail.substring(0, challenge.opponentEmail.lastIndexOf("@"))}
        </Text>
        {challenge.status == "pending" &&
          <View style={{ height: 20, width: 60, backgroundColor: 'red', borderRadius: 10, overflow: 'hidden', justifyContent: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
              Pending
            </Text>
          </View>
        }
      </View>
    );
  }

  processMessageListening = (gameScheduleId) => {
    this.unsubscribeMessagesRef = firebase.firestore().collection("gameSchedule")
          .doc(gameScheduleId)
          .collection("messages")
          .limit(1)
          .onSnapshot(querySnapshot => {
            console.log("query snapshot => ", querySnapshot.docs.length);
            if (querySnapshot.docs.length > 0) {
              this.setState({messageRedDot: true});
            } else {
              this.setState({messageRedDot: false});
            }
          });
  }

  constructor(props) {
    super(props);

    let game = props.route.params.game;
    this.state = { 
      gameData: game, 
      event: {}, 
      messageRedDot: false,
      player1Profile: {},
      player2Profile: {}
    };

    this.loadUserProfiles(game);
    this.loadEventDetails(game.eventID);

    this.unsubscribeMessagesRef = createRef();
    this.processMessageListening(game.gameScheduleId);
  }

  componentWillUnmount() {
    if (this.unsubscribeMessagesRef?.current) {
      console.log("unsubscribed snapshot for message in UpcomingGameView.");
      this.unsubscribeMessagesRef?.current();
    }
  }

  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0B214D' }}>
        <StatusBar barStyle="light-content" />
        <View style={{ height: 40, justifyContent: 'center', padding: 10, flexDirection: 'row' }}>
          <TouchableOpacity style={{ width: 40, height: 40 }}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image style={{tintColor: 'white'}} source={BackImg}/>
          </TouchableOpacity>

          <View style={{ flex: 1 }}/>

          <TouchableOpacity style={{ width: 40, height: 40 }}
            onPress={() => {
              navigation.navigate('ChatScreen', {game: this.state.gameData, gameScheduleId: this.state.gameData.gameScheduleId});
            }}>
              <MaterialIcons name="message" color="white" size={24}/>
              {this.state.messageRedDot &&
                <View style={{
                  backgroundColor: 'red',
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  position: 'absolute', 
                  right: 10,
                  top: 0
                }} />
              }
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 15 }}>

          <Text style={{ width: '100%', color: 'white', fontWeight: 'bold', fontSize: 28, textAlign: 'center' }}>
            {this.state.event.eventName}
          </Text>

          <Text style={{ width: '100%', color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginTop: 10 }}>
            {this.state.gameData.contestName}
          </Text>

          <Text style={{ width: '100%', color: 'white', fontSize: 16, textAlign: 'center', marginTop: 10 }}>
            {this.state.gameData.gameDescription}
          </Text>

          <View style={{ flex: 1, flexDirection: 'row', marginTop: 30 }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Image style={{ width: 80, height: 80, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 40 }}
                source={{uri: this.state.player1Profile.userAvatar}} />
              <Text style={{ width: '100%', color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginTop: 10 }}>
                {this.state.gameData.player1Name}
              </Text>
              <TouchableOpacity style={{ backgroundColor: 'red', padding: 10, marginTop: 15, height: 40, borderRadius: 20 }}
                onPress={() => {
                console.log("userID => ", this.state.gameData.player1ID, "eventID", this.state.gameData.eventID);

                navigation.navigate('EventInfoStack', {
                  screen: 'PlayerProfileScreen',
                  params: {
                    ...{
                      userID: this.state.gameData.player1ID,
                      eventID: this.state.gameData.eventID,
                      onBackPress: () => {
                        navigation.navigate('GamesList', { screen: 'UpcomingGameScreen' });
                      }
                    }
                  }
                })
              }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Open Profile
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Image style={{ width: 80, height: 80, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 40 }}
                source={{uri: this.state.player2Profile.userAvatar}} />
              <Text style={{ width: '100%', color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginTop: 10 }}>
                {this.state.gameData.player2Name}
              </Text>
              <TouchableOpacity style={{ backgroundColor: 'red', padding: 10, marginTop: 15, height: 40, borderRadius: 20 }}
                onPress={() => {
                  navigation.navigate('EventInfoStack', {
                    screen: 'PlayerProfileScreen',
                    params: {
                      ...{
                        userID: this.state.gameData.player2ID,
                        eventID: this.state.gameData.eventID,
                        onBackPress: () => {
                          navigation.navigate('GamesList', { screen: 'UpcomingGameScreen' });
                        }
                      }
                    }
                  })
                }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  Open Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, marginTop: 20}}>
            My Challenges
          </Text>
          <View style={{ marginTop: 10 }}>
            <FlatList
              data={this.state.challenges}
              renderItem={(item) => this.renderChallengeItem(item.item)}
              keyExtractor={(item) => item.id} />
          </View> */}
          <TouchableOpacity style={{ marginTop: 20, alignSelf: 'center', justifyContent: 'center', width: 100, backgroundColor: 'red', height: 40, borderRadius: 20  }}
            onPress={() => {
              navigation.navigate('GameChallengesView', {
                gameID: this.state.gameData.gameID,
                gameSchedule: this.state.gameData,
                challenges: [],
                type: "All"
              });
              // navigation.navigate('GameChallengesView', {
              //   gameScheduleId: this.props.route.params.game.gameScheduleId, 
              //   game: this.state.gameData});
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              Picks
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
};