import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";

import styleSheet from "./styles";

import { firebase } from '../../../firebase';
import 'firebase/firestore';

import { calculateTotalScore } from '../playUtils';

const styles = StyleSheet.create(styleSheet);

const PlayerModeView = (props) => {

  const { scoringType, scoreEnterAvailable } = props;

  const [roundScores, setRoundScores] = useState({});
  const [counterValue, setCounterValue] = useState(props.scoreValue ?? 0);
  const [isAllRoundMode, setAllRoundMode] = useState(false);
  
  const unsubscribeRef = useRef();

  useEffect(() => {
    setCounterValue(props.scoreValue ?? 0);
  }, [props.scoreValue]);

  useEffect(() => {

    loadGameScoreData();

    return () => {
      if (unsubscribeRef?.current) {
        console.log("unsubscribed snapshot in PlayerView componentWillUnmount.");
        unsubscribeRef?.current();
      }
    }
  }, []);

  const loadGameScoreData = () => {
    if (unsubscribeRef?.current) {
      console.log("unsubscribed snapshot in PlayerView.");
      unsubscribeRef?.current();
    }

    unsubscribeRef.current = firebase.firestore().collection("gameScores").where("gameID", '==', props.gameID)
      .onSnapshot(querySnapshot => {
        var found = false;
        querySnapshot.forEach((doc) => {
          if (found) {
            return;
          }
          found = true;
          setRoundScores(doc.data().scores);
          setCounterValue(calculateMyRoundScore(props.currentRound, doc.data().scores));
        });
      });
  }

  const calculateMyRoundScore = (roundNumber, roundScoresVal) => {
    if (roundScoresVal !== undefined) {
      if (roundScoresVal.hasOwnProperty(props["myUserId"])) {
        if (roundScoresVal[props["myUserId"]].hasOwnProperty(roundNumber)) {
          return roundScoresVal[props["myUserId"]][roundNumber];
        }
      }
    }
    
    return 0;
  };

  const myRoundScore = (roundNumber) => {

    if (roundScores !== undefined) {
      if (roundScores.hasOwnProperty(props["myUserId"])) {
        if (roundScores[props["myUserId"]].hasOwnProperty(roundNumber)) {
          return roundScores[props["myUserId"]][roundNumber];
        }
      }
    }
    
    return 0;
  }

  const opponentRoundScore = (roundNumber) => {
    if (roundScores !== undefined) {
      if (roundScores.hasOwnProperty(props["opponentUserId"])) {
        if (roundScores[props["opponentUserId"]].hasOwnProperty(roundNumber)) {
          return roundScores[props["opponentUserId"]][roundNumber];
        }
      }
    }

    return 0;
  }

  const calculateMyTotalScore = () => {
    return calculateTotalScore(props["myUserId"], scoringType, props.currentRound, roundScores);
  }

  const calculateOpponentTotalScore = () => {
    return calculateTotalScore(props["opponentUserId"], scoringType, props.currentRound, roundScores);
  }

  const addMyScore = () => {
    setCounterValue(counterValue + 1);
    props.onChangeScore(counterValue + 1);
  };

  const minusMyScore = () => {
    setCounterValue(counterValue - 1);
    props.onChangeScore(counterValue - 1);
  };

  let totalGameRounds = props.totalRounds;
  if (props.overtimeRounds !== undefined) {
    totalGameRounds += props.overtimeRounds;
  }
  var roundsLoop = [];
  for (let i = 0; i < totalGameRounds; i++) {
    roundsLoop.push(
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <Text style={[{ 
            textAlign: 'center', 
            fontWeight: 'bold', 
            fontSize: 16 
          }, (i === props.currentRound) ? { color: 'blue' } : ( (i >= props.totalRounds) ? { color: 'red' } : null)]}>
            {i + 1}
          </Text>
        </View>
        <View style={{ justifyContent: 'center', flex: 2 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, color: (i >= props.totalRounds) ? 'red' : 'black' }}>
            {myRoundScore(i)}
          </Text>
        </View>
        <View style={{ justifyContent: 'center', flex: 2 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, color: (i >= props.totalRounds) ? 'red' : 'black' }}>
            {opponentRoundScore(i)}
          </Text>
        </View>
      </View>
    );
  }


  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flex: isAllRoundMode ? 1 : 2, flexDirection: 'column' }}>
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
            Round
          </Text>
        </View>
        <TouchableOpacity style={[styles.textContainer, { flex: 2, backgroundColor: 'blue' }]}
          onPress={() => setAllRoundMode(!isAllRoundMode)}>
          {!isAllRoundMode && (
            <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              You
            </Text>
          )}
        </TouchableOpacity>
        <View style={[styles.textContainer, { flex: 2, backgroundColor: 'gray' }]}>
          {!isAllRoundMode && (
            <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              Opponent
            </Text>
          )}
        </View>
      </View>
      { !isAllRoundMode ? (
        <View style={{ flex: 3, flexDirection: 'column' }}>
          <View style={[styles.textContainer, { flex: 1 }]}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, color: (props.currentRound >= props.totalRounds) ? 'red' : 'blue' }}>
              {props["currentRound"] + 1}
              {(props.currentRound >= props.totalRounds) ? " - overtime" : ""}
            </Text>
          </View>
          <View style={[styles.textContainer, { flex: 2, alignItems: 'center' }]}>
            {props.enableCounter ?
              <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  {
                    <TouchableOpacity style={{ width: 50 }}
                      disabled={counterValue == 0}
                      onPress={() => {
                        minusMyScore()
                      }}>
                      <Text style={{ textAlign: 'center' }}>
                        -
                      </Text>
                    </TouchableOpacity>
                  }
                  <Text style={{ textAlign: 'center', fontSize: 16 }}>
                    {counterValue}
                  </Text>
                  {
                    <TouchableOpacity 
                      style={{ width: 50 }}
                      onPress={() => {
                        addMyScore()
                      }}>
                      <Text style={{ textAlign: 'center' }}>
                        +
                      </Text>
                    </TouchableOpacity>
                  }
                </View>
              </View>
              :
              <Text style={{ textAlign: 'center', fontSize: 16 }}>
                { myRoundScore(props.currentRound) }
              </Text>
            }
          </View>
          <View style={[styles.textContainer, { flex: 2 }]}>
            <Text style={{ textAlign: 'center', fontSize: 16 }}>
              {opponentRoundScore(props["currentRound"])}
            </Text>
          </View>
        </View>
      ) : (
          <View style={{ flex: 3, flexDirection: 'row' }}>
            { roundsLoop}
          </View>
        )}
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={[styles.textContainer, { flex: 1 }]}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
            Total
          </Text>
        </View>
        <View style={[styles.textContainer, { flex: 2 }]}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
            {calculateMyTotalScore()}
          </Text>
        </View>
        <View style={[styles.textContainer, { flex: 2 }]}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
            {calculateOpponentTotalScore()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PlayerModeView;