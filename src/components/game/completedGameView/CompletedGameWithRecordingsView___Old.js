import React, { useState, useRef, useCallback } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ActivityIndicator
} from "react-native";

import { VLCPlayer } from 'react-native-vlc-media-player';

import moment from 'moment';

import { firebase } from '../../../firebase';
import 'firebase/firestore';
import { ScrollView } from "react-native-gesture-handler";

import ArrowUpImage from '@assets/ArrowUp.png';
import ArrowDownImage from '@assets/ArrowDown.png';
import BetImage from '@assets/Bet.png';
import VideoPlayIcon from '@assets/VideoPlayRun.png';

import Modal from 'react-native-modal';

const {width} = Dimensions.get('window');

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
                          // let playerRef = firebase.firestore().collection("users").doc(challenge.opponent)
                          // let playerSnap = await playerRef.get();
                          // if (playerSnap.exists) {
                          //     challenge.opponentEmail = playerSnap.data().email;
                          // }
                      }
                  } else {
                      if (!userIds.includes(userId => userId == challenge.challengeSenderId)) {
                        userIds = [...userIds, challenge.challengeSenderId];
                      }
                      // let playerRef = firebase.firestore().collection("users").doc(challenge.challengeSenderId)
                      // let playerSnap = await playerRef.get();
                      // if (playerSnap.exists) {
                      //     challenge.opponentEmail = playerSnap.data().email;
                      // }
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

  renderVideoThumbnail = (video) => {
    return (
      <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 10, height: 300, margin: 10}}
      onPress={async () => {

        this.setState({modalPlayerOpened: true, fetchingAudioLink: true});


        let connectedAudio = this.state.audios.find(audio => audio.grouping_sids.participant_sid === video.grouping_sids.participant_sid);
        console.log("Audio connected -> ", connectedAudio.links.media);

        console.log("Fetching media link - ", connectedAudio.links.media);
        const response = await fetch(connectedAudio.links.media, {
          method: 'GET',
          headers: {"Authorization": "Basic QUM0ZTZkOWVhMzlhZjBjMTc3Yzc2NjVjZDI4YjgwMzZlODplZTdmZmM5ZTg4ZjIwNGIxNzRiZDBmNTllMTZiNjViMw=="}
        });
        const audioMediaFileLink = response.url;
        console.log("Feetched audio link - ", audioMediaFileLink);
        
        this.setState({
          fetchingAudioLink: false, 
          fullscreenVideoUrl: video.videoMediaUrl, 
          audioMediaUrl: audioMediaFileLink, 
          audioReady: false, 
          videoReady: false, 
          audioShouldPause: false, 
          audioSeekTo: 0,
          videoShouldPause: false,
          videoSeekTo: 0,
          fullScreenPlayingStarted: false});
      }}>
        <VLCPlayer
          source={{uri:video.videoMediaUrl}}
          paused={(this.state.paused[video.sid] === undefined) ? false : this.state.paused[video.sid]}
          onOpen={() => {
            console.log("Video opened.");
          }}
          onPlaying={() => {
            console.log("Video playing.");
          }}
          onVideoLoadStart={() => {
            console.log("Video load started.");
          }}
          onBuffering={() => {
            console.log("Video buffering.");
          }}
          onProgress={({ duration, currentTime }) => {
            if (currentTime >= 500) {
              let currentPausedData = this.state.paused;
              currentPausedData[video.sid] = true;
              this.setState({paused: currentPausedData});
            }
          }}
          resizeMode="contain"
          style={{width: '100%', height: '100%', autoplay: false}}/>

        {(this.state.paused[video.sid] === true) ? 
          <Image source={VideoPlayIcon} 
              tintColor={'#fff'} 
              style={{
              justifyContent:'center', 
              alignItems: 'center', 
              width: 40, 
              height: 40, 
              position: 'absolute', 
              top: '50%',
              marginLeft: -20,
              left: '50%',
              marginTop: -20
            }} />
        :
        <ActivityIndicator
          color={'#fff'} 
          animated={true}
          style={{
            justifyContent:'center', 
            alignItems: 'center', 
            width: 30, 
            height: 30, 
            position: 'absolute', 
            top: '50%',
            marginLeft: -15,
            left: '50%',
            marginTop: -15
          }}
        />
        }
        
        <View style={{backgroundColor: 'rgba(0,0,0,0.3)', 
                      width:'100%', 
                      position:'absolute', 
                      bottom:0, 
                      height:50,
                      padding: 10,
                      flexDirection:'column', 
                      justifyContent:'center'}}>
          <Text style={{color: 'white'}}>{this.getProfileName(video.roomData[video.grouping_sids.participant_sid].userId)}</Text>
          <Text style={{color: 'white'}}>{this.calculateVideoDuration(video.duration)} from {moment(video.date_created).format('h:mm a')}, {moment(video.date_created).format('MMM d')}</Text>
        </View>
      </TouchableOpacity>
    )
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

  loadTwilioRoomIds = (gameScheduleId) => {
    firebase.firestore().collection("gameSchedule").doc(gameScheduleId).collection("twilioRooms")
        .get()
        .then(async querySnapshot => {
          let rooms = [];
          querySnapshot.forEach(doc => {
            rooms = [...rooms, doc.data()];
          });

          let videoRecordings = [];
          let audioRecordings = [];
          for (const room of rooms) {
            const response = await fetch('https://video.twilio.com/v1/Recordings?GroupingSid=' + room.roomSid + '&PageSize=20', {
              method: 'GET',
              headers: {"Authorization": "Basic QUM0ZTZkOWVhMzlhZjBjMTc3Yzc2NjVjZDI4YjgwMzZlODplZTdmZmM5ZTg4ZjIwNGIxNzRiZDBmNTllMTZiNjViMw=="}
            });
            const responseJson = await response.json();

            videoRecordings = [...videoRecordings, ...responseJson.recordings.filter(recording => recording.type === 'video')];
            audioRecordings = [...audioRecordings, ...responseJson.recordings.filter(recording => recording.type === 'audio')];
          }

          let videos = [];
          for (let recording of videoRecordings) {
            console.log("Fetching media link - ", recording.links.media);
            const response = await fetch(recording.links.media, {
              method: 'GET',
              headers: {"Authorization": "Basic QUM0ZTZkOWVhMzlhZjBjMTc3Yzc2NjVjZDI4YjgwMzZlODplZTdmZmM5ZTg4ZjIwNGIxNzRiZDBmNTllMTZiNjViMw=="}
            });
            const videoMediaFileLink = response.url;
            recording.videoMediaUrl = videoMediaFileLink;
            recording.roomData = rooms.find(room => room.roomSid==recording.grouping_sids.room_sid);
            videos = [...videos, recording];
          }
          this.setState({videos: videos, audios: audioRecordings, recordingsLoaded: true});
        });
  };

  constructor(props) {
    super(props);

    let game = props.route.params.game;
    this.state = { 
      fetchingAudioLink: false,
      modalPlayerOpened: false,
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
      overtimeRounds: 0
     };

    this.loadEventDetails(game.eventID);
    this.loadGameScores(props.route.params.game.gameID);
    this.loadUserProfiles(game);
    this.loadGameChallenges(game.gameScheduleId);
    this.loadTwilioRoomIds(game.gameScheduleId);
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
              {this.state.videos !== undefined && this.state.videos.length > 0 &&
                <TouchableOpacity
                  onPress={() => {
                    this.setState({recordingsCollapsed: !(this.state.recordingsCollapsed)});
                  }}>
                  <Image style={{  width: 22, height: 14 }}
                    source={this.state.challengesCollapsed ? ArrowUpImage : ArrowDownImage} />
                </TouchableOpacity>
              }
            </View>
            {(this.state.videos === undefined || this.state.videos.length === 0) ? (
              <Text style={{ color: 'white', fontSize: 12, marginTop: 20, textAlign:'center'}}>
                {!this.state.recordingsLoaded ? "Loading recordings..." : "No recordings in the game."}
              </Text>
            ) : (
              <>
              {this.state.recordingsCollapsed && 
                <FlatList
                    style={{margin: 10}}
                    data={this.state.videos}
                    renderItem={(item) => this.renderVideoThumbnail(item.item)}
                    keyExtractor={(item) => item.sid} />
              }
              </>
            )}
          </View>
        </ScrollView>

        <Modal 
          style={{marginTop:80, marginBottom: 80}}
          isVisible={this.state.modalPlayerOpened}
          animationIn="fadeIn" 
          animationOut="fadeOut">

            <View style={{flex:1, backgroundColor: '#000'}}>
              {this.state.modalPlayerOpened && 
                <>
                  {this.state.fetchingAudioLink ?
                    <ActivityIndicator
                      color={'#fff'} 
                      animated={true}
                      style={{
                        justifyContent:'center', 
                        alignItems: 'center', 
                        width: 30, 
                        height: 30, 
                        position: 'absolute', 
                        top: '50%',
                        marginLeft: -15,
                        left: '50%',
                        marginTop: -15
                      }} />
                  :
                  <>
                    <VLCPlayer
                      source={{uri:this.state.fullscreenVideoUrl}}
                      paused={this.state.videoShouldPause}
                      repeat={true}
                      seek={this.state.videoSeekTo}
                      resizeMode="contain"
                      style={{width: '100%', height: '100%', autoplay: false}}
                      onBuffering={() => {
                        
                      }}
                      onPlaying={(values) => {
                        console.log("Full screen player playing ", values);

                      }}
                      onProgress={({ duration, currentTime }) => {
                        if (this.state.videoReady === false) {
                          if (this.state.audioReady == false) {
                            console.log("Video now ready, but audio not ready, yet. Pause video and waiting for audio ready");
                            this.setState({videoReady: true, videoShouldPause: true});
                          } else {
                            console.log("Video now ready, audio ready, too. START PLAYING BOTH");
                            this.setState({videoReady: true, audioShouldPause: false, audioSeekTo: currentTime, fullScreenPlayingStarted: true});
                          }
                        }
                      }}/>

                    <VLCPlayer
                      source={{uri:this.state.audioMediaUrl}}
                      repeat={true}
                      paused={this.state.audioShouldPause}
                      seek={this.state.audioSeekTo}
                      playInBackground={true}
                      onPaused={() => {
                        console.log("Sound VLC Player paused,  waiting for video ready");
                      }}
                      onPlaying={(values) => {
                        console.log("Sound VLC player playing ", values);
                      }}
                      onProgress={({ duration, currentTime }) => {
                        if (this.state.audioReady === false) {
                          if (this.state.videoReady == false) {
                            console.log("Audio now ready, but video not ready, yet. Pause audio and waiting for video ready");
                            this.setState({audioReady: true, audioShouldPause: true});
                          } else {
                            console.log("Audio now ready, video ready, too. START PLAYING BOTH");
                            this.setState({audioReady: true, videoShouldPause: false, videoSeekTo: currentTime, fullScreenPlayingStarted: true});
                          }
                        }
                      }} />

                      {!this.state.fullScreenPlayingStarted && 
                        <ActivityIndicator
                          color={'#fff'} 
                          animated={true}
                          style={{
                            justifyContent:'center', 
                            alignItems: 'center', 
                            width: 30, 
                            height: 30, 
                            position: 'absolute', 
                            top: '50%',
                            marginLeft: -15,
                            left: '50%',
                            marginTop: -15}} />
                      }
                  </>
                  }
                </>
              }
              <TouchableOpacity style={{position: 'absolute', top: 20, right: 20}}
                onPress={() => {
                  this.setState({modalPlayerOpened: false, fullscreenVideoUrl: ""});
                }}>
                <Text style={{ color: 'white' }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
        </Modal>
      </SafeAreaView>
    );
  }
};