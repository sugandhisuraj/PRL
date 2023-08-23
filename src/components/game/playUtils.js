import React from "react";

export const ScoringType = {
    Normal: "Most Points", // Most Points for default
    FastestTime: "Fastest Time",
    MostRepetitions: "Most Repetitions",
    MostTotalRepetitions: "Most Total Repetitions",
    LowestPoints: "Lowest Points",
    LongestTime: "Longest Time"
};

export const calculateTotalScore = (playerId, scoringType, currentRound, gameEachRoundScores) => {
    let score = 0;

    if (scoringType.toLowerCase() === ScoringType.FastestTime.toLowerCase()) {
      score = 99999;
    } else if (scoringType.toLowerCase() === ScoringType.MostRepetitions.toLowerCase() || scoringType === ScoringType.LongestTime.toLowerCase()) {
      score = -9999;
    }

    if (gameEachRoundScores === undefined) {
        return 0;
    }

    for (let idx = 0; idx <= currentRound; idx++) {
      if (gameEachRoundScores.hasOwnProperty(playerId)) {
        if (gameEachRoundScores[playerId].hasOwnProperty(idx)) {
          if (scoringType.toLowerCase() === ScoringType.FastestTime.toLowerCase()) {
            score = Math.min(score, gameEachRoundScores[playerId][idx]);
          } else if (scoringType.toLowerCase() === ScoringType.MostRepetitions.toLowerCase() || scoringType.toLowerCase() === ScoringType.LongestTime.toLowerCase()) {
            score = Math.max(score, gameEachRoundScores[playerId][idx]);
          } else {
            score += gameEachRoundScores[playerId][idx];
          }
        }
      } else {
        return 0;
      }
    }
    return score;
}