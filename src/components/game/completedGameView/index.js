import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";

import { firebase } from '../../../firebase';
import 'firebase/firestore';
import { ScrollView } from "react-native-gesture-handler";

import ArrowUpImage from '@assets/ArrowUp.png';
import ArrowDownImage from '@assets/ArrowDown.png';
import BetImage from '@assets/Bet.png';

export default class CompletedGameView extends React.Component {

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

  loadGameScores = (gameID) => {
    firebase.firestore().collection("gameScores").where("gameID", "==", gameID)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          let scores = documentSnapshot.data().scores;
          if (scores !== undefined) {
            this.setState({ scores: scores });
          }
          return;
        });
      })
      .catch(error => {

      });
  }

  loadGameChallenges = (gameScheduleId) => {
    firebase.firestore().collection("challenges")
        .where("gameScheduleId", "==", gameScheduleId)
        .where("users", "array-contains", firebase.auth().currentUser.uid)
        .get()
        .then(async snapshot => {
            let challenges = [];
            for (const doc of snapshot.docs) {
                let challenge = doc.data();

                if (challenge.status !== 'expired' && challenge.status !== 'pending') {
                  if (challenge.status !== 'accepted') {
                    console.log("Challenge not processed, yet");
                  }
  
                  if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
                      if (challenge.opponent !== "all") {
                      
                          let playerRef = firebase.firestore().collection("users").doc(challenge.opponent)
                          let playerSnap = await playerRef.get();
                          if (playerSnap.exists) {
                              challenge.opponentEmail = playerSnap.data().email;
                          }
                      }
                  } else {
                      let playerRef = firebase.firestore().collection("users").doc(challenge.challengeSenderId)
                      let playerSnap = await playerRef.get();
                      if (playerSnap.exists) {
                          challenge.opponentEmail = playerSnap.data().email;
                      }
                  }
                  challenges = [...challenges, challenge];
                }
            }
            console.log("got challenges of completed games", challenges.length);
            this.setState({challenges: challenges});
        });
  }

  challengeSenderPointText = (challenge) => {
    if (challenge.gameRealWinnerId === challenge.challengeGameWinnerId) {
      return "+" + challenge.points;
    } else {
      return "-" + challenge.points;
    }
  }

  challengeReceiverPointText = (challenge) => {
    if (challenge.gameRealWinnerId === challenge.challengeGameWinnerId) {
      return "-" + challenge.points;
    } else {
      return "+" + challenge.points;
    }
  }

  challengeSenderName = (challenge) => {
    if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
      return firebase.auth().currentUser.email.substring(0, firebase.auth().currentUser.email.lastIndexOf("@"));
    } else {
      if (challenge.opponentEmail === undefined) {
        return "(Not accepted)";
      } else {
        return challenge.opponentEmail.substring(0, challenge.opponentEmail.lastIndexOf("@"));
      }
    }
  };

  challengeReceiverName = (challenge) => {
    if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
      if (challenge.opponentEmail === undefined) {
        return "(Not accepted)";
      } else {
        return challenge.opponentEmail.substring(0, challenge.opponentEmail.lastIndexOf("@"));
      }
    } else {
      return firebase.auth().currentUser.email.substring(0, firebase.auth().currentUser.email.lastIndexOf("@"));
    }
  };

  collapseRounds = () => {
    if (this.state.roundCollapsed) {
      this.setState({roundCollapsed: false});
    } else {
      this.setState({roundCollapsed: true});
    }
  }

  challengeTotalPointsIGot = () => {
    let totalPoints = 0;
    this.state.challenges.forEach((challenge) => {
      if (challenge.status !== 'pending') {
        if (challenge.gameRealWinnerId === challenge.challengeGameWinnerId) {
          if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
            totalPoints += challenge.points;
          } else {
            totalPoints -= challenge.points;
          }
        } else {
          if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
            totalPoints -= challenge.points;
          } else {
            totalPoints += challenge.points;
          }
        }
      }
    });
    return totalPoints;
  };

  renderCompletedChallenge = (challenge) => {
    return (
      <View style={{
        flexDirection: 'column',
        padding: 15,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 5,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#fff2',
      }}>
          < View style={{
            height: 40,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', flex: 1, color: 'white' }}>
              {challenge.challengeGameWinnerId === this.state.gameData.player1ID ? this.state.gameData.player1Name : this.state.gameData.player2Name} Win
            </Text>
            <View style={{flexDirection: 'column', flex:2, marginLeft: 20}}>
              <View style={{flexDirection: 'row', height: 30, alignItems: 'center'}}>
                <Image source={BetImage} tintColor={'#fff'} style={{tintColor: '#fff'}}/>
                <Text style={{marginLeft: 10, fontWeight: 'bold', color:'white'}}>{this.challengeSenderPointText(challenge)}</Text>
                <Text style={{marginLeft: 10, flex:1, color:'white'}}>{ this.challengeSenderName(challenge) }</Text>
              </View>
              <View style={{flexDirection: 'row', height: 30, alignItems: 'center'}}>
                <Image source={BetImage} tintColor={'#fff'} style={{tintColor: '#fff'}}/>
                <Text style={{marginLeft: 10, fontWeight: 'bold', color:'white'}}>{this.challengeReceiverPointText(challenge)}</Text>
                <Text style={{marginLeft: 10, flex:1, color:'white'}}>{this.challengeReceiverName(challenge)}</Text>
              </View>
            </View>
          </View>
      </View >
    );
  }

  constructor(props) {
    super(props);

    let game = props.route.params.game;
    this.state = { 
      gameData: game, 
      event: {}, 
      scores: {}, 
      player1Profile: {}, 
      player2Profile: {}, 
      roundCollapsed: false,
      challengesCollapsed: true,
      challenges:[] };

    this.loadEventDetails(game.eventID);
    this.loadGameScores(props.route.params.game.gameID);
    this.loadUserProfiles(game);
    this.loadGameChallenges(game.gameScheduleId);
  }

  render() {
    StatusBar.setBarStyle('light-content', true);

    const { navigation } = this.props;

    var roundsLoop = [];
    for (let i = 0; i < this.state.gameData.gameTotalRounds; i++) {
      roundsLoop.push(
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ width: '100%', color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginTop: 10 }}>
              { (this.state.scores.hasOwnProperty(this.state.gameData.player1ID)) ?
                  (this.state.scores[this.state.gameData.player1ID].hasOwnProperty(i)) ? this.state.scores[this.state.gameData.player1ID][i] : 0
              : 0}
            </Text>
          </View>
          <View style={{ flex: 1.5, justifyContent: 'center' }}>
            <Text style={{ width: '100%', color: 'white', fontSize: 14, textAlign: 'center', marginTop: 10 }}>
              Round {i + 1}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ width: '100%', color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginTop: 10 }}>
              { (this.state.scores.hasOwnProperty(this.state.gameData.player2ID)) ?
                  (this.state.scores[this.state.gameData.player2ID].hasOwnProperty(i)) ? this.state.scores[this.state.gameData.player2ID][i] : 0
              : 0}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0B214D' }}>
        <View style={{ height: 40, justifyContent: 'center', padding: 10 }}>
          <TouchableOpacity style={{ width: 40, height: 40 }}
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={{ color: 'white' }}>
              Back
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }}>

          <Text style={{ width: '100%', color: 'white', fontWeight: 'bold', fontSize: 28, textAlign: 'center' }}>
            {this.state.event.eventName}
          </Text>

          <Text style={{ width: '100%', color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginTop: 10 }}>
            {this.state.gameData.contestName}
          </Text>

          <Text style={{ width: '100%', color: 'white', fontSize: 16, textAlign: 'center', marginTop: 10 }}>
            {this.state.gameData.gameDescription}
          </Text>

          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <Image style={{ width: 48, height: 48 }}
              source={require('../../../../assets/cup.png')} />
          </View>

          <Text style={{ width: '100%', color: 'white', fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>
            {this.state.gameData.winnerName}
          </Text>

          <View style={{ flex: 1, flexDirection: 'column', marginTop: 30 }}>
            <View style={{ flexDirection: 'row', height: 100 }}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ width: 80, height: 80, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 40 }} 
                  source={{uri: this.state.player1Profile.userAvatar}}/>
              </View>
              <View style={{ flex: 1.5, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'left', fontWeight: 'bold', fontSize: 24, color: 'white', position: 'absolute' }}>
                  {this.state.gameData.player1Score}
                </Text>
                <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white', position: 'absolute', right: 0 }}>
                  {this.state.gameData.player2Score}
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ width: 80, height: 80, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 40 }} 
                source={{uri: this.state.player2Profile.userAvatar}}/>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ width: '100%', color: 'white', fontWeight: 'bold', fontSize: 14, textAlign: 'center', marginTop: 10 }}>
                  {this.state.gameData.player1Name}
                </Text>
              </View>
              <TouchableOpacity style={{ flex: 1.5, justifyContent: 'center' }}
                onPress={() => {
                  this.collapseRounds();
                }}>
                <Image style={{ alignSelf: 'center', width: 22, height: 14 }}
                  source={this.state.roundCollapsed ? ArrowUpImage : ArrowDownImage} />
              </TouchableOpacity>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ width: '100%', color: 'white', fontWeight: 'bold', fontSize: 14, textAlign: 'center', marginTop: 10 }}>
                  {this.state.gameData.player2Name}
                </Text>
              </View>
            </View>
            {(this.state.roundCollapsed === true) && (
              <>
                {roundsLoop}
                <View style={{height:1, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginTop: 15}}/>
              </>
            )}
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ width: '100%', color: 'white', fontWeight: 'bold', fontSize: 22, textAlign: 'center', marginTop: 10 }}>
                  { this.state.gameData.player1Score }
                </Text>
              </View>
              <View style={{ flex: 1.5, justifyContent: 'center' }}>
                <Text style={{ width: '100%', color: 'white', fontSize: 18, textAlign: 'center', marginTop: 10 }}>
                  Total
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ width: '100%', color: 'white', fontWeight: 'bold', fontSize: 22, textAlign: 'center', marginTop: 10 }}>
                  { this.state.gameData.player2Score }
                </Text>
              </View>
            </View>
          </View>

          <View style={{marginTop: 30, marginBottom: 20}}>
            <View style={{ backgroundColor: '#ffffff1f', padding: 10, flexDirection: 'row'}}>
              <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold', flex: 1 }}>
                  Picks
              </Text>
              {this.state.challenges.length > 0 &&
                <TouchableOpacity
                  onPress={() => {
                    this.setState({challengesCollapsed: !(this.state.challengesCollapsed)});
                  }}>
                  <Image style={{  width: 22, height: 14 }}
                    source={this.state.challengesCollapsed ? ArrowUpImage : ArrowDownImage} />
                </TouchableOpacity>
              }
            </View>
            {this.state.challenges.length === 0 ? (
              <Text style={{ color: 'white', fontSize: 12, marginTop: 20, textAlign:'center'}}>
                No picks in the game.
              </Text>
            ) : (
              <>
              {this.state.challengesCollapsed && 
                <FlatList
                  data={this.state.challenges}
                  renderItem={(item) => this.renderCompletedChallenge(item.item)}
                  keyExtractor={(item) => item.id} />
              }
              <View style={{padding: 15, flexDirection: 'row'}}>
                <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold', flex: 1 }}>
                  My Net Points Change for this game:
                </Text>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold'}}>
                  { this.challengeTotalPointsIGot() }pt
                </Text>
              </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};