import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  SectionList,
  FlatList
} from "react-native";

import { firebase } from '../../firebase';
import BackImg from '@assets/arrow_left.png';
import 'firebase/firestore';
import ArrowForwardImage from '@assets/arrow_forward.png';
import { ActivityIndicator } from "react-native";

const EventChallengesView = ({ navigation, route }) => {

  const [me, setMe] = useState(null);
  const [current, setCurrent] = useState([]);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [gameSchedules, setGameSchedules] = useState([]);

  const challengesSnapshotUnsubscribe = useRef(null);

  const splitIdsArray = (ids) => {
    if (ids.length > 0) {
      let splittedIds = [];
      let seeker = 0;
      while (seeker < ids.length) {
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

  const getChallengesData = useCallback(() => {
    return [
      {
        title: "Current",
        data: current
      },
      {
        title: "Pending",
        data: pending
      },
      {
        title: "Completed",
        data: completed
      }
    ];
  }, [current, pending, completed]);

  const loadGameSchedulesNew = async (gameIds) => {
    let splittedIdsArray = splitIdsArray(gameIds);
    let games = [];
    const promises = splittedIdsArray.map(async idsArray => {
      const querySnapshot = await firebase.firestore().collection("gameSchedule")
        .where("gameID", "in", idsArray)
        .get();
      
      querySnapshot.forEach(documentSnapshot => {
        let game = documentSnapshot.data();
        game.gameScheduleId = documentSnapshot.id;
        games = [...games, game];
      });
    });
    
    await Promise.all(promises);
    console.log(`Loaded gameSchedules data new ${games.length} games`);
    
    setGameSchedules([...gameSchedules, ...games]);
  };

  const loadChallengesOfEvent = async () => {

    challengesSnapshotUnsubscribe.current = firebase.firestore().collection('challenges')
      .where('eventID', "==", route.params.event.eventID)
      .where('users', 'array-contains-any', [me.uid, 'all'])
      .onSnapshot(async querySnapshot => {
        
        console.log(`Loaded ${querySnapshot.size} challenges.`);

        let gameIDs = [];
        let allChallengesOfEventForMe = [];
        for (const doc of querySnapshot.docs) {
          const challenge = doc.data();
          if (challenge.opponent !== 'all' || !challenge.declinedUsers.includes(me.uid)) {
            allChallengesOfEventForMe = [...allChallengesOfEventForMe, challenge];

            const gameID = challenge.gameID;
            if (!gameIDs.includes(gameID) && !gameSchedules.includes(gameSchedule => gameSchedule.gameID === gameID)) {
              gameIDs = [...gameIDs, gameID];
            }
          }          
        }

        console.log(`Filtered => ${allChallengesOfEventForMe.length} challenges and ${gameIDs.length} games`);

        await loadGameSchedulesNew(gameIDs);

        setCurrent(groupedChallenges(allChallengesOfEventForMe.filter(challenge => challenge.status === "accepted"), "Current"));
        setPending(groupedChallenges(allChallengesOfEventForMe.filter(challenge => challenge.status === "pending"), "Pending"));
        setCompleted(groupedChallenges(allChallengesOfEventForMe.filter(challenge => challenge.status === "completed"), "Completed"));
        setLoaded(true);

      });
  };

  const groupedChallenges = (challenges, type) => {
    let res = [];
    challenges.forEach(challenge => {
      const resIdx = res.findIndex(item => item.gameID === challenge.gameID)
      if (resIdx !== -1) {
        const newChallenges = [...res[resIdx].challenges, challenge]
        res[resIdx] = { gameID: challenge.gameID, type: type, challenges: newChallenges};
      } else {
        res = [...res, { gameID: challenge.gameID, type: type, challenges: [challenge] }];
      }
    });

    return res.sort((challenge1, challenge2) => {
      if (challenge1.gameID < challenge2.gameID)
        return 1;
      else
        return -1;
    })
  }

  const calculateTotalSumOfMyPointsInChallenges = (challenges) => {
    let sum = 0;
    challenges.forEach(challenge => {
      sum += challenge.points;
    });
    return sum
  }

  const calculateEarningPoints = (challenges) => {
    let sum = 0;
    challenges.forEach(challenge => {
      if (challenge.challengeSenderId === me.uid) {
        if (challenge.challengeGameWinnerId === challenge.gameRealWinnerId) {
          sum += challenge.points;
        } else {
          sum -= challenge.points;
        }
      } else {
        if (challenge.challengeGameWinnerId === challenge.gameRealWinnerId) {
          sum -= challenge.points;
        } else {
          sum += challenge.points;
        }
      }
    });
    return sum;
  }

  const challengesCountForOpeningFromMe = (groupedChallenge) => {
    let ct = 0;
    for (const challenge of groupedChallenge.challenges) {
      if (challenge.challengeSenderId === me.uid) {
        ct += 1;
      }
    }
    return ct;
  };

  const calculatePointsForOpeningFromMe = (groupedChallenge) => {
    let sum = 0;
    for (const challenge of groupedChallenge.challenges) {
      if (challenge.challengeSenderId === me.uid) {
        sum += challenge.points;
      }
    }
    return sum;
  }

  const challengesCountForOpeningToMe = (groupedChallenge) => {
    let ct = 0;
    for (const challenge of groupedChallenge.challenges) {
      if (challenge.opponent === me.uid) {
        ct += 1;
      }
    }
    return ct;
  };

  const calculatePointsForOpeningToMe = (groupedChallenge) => {
    let sum = 0;
    for (const challenge of groupedChallenge.challenges) {
      if (challenge.opponent === me.uid) {
        sum += challenge.points;
      }
    }
    return sum;
  }

  const challengesCountForOpenToAll = (groupedChallenge) => {
    let ct = 0;
    for (const challenge of groupedChallenge.challenges) {
      if (challenge.opponent === 'all' && challenge.challengeSenderId !== me.uid) {
        ct += 1;
      }
    }
    return ct;
  };

  const calculatePointsForOpenToAll = (groupedChallenge) => {
    let sum = 0;
    for (const challenge of groupedChallenge.challenges) {
      if (challenge.opponent === 'all' && challenge.challengeSenderId !== me.uid) {
        sum += challenge.points;
      }
    }
    return sum;
  }

  const challengePointSummaryText = (groupedChallenge) => {
    if (groupedChallenge.type === "Pending") {
      return calculateTotalSumOfMyPointsInChallenges(groupedChallenge.challenges) + "pt";
    } else if (groupedChallenge.type === "Current") {
      return calculateTotalSumOfMyPointsInChallenges(groupedChallenge.challenges) + "pt";
    } else {
      const earning = calculateEarningPoints(groupedChallenge.challenges);
      if (earning > 0) {
        return `${earning}pt earned`
      } else {
        return `${-earning}pt lost`
      }
    }
  }

  const gameDataForGameID = (gameId) => {
    return gameSchedules.find(game => game.gameID === gameId);
  }

  const gameVersusString = (gameID) => {
    const gameSchedule = gameSchedules.find(game => game.gameID === gameID);
    if (gameSchedule === undefined) {
      return ""
    } else {
      if (gameSchedule.gameStatus === "Final") {
        return gameSchedule.player1Name + ":" + gameSchedule.player1Score + " - " + gameSchedule.player2Name + ":" + gameSchedule.player2Score;
      } else {
        return gameSchedule.player1Name + " : " + gameSchedule.player2Name;
      }
    }
  }

  const renderItem = (challenge) => {
    return (
      <View style={{
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 5,
        borderRadius: 10,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        alignItems: 'center',
        padding: 10
      }}>
        <View style={{
          flexDirection: 'column',
          flex: 1
        }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
              Game#{challenge.gameID} - &nbsp;
          </Text>
            <Text style={{ fontSize: 14 }}>
              { gameVersusString(challenge.gameID) }
            </Text>
          </View>
          {(challenge.type === 'Current' || challenge.type === 'Completed') ?
          <Text style={{ flex: 1, flexDirection: 'row', alignItems: 'center', fontSize: 14, marginTop: 5 }}>
            <Text style={{fontWeight: 'bold' }}>{challengePointSummaryText(challenge)}</Text>
            &nbsp;in&nbsp;
            <Text style={{fontWeight: 'bold' }}>{challenge.challenges.length} picks</Text>
          </Text>
          :
          <>
            {calculatePointsForOpeningFromMe(challenge) > 0 &&
              <Text style={{ flex: 1, flexDirection: 'row', alignItems: 'center', fontSize: 14, marginTop: 5 }}>
                You opened&nbsp;
                <Text style={{fontWeight: 'bold' }}>{challengesCountForOpeningFromMe(challenge)} picks</Text>
                &nbsp;-&nbsp;
                <Text style={{fontWeight: 'bold' }}>{calculatePointsForOpeningFromMe(challenge)}pt</Text>
              </Text>
            }
            {calculatePointsForOpeningToMe(challenge) > 0 &&
              <Text style={{ flex: 1, flexDirection: 'row', alignItems: 'center', fontSize: 14, marginTop: 5 }}>
                <Text style={{fontWeight: 'bold' }}>{challenge.challenges.length} picks offer to you</Text>
                &nbsp;-&nbsp;
                <Text style={{fontWeight: 'bold' }}>{calculatePointsForOpeningToMe(challenge)}</Text>
              </Text>
            }
            {calculatePointsForOpenToAll(challenge) > 0 &&
              <Text style={{ flex: 1, flexDirection: 'row', alignItems: 'center', fontSize: 14, marginTop: 5 }}>
                <Text style={{fontWeight: 'bold' }}>{challengesCountForOpenToAll(challenge)} picks</Text>
                &nbsp;Open to all - &nbsp;
                <Text style={{fontWeight: 'bold' }}>{calculatePointsForOpenToAll(challenge)}pt</Text>
              </Text>
            }
          </>}
          
        </View>
        <TouchableOpacity 
          style={{ 
            width: 40, 
            height: 40, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#0B214D', 
            borderRadius: 10 
          }}
          onPress={() => {
            navigation.navigate("Game Challenges List", {
              gameID: challenge.gameID,
              gameSchedule: gameDataForGameID(challenge.gameID),
              challenges: challenge.challenges,
              type: challenge.type
            });
          }}>
          <Image style={{ tintColor: 'white', width: 16, height: 16 }} source={ArrowForwardImage} />
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setMe(user);
      } else {
        console.log("auth current user is Invalid");
      }
    });
    return () => {
      if (challengesSnapshotUnsubscribe?.current) {
        console.log("unsubscribed snapshot in EventChallengesView.");
        challengesSnapshotUnsubscribe?.current();
      }
      unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (me) {
      loadChallengesOfEvent();
    }
  }, [me]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ height: 40, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => {
            if (challengesSnapshotUnsubscribe?.current) {
              console.log("unsubscribed snapshot in EventChallengesView.");
              challengesSnapshotUnsubscribe?.current();
            }
            navigation.goBack();
          }}>
          <Image style={{ tintColor: 'black' }} source={BackImg} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: 'black', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
          {route.params.event.eventName}
        </Text>
        <TouchableOpacity style={{ width: 40, height: 40 }}
          onPress={() => {
          }}>
        </TouchableOpacity>
      </View>
      {loaded ? 
        (route.params.show === 'all' ?
          <SectionList
            sections={getChallengesData()}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => renderItem(item)}
            extraData={loaded}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({ section: { title } }) => (
              <View style={{flexDirection: 'column'}}>
                <View style={{ height: 30, backgroundColor: "#0B214D", justifyContent: 'center' }}>
                  <Text style={{
                    marginLeft: 15,
                    color: 'white',
                    fontSize: 18
                  }}>
                    {title} Picks
                  </Text>
                </View>
                {((title === "Pending" && pending.length === 0) || (title === "Current" && current.length === 0) || (title === "Completed" && completed.length === 0)) &&
                  <View style={{justifyContent: 'center', height: 60}}>
                    <Text style={{width: '100%', textAlign: 'center'}}>
                      No picks
                    </Text>
                  </View>
                }
              </View>
            )}
          />
          :
          <FlatList 
            data={ route.params.show === 'pending' ?  pending : current }
            renderItem={(item) => renderItem(item.item)}
            keyExtractor={(item) => {
              return item.gameID
            }}/>
        )
      :
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
      }
      
    </SafeAreaView>
  );
};

export default EventChallengesView;