import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from 'react-redux';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Dimensions,
  StatusBar
} from "react-native";

import VideoBroadcastingView from './videoBroadcastingView';

import { firebase } from '../../firebase';
import 'firebase/firestore';

import RBSheet from "react-native-raw-bottom-sheet";

import { useKeepAwake } from 'expo-keep-awake';

import PlayerView from "./playerView";
import AudienceView from './audienceView';
import CreateChallengeView from "./createChallenge";
import IncomingChallengesView from './incomingChallenges';

import pageStyleSheet from "./styles";

import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useAdsBanner } from '@hooks';

import GamePlayNavHeaderView from "./GamePlayNavHeaderView";
import GamePlayScoreHeaderView from "./GamePlayScoreHeaderView";
import AudienceModeViewHeader from "./audienceView/AudienceModeViewHeader";
import PlayerModeViewHeader from "./playerView/PlayerModeViewHeader";

import { calculateTotalScore, ScoringType } from './playUtils';

import AudioSession from 'react-native-audio-session';

AntDesign.loadFont();
MaterialIcons.loadFont();

const styles = StyleSheet.create(pageStyleSheet);

const dimensionWindow = Dimensions.get("window");

/*
* gameScheduleId: game.gameScheduleId,
* pageTitle: 'Game #' + game.gameID
*/

