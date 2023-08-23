import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CountDownTimerPicker from "./CountDownTimerPicker";
import { firebase } from '../../../firebase';
import { ScoringType } from '../playUtils';

MaterialIcons.loadFont();

const PlayerModeViewHeader = (props) => {

  const {
    scoringType,
    gameScheduleId,
    gameScheduleData,
    gameScoreData,
    submitScoreAction,
    changeMyPlayingScoreAction
  } = props;

  const [shouldShowNotifyRequestButton, setShouldShowNotifyRequestButton] = useState(false);

  const [timerScore, setTimerScore] = useState(0);
  const [timerStopped, setTimerStopped] = useState(false);
  const [timerPlaying, setTimerPlaying] = useState(false);
  const [countDownTimerPlaying, setCountDownTimerPlaying] = useState(false);

  const [isCompleted, setCompleted] = useState(false);
  const [isMyTurn, setMyTurn] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);

  useEffect(() => {
    if (gameScheduleData.player1ID === firebase.auth().currentUser.uid) {
      setShouldShowNotifyRequestButton(true !== gameScheduleData.player2IsLive)
    } else if (gameScheduleData.player2ID === firebase.auth().currentUser.uid) {
      setShouldShowNotifyRequestButton(true !== gameScheduleData.player1IsLive)
    } else {
      setShouldShowNotifyRequestButton(false);
    }
  }, [gameScheduleData]);

  useEffect(() => {
    if (gameScoreData) {
      setCompleted(gameScoreData.completedAt !== undefined && gameScoreData.completedAt !== '');
      setMyTurn((gameScoreData.completedAt === undefined || gameScoreData.completedAt === '') && 
        (gameScoreData.roundFinished === undefined || !gameScoreData.roundFinished.includes(firebase.auth().currentUser.uid)));
      if (gameScoreData.round) {
        setCurrentRound(gameScoreData.round);
      } else {
        setCurrentRound(0);
      }
    }
  }, [gameScoreData]);

  useEffect(() => {
    if (isMyTurn) {
      setTimerStopped(false);
      setTimerPlaying(false);
      setCountDownTimerPlaying(false);
    }
  }, [isMyTurn, currentRound]);

  const requestNotifyToOtherPlayer = () => {
      fetch("https://us-central1-players-recreation-league.cloudfunctions.net/pushNotificationToPlayers", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ gameScheduleId: gameScheduleId })
      }).then(response => {
        console.log("got response => ", response);
        return response.json();
      }).then(jsonResponse => {
        console.log("got json response => ", jsonResponse);
        Toast.show({
          text1: "",
          text2: "Successfully notified to sign in."
        });
      });
    };

  
  
  return (
      <View style={{ height: 40, marginTop: 10, justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'blue', height: 30, marginEnd: 10, marginStart: 10 }}>

          {!isCompleted ?
                <View>
                  {/* <View style={{ height: 30, justifyContent: 'center', alignItems: "flex-end", marginRight: 10 }}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 14 }}>Opponents Turn</Text>
                  </View> */}
                </View>
          :
              <View>
                <View style={{ height: 30, justifyContent: 'center', alignItems: "flex-end", marginRight: 10 }}>
                  <Text style={{ color: 'white', textAlign: 'center', fontSize: 14 }}>Game completed</Text>
                </View>
              </View>
          }
          </View>

          {shouldShowNotifyRequestButton &&
              <TouchableOpacity 
                  style={styles.requestButtonView}
                  onPress={ requestNotifyToOtherPlayer }>
                  <Text style={{color: 'white', fontSize: 12}}>
                      Request Opponent to Sign In
                  </Text>
              </TouchableOpacity>
          }

          {!isCompleted &&
              <View style={[styles.myTurnViewStyle, 
                (timerPlaying && (scoringType.toLowerCase() === ScoringType.MostRepetitions.toLowerCase() || scoringType.toLowerCase() === ScoringType.MostTotalRepetitions.toLowerCase())) && 
                {right: 0}]}>
                {(scoringType.toLowerCase() === ScoringType.Normal.toLowerCase() || scoringType.toLowerCase() === ScoringType.LowestPoints.toLowerCase()) ?
                  <TouchableOpacity
                    onPress={() => {
                      submitScoreAction();
                    }}
                    style={styles.submitScoreButton}>
                    <Text style={{ color: 'white' }}>
                      Submit my score
                    </Text> 
                  </TouchableOpacity>
                :
                <>
                  {timerStopped ? 
                    <TouchableOpacity
                      onPress={() => {
                        submitScoreAction();
                      }}
                      style={styles.submitScoreButton}>
                      <Text style={{ color: 'white' }}>
                        Submit my score
                      </Text> 
                    </TouchableOpacity>
                  :
                  <>
                    {timerPlaying ?
                      <>
                        <CountDownTimerPicker 
                          backgroundColor="transparent"
                          startValue={0}
                          showMinutes={!(scoringType.toLowerCase() === ScoringType.MostRepetitions.toLowerCase() || scoringType.toLowerCase() === ScoringType.MostTotalRepetitions.toLowerCase())}
                          direction={1}
                          stopTimerCounting={(scoringType.toLowerCase() === ScoringType.MostRepetitions.toLowerCase() || scoringType.toLowerCase() === ScoringType.MostTotalRepetitions.toLowerCase()) ? 30 : undefined}
                          onCompleted={() => {
                            console.log("");
                            setTimeout(() => setTimerStopped(true), 500);
                          }}
                          timerChanged={(value) => {
                            if (scoringType.toLowerCase() === ScoringType.FastestTime.toLowerCase() || scoringType.toLowerCase() === ScoringType.LongestTime.toLowerCase()) {
                              setTimerScore(value);
                            }
                          }}
                          />
                        {!(scoringType.toLowerCase() === ScoringType.MostRepetitions.toLowerCase() || scoringType.toLowerCase() === ScoringType.MostTotalRepetitions.toLowerCase()) &&
                          <TouchableOpacity 
                            onPress={() => {
                              changeMyPlayingScoreAction(timerScore);
                              setTimerStopped(true);
                            }}
                            style={styles.stopTimerButton}>
                            <MaterialIcons color="white" size={30} name="timer-off"/>
                          </TouchableOpacity>
                        }
                      </>
                    :
                      <>
                        {countDownTimerPlaying ?
                          <CountDownTimerPicker 
                            startValue={3}
                            onCompleted={() => {
                              setTimeout(() => setTimerPlaying(true), 500);
                            }}/>
                          :
                          <TouchableOpacity 
                            onPress={() => setCountDownTimerPlaying(true)}
                            style={styles.startTimerButton}>
                            <MaterialIcons color="white" size={30} name="timer"/>
                          </TouchableOpacity>
                        }
                      </>
                    }
                  </>
                }
                </>
                }
          </View>
        }
      </View> 
  );
};

export default PlayerModeViewHeader;

const styles = StyleSheet.create({
    requestButtonView: {
        height: '100%',
        borderRadius: 20,
        backgroundColor: '#0B214D',
        position: "absolute",
        left:0,
        justifyContent:'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    myTurnViewStyle: { 
        height: '100%',
        alignItems: 'center', 
        right: -10, 
        position: "absolute", 
        borderRadius: 20, 
        flexDirection: 'row',
        paddingLeft: 10, 
        paddingRight: 10 
    },
    submitScoreButton: {
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: '#0B214D',
        height: 36,
        borderRadius: 18,
        paddingLeft: 10,
        paddingRight: 10
    },
    startTimerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },
    stopTimerButton: {
        marginLeft: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    }
});