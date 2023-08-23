import React, { createRef } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";

import { firebase } from '../../../firebase';
import 'firebase/firestore';
import { ScrollView } from "react-native-gesture-handler";

import ArrowUpImage from '@assets/ArrowUp.png';
import ArrowDownImage from '@assets/ArrowDown.png';
import BetImage from '@assets/Bet.png';

import { createThumbnail } from "react-native-create-thumbnail";
import VideoThumbnailView from "./VideoThumbnailView";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

MaterialIcons.loadFont();

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
          let overtimeRounds = documentSnapshot.data().overtimeRounds;
          if (overtimeRounds === undefined) {
            this.setState({overtimeRounds: 0});
          } else {
            this.setState({overtimeRounds: overtimeRounds});
          }
          if (scores !== undefined) {
            this.setState({ scores: scores });
          }
          return;
        });
      })
      .catch(error => {

      });
  }

  splitIdsArray = (ids) => {
    if (ids.length > 0) {
      let splittedIds = [];
      let seeker = 0;
      while(seeker < ids.length) {
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

loadChallengeUsers = async (userIds) => {
    let userSplittedIdsArray = this.splitIdsArray(userIds);
    let users = [];
    for (let idx = 0; idx < userSplittedIdsArray.length; idx++) {
      const querySnapshot = await firebase.firestore().collection("users")
        .where("uid", "in", userSplittedIdsArray[idx])
        .get();
      
      querySnapshot.forEach(documentSnapshot => {
        let user = documentSnapshot.data();
        users = [...users, user];
      });
    }

    this.setState({challengeUsers: [...this.state.challengeUsers, ...users]});
  };

findChallengeUserName = (userId) => {
    let user = this.state.challengeUsers.find(user => user.uid == userId);
    if (user !== undefined) {
        return user.userName;
    } else {
        console.log("unknown user id - ", userId);
        return "???";
    }
}

  loadGameChallenges = (gameScheduleId) => {
    firebase.firestore().collection("challenges")
        .where("gameScheduleId", "==", gameScheduleId)
        .where("users", "array-contains", firebase.auth().currentUser.uid)
        .get()
        .then(async snapshot => {
            let challenges = [];
            let userIds = [];
            for (const doc of snapshot.docs) {
                let challenge = doc.data();

                if (challenge.status !== 'expired' && challenge.status !== 'pending') {
                  if (challenge.status !== 'accepted') {
                    console.log("Challenge not processed, yet");
                  }
  
                  if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
                      if (challenge.opponent !== "all") {
                      
                        if (!userIds.includes(userId => userId == challenge.opponent)) {
                          userIds = [...userIds, challenge.opponent];
                        }
                      }
                  } else {
                      if (!userIds.includes(userId => userId == challenge.challengeSenderId)) {
                        userIds = [...userIds, challenge.challengeSenderId];
                      }
                  }
                  challenges = [...challenges, challenge];
                }
            }
            await this.loadChallengeUsers(userIds);
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
      return this.findChallengeUserName(challenge.challengeSenderId);
      // if (challenge.opponentEmail === undefined) {
      //   return "(Not accepted)";
      // } else {
      //   return challenge.opponentEmail.substring(0, challenge.opponentEmail.lastIndexOf("@"));
      // }
    }
  };

  challengeReceiverName = (challenge) => {
    if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
      return this.findChallengeUserName(challenge.opponent);
      // if (challenge.opponentEmail === undefined) {
      //   return "(Not accepted)";
      // } else {
      //   return challenge.opponentEmail.substring(0, challenge.opponentEmail.lastIndexOf("@"));
      // }
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

  calculateVideoDuration = (durationInSecond) => {
    if (durationInSecond < 60) {
      return `${parseInt(durationInSecond)}s`
    } else {
      const secondsInInteger = parseInt(durationInSecond);
      return `${secondsInInteger / 60}:${(secondsInInteger % 60).toString().padStart(2, "0")}`
    }
  }

  getProfileName = (userId) => {
    if (this.state.gameData.player1ID === userId) {
      if (this.state.player1Profile !== undefined) {
        return this.state.player1Profile.userNickname
      } else {
        return "???"
      }
    } else if (this.state.gameData.player2ID === userId) {
      if (this.state.player2Profile !== undefined) {
        return this.state.player2Profile.userNickname
      } else {
        return "???"
      }
    } else {
      return "???"
    }
  }

  audioCallback = () => {
  };

  loadVideoThumbnail = (videoLink) => {
    createThumbnail({
      url: videoLink,
      timeStamp: 2000
    }).then(response => {
      console.log('thumbnail get - ', response);
      let currentThumbnails = this.state.videoThumbnails;
      currentThumbnails[videoLink] = response;
      this.setState({videoThumbnails: {...currentThumbnails}});
    }).catch(err => {
      console.log('thumbnail get error - ', err);
      let currentThumbnails = this.state.videoThumbnails;
      currentThumbnails[videoLink] = '';
      this.setState({videoThumbnails: {...currentThumbnails}});
    });
  }

  renderVideoThumbnail = (video) => {
    return <VideoThumbnailView  video={video} />;
  }

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

  combineRoomsAndVideoLinks = (rooms, videoLinks) => {
    let mediaContainingRooms = rooms.filter(item => {
      return (item.compositionSid !== undefined) && !(item.compositionProgress === "100" && item.compositionStatus === "composition-progress")
    });
    return mediaContainingRooms.map(room => {
      const obj = videoLinks.find(videoLink => videoLink.roomSid === room.roomSid);
      if (obj !== undefined) {
        return {...room, videoLink: obj.uri}
      } else {
        return room
      }
    });
  }

  snapshotTwilioRoomRecordingsList = (gameScheduleId) => {

    if (this.unsubscribeRef?.current) {
      console.log("unsubscribed snapshot in CompletedGameView.");
      this.unsubscribeRef?.current();
    }

    this.unsubscribeRef.current = firebase.firestore().collection("gameSchedule").doc(gameScheduleId).collection("twilioRooms")
      .onSnapshot(async twilioRooms => {

        console.log("Snapshot to twilio rooms.");

        let rooms = [];
        twilioRooms.forEach(doc => {
          rooms = [...rooms, doc.data()];
        });

        const videos = await fetch(`https://us-central1-players-recreation-league.cloudfunctions.net/fetchGameRecordingVideos?gameScheduleId=${gameScheduleId}`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'}
        });
        
        const responseJSON = await videos.json();
        console.log("video links json response => ", responseJSON);

        let roomVideos = this.combineRoomsAndVideoLinks(rooms, responseJSON);
        this.setState({ roomVideos: roomVideos, recordingsLoaded: true });
    });
  }

  loadTwilioRoomIds = async (gameScheduleId) => {

    console.log("loading twilio rooms");

    const twilioRooms = await firebase.firestore().collection("gameSchedule").doc(gameScheduleId).collection("twilioRooms").get();
    
    let rooms = [];
    twilioRooms.forEach(doc => {
      rooms = [...rooms, doc.data()];
    })

    if (rooms.length === 0) {
      this.setState({ roomVideos: [], recordingsLoaded: true, noRecordings: true});
    } else {
      const gameScheduleDoc = await firebase.firestore().collection("gameSchedule").doc(gameScheduleId).get();

      if (true !== gameScheduleDoc.data().processedVideosRecording) {
        console.log("Now we need to do a composition action");
        await fetch(`https://us-central1-players-recreation-league.cloudfunctions.net/createCompositionsForGames?gameScheduleId=${gameScheduleId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json' 
          }
        });
        this.setState({ roomVideos: [], recordingsLoaded: true});
      }
  
      this.snapshotTwilioRoomRecordingsList(gameScheduleId);
    }
  };

  configureMessageListening = (gameScheduleId) => {
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
      fetchingAudioLink: false,
      gameData: game, 
      event: {}, 
      scores: {}, 
      paused: {},
      player1Profile: {}, 
      player2Profile: {}, 
      roundCollapsed: false,
      challengesCollapsed: true,
      recordingsCollapsed: true,
      recordingsLoaded: false,
      challengeUsers: [],
      challenges:[],
      overtimeRounds: 0,
      videoThumbnails: {},
      messageRedDot: false,
     };

    this.loadEventDetails(game.eventID);
    this.loadGameScores(props.route.params.game.gameID);
    this.loadUserProfiles(game);
    this.loadGameChallenges(game.gameScheduleId);
    this.loadTwilioRoomIds(game.gameScheduleId);
    this.configureMessageListening(game.gameScheduleId);

    this.unsubscribeMessagesRef = createRef();
    this.unsubscribeRef = createRef();
  }

  componentWillUnmount() {
    if (this.unsubscribeRef?.current) {
      console.log("unsubscribed snapshot in PlayerView componentWillUnmount.");
      this.unsubscribeRef?.current();
    }

    if (this.unsubscribeMessagesRef?.current) {
      console.log("unsubscribed snapshot for message in completedGameWithRecordingView.");
      this.unsubscribeMessagesRef?.current();
    }
  }

  roundsRenderLoop = () => {
    let totalGamePlayRounds = this.state.gameData.gameTotalRounds + this.state.overtimeRounds; 

    var roundsLoop = [];
    for (let i = 0; i < totalGamePlayRounds; i++) {
      roundsLoop.push(
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ width: '100%', color: (i >= this.state.gameData.gameTotalRounds) ? 'red' : 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginTop: 10 }}>
              { (this.state.scores.hasOwnProperty(this.state.gameData.player1ID)) ?
                  (this.state.scores[this.state.gameData.player1ID].hasOwnProperty(i)) ? this.state.scores[this.state.gameData.player1ID][i] : 0
              : 0}
            </Text>
          </View>
          <View style={{ flex: 1.5, justifyContent: 'center' }}>
            <Text style={{ width: '100%', color: (i >= this.state.gameData.gameTotalRounds) ? 'red' : 'white', fontSize: 14, textAlign: 'center', marginTop: 10 }}>
              Round {i + 1}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ width: '100%', color: (i >= this.state.gameData.gameTotalRounds) ? 'red' : 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginTop: 10 }}>
              { (this.state.scores.hasOwnProperty(this.state.gameData.player2ID)) ?
                  (this.state.scores[this.state.gameData.player2ID].hasOwnProperty(i)) ? this.state.scores[this.state.gameData.player2ID][i] : 0
              : 0}
            </Text>
          </View>
        </View>
      );
    }

    return roundsLoop;
  };

  render() {
    StatusBar.setBarStyle('light-content', true);

    const { navigation } = this.props;



    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0B214D' }}>

        <StatusBar barStyle="light-content" />

        <View style={{ height: 40, justifyContent: 'center', padding: 10, flexDirection: 'row' }}>
          <TouchableOpacity style={{ width: 40, height: 40 }}
            onPress={() => {
              navigation.goBack();
            }}>
              <MaterialIcons name="chevron-left" color="white" size={24}/>
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

        <ScrollView style={{ flex: 1, marginTop: 20 }}>

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

          <View style={{ flex: 1, flexDirection: 'column', marginTop: 0 }}>
            <View style={{ flexDirection: 'row', height: 100 }}>
              <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                  navigation.navigate('EventInfoStack', {
                    screen: 'PlayerProfileScreen',
                    params: {
                      ...{
                        userID: this.state.gameData.player1ID,
                        eventID: this.state.gameData.eventID
                      }
                    }
                  })
                }}>
                <Image style={{ width: 80, height: 80, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 40 }} 
                  source={{uri: this.state.player1Profile.userAvatar}}/>
              </TouchableOpacity>
              <View style={{ flex: 1.5, justifyContent: 'center' }}>
                <Text style={{ textAlign: 'left', fontWeight: 'bold', fontSize: 24, color: 'white', position: 'absolute' }}>
                  {this.state.gameData.player1Score}
                </Text>
                <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white', position: 'absolute', right: 0 }}>
                  {this.state.gameData.player2Score}
                </Text>
              </View>
              <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {
                  navigation.navigate('EventInfoStack', {
                    screen: 'PlayerProfileScreen',
                    params: {
                      ...{
                        userID: this.state.gameData.player2ID,
                        eventID: this.state.gameData.eventID
                      }
                    }
                  })
                }}>
                <Image style={{ width: 80, height: 80, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 40 }} 
                  source={{uri: this.state.player2Profile.userAvatar}}/>
              </TouchableOpacity>
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
                {this.roundsRenderLoop()}
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

          <View style={{marginTop: 15, marginBottom: 5}}>
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

          <View style={{marginTop: 5, marginBottom: 20}}>
            <View style={{ backgroundColor: '#ffffff1f', padding: 10, flexDirection: 'row'}}>
              <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold', flex: 1 }}>
                  Recordings
              </Text>
              {this.state.roomVideos !== undefined && this.state.roomVideos.length > 0 &&
                <TouchableOpacity
                  onPress={() => {
                    this.setState({recordingsCollapsed: !(this.state.recordingsCollapsed)});
                  }}>
                  <Image style={{  width: 22, height: 14 }}
                    source={this.state.challengesCollapsed ? ArrowUpImage : ArrowDownImage} />
                </TouchableOpacity>
              }
            </View>
            {(this.state.roomVideos === undefined || this.state.roomVideos.length === 0) ? (
              <Text style={{ color: 'white', fontSize: 12, marginTop: 20, textAlign:'center'}}>
                {!this.state.recordingsLoaded ? "Loading recordings..." : "No recordings in the game."}
              </Text>
            ) : (
              <>
              {this.state.recordingsCollapsed && 
                <FlatList
                    style={{margin: 10}}
                    data={this.state.roomVideos}
                    extraData={this.state.roomVideos}
                    renderItem={(item) => this.renderVideoThumbnail(item.item)}
                    keyExtractor={(item) => item.sid} />
              }
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};