const GameScreen = (props) => {

  useKeepAwake();

  const { auth } = useSelector(s => s);

  const [
    renderBanner,
    BannerAdsComponent
  ] = useAdsBanner(auth);

  const refRBSheet = useRef();

  const unsubscribeScoreSnapshotRef = useRef();
  const unsubscribeGameScheduleDetailsRef = useRef();

  const [myUserId, setMyUserId] = useState("");

  const [gameScheduleData, setGameScheduleData] = useState({});  
  const [playerId1, setPlayerId1] = useState("");
  const [playerId2, setPlayerId2] = useState("");
  const [player1Name, setPlayer1Name] = useState("You");
  const [player2Name, setPlayer2Name] = useState("Opponent");
  const [opponentId, setOpponentId] = useState("");
  const [gameID, setGameID] = useState("");
  const [totalRounds, setTotalRounds] = useState(1);
  const [isPlayingMode, setPlayingMode] = useState();

  const [currentGamePlayData, setCurrentGamePlayData] = useState({});
  const [currentRound, setCurrentRound] = useState(0);
  const [gameEachRoundScores, setGameEachRoundScores] = useState({});
  const [gamePlayId, setGamePlayId] = useState("");
  
  const [myPlayingScore, setMyPlayingScore] = useState(0);
  
  const [loadingGameData, setLoadingGameData] = useState(true);
  const [overlayedLoading, setOverlayedLoading] = useState(false);

  const { navigation, route } = props;

  const [scoringType, setScoringType] = useState(ScoringType.Normal);
  const [scoreEnterAvailable, setScoreEnterAvailable] = useState(true);

  let disconnected = false;

  const snapshotGameScheduleDocument = () => {

    if (unsubscribeGameScheduleDetailsRef?.current) {
      unsubscribeGameScheduleDetailsRef?.current();
    }

    unsubscribeGameScheduleDetailsRef.current = firebase.firestore().collection("gameSchedule").doc(route.params.gameScheduleId)
      .onSnapshot(doc => {
        if (doc.exists) {
          setGameScheduleData(doc.data());
        }
      });
  }

  const _loadGameInformation = () => {

    if (route.params.gameScheduleId !== "") {

      firebase.firestore().collection("gameSchedule").doc(route.params.gameScheduleId)
        .get()
        .then(async documentSnapshot => {

          if (documentSnapshot.exists) {
            snapshotGameScheduleDocument();
            if (documentSnapshot.data().scoringType !== undefined) {
              setScoringType(documentSnapshot.data().scoringType);
            }
            setGameScheduleData(documentSnapshot.data());
            _gameScheduleDataUpdated(documentSnapshot.data());
          }
        })
        .catch(error => {
          console.log("Error while getting game information", error);
        });
    }
  };

  const _gameScheduleDataUpdated = async (gameSchedule) => {

    if (gameSchedule !== undefined) {

      if (!disconnected) {
        let player1ID = gameSchedule.player1ID;
        let player2ID = gameSchedule.player2ID;
  
        setPlayerId1(player1ID);
        setPlayerId2(player2ID);
  
        setGameID(gameSchedule.gameID);
        setTotalRounds(gameSchedule["gameTotalRounds"]);
        _snapshotScore(gameSchedule.gameID);
        fetchPlayersInformation(player1ID, player2ID);

        const myUserID = firebase.auth().currentUser.uid;
  
        if (player1ID !== myUserID && player2ID !== myUserID) {
          setPlayingMode(false);
          registerAudience();
        } else {
          setPlayingMode(true);
          if (player1ID === myUserID) {
            setOpponentId(player2ID);
            firebase.firestore().collection("gameSchedule").doc(route.params.gameScheduleId).update({ player1IsLive: true });
          } else {
            setOpponentId(player1ID);
            firebase.firestore().collection("gameSchedule").doc(route.params.gameScheduleId).update({ player2IsLive: true });
          }
        }
      }      
    }
  };

  const registerAudience = () => {
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(doc => {
      if (doc.exists) {
        let userData = doc.data();
        let myUsername = userData.email.substring(0, userData.email.lastIndexOf("@"));
        let ref = firebase.firestore().collection("gameSchedule").doc(route.params.gameScheduleId).collection("audiences").doc(doc.id);
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

  const fetchPlayersInformation = (player1ID, player2ID) => {
    firebase.firestore().collection("users").doc(player1ID).get()
      .then(doc => {
        if (doc.exists) {
          let userData = doc.data();
          if (!disconnected) {
            setPlayer1Name(userData.email.substring(0, userData.email.lastIndexOf("@")));
          }
        } else {
          console.log("Player 1 information no-exists");
        }
      })
      .catch(err => {
        console.log('Error getting player 1 information.', err);
      });

    firebase.firestore().collection("users").doc(player2ID).get()
      .then(doc => {
        if (doc.exists) {
          let userData = doc.data();
          if (!disconnected) {
            setPlayer2Name(userData.email.substring(0, userData.email.lastIndexOf("@")));
          }
        } else {
          console.log("Player 2 information no-exists");
        }
      })
      .catch(err => {
        console.log('Error getting player 2 information.', err);
      })
  };

  let gameScoreDocumentCreated = false;

  const _snapshotScore = (gameIDValue) => {
    if (gameIDValue !== "") {
      console.log("gameID - ", gameIDValue);

      if (unsubscribeScoreSnapshotRef?.current) {
        unsubscribeScoreSnapshotRef?.current();
      }

      unsubscribeScoreSnapshotRef.current = firebase.firestore().collection("gameScores").where("gameID", '==', gameIDValue)
        .onSnapshot(querySnapshot => {

          var found = false;

          querySnapshot.forEach((doc) => {
            found = true;
            setCurrentGamePlayData(doc.data());
            let playingData = doc.data();
            if (gamePlayId === "") {
              setGamePlayId(doc.id);
            }
            if (playingData.hasOwnProperty("round")) {
              setCurrentRound(playingData["round"]);
            } else {
              setCurrentRound(0);
            }

            if (playingData.hasOwnProperty("scores")) {
              setGameEachRoundScores(playingData["scores"]);
            } else {
              setGameEachRoundScores({});
            }
          });

          setLoadingGameData(false);

          if (found === false && gameScoreDocumentCreated === false) {
            gameScoreDocumentCreated = true;
            firebase.firestore().collection("gameScores").doc().set({ gameID: gameIDValue, round: 0 }, {merge: true});
          }
        });
    }
  };

  const handleMoveOvertime = () => {
    console.log("handle move overtime");
    let currentOvertime = 0;
    if (currentGamePlayData !== undefined && currentGamePlayData.overtimeRounds !== undefined && currentGamePlayData.overtimeRounds > 0) {
      currentOvertime = currentGamePlayData.overtimeRounds;
    }
    console.log("Overtime updating to ", gamePlayId, " to ", currentOvertime + 1);
    firebase.firestore().collection("gameScores").doc(gamePlayId).update({ roundFinished: [], round: currentRound + 1, overtimeRounds:  currentOvertime + 1});
  };

  const submitRoundScore = () => {
    console.log("Submitting round score gamePlayID => ", gamePlayId);
    
    let currentOvertime = 0;
    if (currentGamePlayData !== undefined && currentGamePlayData.overtimeRounds !== undefined && currentGamePlayData.overtimeRounds > 0) {
      currentOvertime = currentGamePlayData.overtimeRounds;
    }

    console.log("current overtime rounds", currentOvertime);
    let updating = {};
    updating["scores." + firebase.auth().currentUser.uid + "." + currentRound] = myPlayingScore;
    firebase.firestore().collection("gameScores").doc(gamePlayId).update(updating);

    if (currentGamePlayData.hasOwnProperty("roundFinished")) {
      if (currentGamePlayData.roundFinished.length > 0) {
        if (currentRound == totalRounds + currentOvertime - 1) {

          let currentTotalScore1 = calculatePlayerScore(playerId1);
          let currentTotalScore2 = calculatePlayerScore(playerId2);

          if (playerId1 === firebase.auth().currentUser.uid) {
            currentTotalScore1 += myPlayingScore;
          } else {
            currentTotalScore2 += myPlayingScore;
          }

          console.log("Scores => ", currentTotalScore1, " VS ", currentTotalScore2);

          if (currentTotalScore2 === currentTotalScore1) {
            Alert.alert("Overtime", "Total scores are same. Moving to overtime round", [{
              text: "Ok",
              onPress: handleMoveOvertime,
              style: "default"
            }]);
          } else {
            let completedTime = new Date().getTime();
            firebase.firestore().collection("gameScores").doc(gamePlayId).update({ roundFinished: [], completedAt:  completedTime});
            firebase.firestore().collection("gameSchedule").doc(route.params.gameScheduleId).update({ 
              gameCompletedAt: completedTime,
              gameStatus: "Final"
            });
          }
        } else {
          firebase.firestore().collection("gameScores").doc(gamePlayId).update({ roundFinished: [], round: currentRound + 1 });
        }
      } else {
        firebase.firestore().collection("gameScores").doc(gamePlayId).update({ roundFinished: [firebase.auth().currentUser.uid] });
      }
    } else {
      firebase.firestore().collection("gameScores").doc(gamePlayId).update({ roundFinished: [firebase.auth().currentUser.uid] });
    }
  }

  const _roundAction = () => {
    Alert.alert(
      "Submit score", 
      `Are you sure you want to submit your current round score - ${myPlayingScore}pt, total score - ${calculatePlayerScore(firebase.auth().currentUser.uid) + myPlayingScore}pt?`,
      [
        {
          text: "Yes",
          onPress: submitRoundScore,
          style: "default"
        },
        {
          text: "No",
          style: "cancel"
        },
      ]
    )
  }

  const calculatePlayerScore = useCallback((playerId) => {
    return calculateTotalScore(playerId, scoringType, currentRound, gameEachRoundScores);
  }, [gameEachRoundScores, currentRound]);

  useEffect(() => {

    setMyUserId(firebase.auth().currentUser.uid);
    _loadGameInformation();
    // AudioSession.setCategory('Playback');
    // AudioSession.setMode('VideoChat');

    AudioSession.setCategoryAndMode('Playback', 'VoiceChat', 'MixWithOthers')
    .then(() => {
      console.log("AudioSession setitng succeeded");
    })
    .catch(error => {
      console.log("AudioSession setitng failed with error", error);
    });

    return () => {

      disconnected = true;

      if (unsubscribeGameScheduleDetailsRef?.current) {
        console.log("unsubscribing snapshot for game schedule detail ref");
        unsubscribeGameScheduleDetailsRef?.current();
      } 

      if (unsubscribeScoreSnapshotRef?.current) {
        console.log("unsubscribing snapshot in GameView before going back");
        unsubscribeScoreSnapshotRef?.current();
      }
    };
  }, []);

  return (

    <SafeAreaView style={styles.safeAreaStyles}>

      <StatusBar barStyle="dark-content" />

      <GamePlayNavHeaderView 
        gameScheduleId={route.params.gameScheduleId}
        game={gameScheduleData}
        onBack={async () => {
          setOverlayedLoading(true);
          if (gameScheduleData) {
            if (myUserId === gameScheduleData.player1ID) {
              await firebase.firestore().collection("gameSchedule").doc(route.params.gameScheduleId).update({ player1IsLive: false });
            } else if (myUserId === gameScheduleData.player2ID) {
              await firebase.firestore().collection("gameSchedule").doc(route.params.gameScheduleId).update({ player2IsLive: false });
            }
          }    
          setOverlayedLoading(false);
          navigation.goBack()
        }}
        onMessage={() => {
          navigation.navigate('ChatScreen', {game: gameScheduleData, gameScheduleId: route.params.gameScheduleId});
        }}
      />

      {loadingGameData ? 
      <View style={{ width: '100%', height: dimensionWindow.height, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <ActivityIndicator color="#ffffff" />
      </View>
      :
      <>
        <GamePlayScoreHeaderView 
          gameScheduleData={gameScheduleData}
          gameScoreData={currentGamePlayData}
          scoringType={scoringType}
          currentRound={currentRound}
        />

        <View style={styles.container}>
          {(gameScheduleData !== undefined && playerId1 !== '' && playerId2 !== '' && isPlayingMode !== undefined) &&
            <VideoBroadcastingView 
              gameScheduleId={route.params.gameScheduleId}
              gameData={gameScheduleData}
              playingMode={isPlayingMode}
              player1Name={player1Name}
              player2Name={player2Name}
              playerId1={playerId1}
              playerId2={playerId2}
            />
          }

          {(true === isPlayingMode) && 
            <PlayerModeViewHeader 
              scoringType={scoringType}
              gameScheduleId={route.params.gameScheduleId}
              gameScheduleData={gameScheduleData}
              gameScoreData={currentGamePlayData}
              submitScoreAction={_roundAction}
              changeMyPlayingScoreAction={setMyPlayingScore} />
          } 
          {(false === isPlayingMode) &&
            <AudienceModeViewHeader 
              onCreatePick={ () => refRBSheet.current.open() } />
          }

          <View style={styles.bottomBox}>
            {(true === isPlayingMode) &&
              <PlayerView
                scoringType={scoringType}
                scoreEnterAvailable={scoringType.toLowerCase() !== ScoringType.FastestTime.toLowerCase() && scoringType.toLowerCase() !== ScoringType.LongestTime.toLowerCase() && scoreEnterAvailable}
                scoreValue={myPlayingScore}
                gameScheduleId={route.params.gameScheduleId}
                gameID={gameID}
                onChangeScore={(score) => {
                  console.log("My score changed to ", score);
                  setMyPlayingScore(score);
                }}
                currentRound={currentRound}
                roundScores={gameEachRoundScores}
                myUserId={myUserId}
                totalRounds={totalRounds}
                overtimeRounds={(currentGamePlayData !== undefined ? (currentGamePlayData.overtimeRounds !== undefined ? currentGamePlayData.overtimeRounds : 0) : 0)}
                opponentUserId={opponentId}
                enableCounter={isPlayingMode &&
                  (currentGamePlayData.completedAt === undefined && (currentGamePlayData.roundFinished === undefined || !currentGamePlayData.roundFinished.includes(firebase.auth().currentUser.uid)))}
                gamePlayId={gamePlayId} />
            }
            {(false === isPlayingMode) &&
                <AudienceView
                  gameScheduleId={route.params.gameScheduleId}
                  player1Id={playerId1}
                  player2Id={playerId2}
                  player1Name={player1Name}
                  player2Name={player2Name}
                  onCreateChallenge={() => {
                    refRBSheet.current.open();
                  }} />
            }
          </View>

          {renderBanner &&
            <View style={{
              width: '100%', 
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <BannerAdsComponent />
            </View>
          }

          {false === isPlayingMode &&
            <IncomingChallengesView
              gameScheduleId={route.params.gameScheduleId} />
          }
        </View>
      </>
      }

      <RBSheet
        ref={refRBSheet}
        height={dimensionWindow.height - 80}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          raggableIcon: { backgroundColor: "#000" },
          container: { borderTopLeftRadius: 15, borderTopRightRadius: 15 }
        }}>
        <CreateChallengeView
          game={gameScheduleData}
          gameScheduleId={route.params.gameScheduleId}
          eventID={gameScheduleData.eventID}
          gameID={gameID}
          player1Id={playerId1}
          player2Id={playerId2}
          player1Name={player1Name}
          player2Name={player2Name}
          onDismiss={() => { refRBSheet.current.close() }}
        />
      </RBSheet>

      { overlayedLoading && (
        <View style={{ position: 'absolute', width: '100%', height: dimensionWindow.height, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <ActivityIndicator color="#7f7f7f" />
        </View>
      )
      }
    </SafeAreaView>
  );
};

export default GameScreen;