import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text
} from "react-native";

import { firebase } from '../../firebase';

import { calculateTotalScore, ScoringType } from './playUtils';

const GamePlayScoreHeaderView = (props) => {

  const { scoringType } = props;

  const { gameScheduleData, gameScoreData, currentRound } = props;

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const isMyUserId = (uid) => {
    return firebase.auth().currentUser.uid === uid
  }

  useEffect(() => {
    setPlayer1Score(calculateTotalScoreOfPlayer(gameScheduleData.player1ID));
    setPlayer2Score(calculateTotalScoreOfPlayer(gameScheduleData.player2ID));
  }, [gameScoreData]);

  const calculateTotalScoreOfPlayer = useCallback((playerId) => {
    return calculateTotalScore(playerId, scoringType, currentRound, gameScoreData.scores);
  }, [gameScoreData, currentRound]);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Text style={{fontSize: 12}}>
          Scoring: <Text style={{fontWeight: 'bold'}}>{scoringType}</Text>
        </Text>
      </View>
      <View style={ styles.scoreBoxContainer }>
        <View style={ styles.leftView }>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: 'black', paddingRight: 10 }}>
              {isMyUserId(gameScheduleData.player1ID) ? 'You' : gameScheduleData.player1Name}
            </Text>
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>
              {player1Score}
            </Text>
          </View>
        </View>
        <Text>:</Text>
        <View style={ styles.rightView }>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20, paddingRight: 10 }}>
              {player2Score}
            </Text>
            <Text style={{ color: 'black' }}>
              {isMyUserId(gameScheduleData.player2ID) ? 'You' : gameScheduleData.player2Name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default GamePlayScoreHeaderView;

const styles = StyleSheet.create({
  container: { 
    height: 24, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingLeft:15,
    paddingRight: 15
  },
  scoreBoxContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  leftView: { 
    alignItems: 'flex-end' 
  },
  rightView: { 
    alignItems: 'flex-start' 
  }
});