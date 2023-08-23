import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList
} from "react-native";

import { firebase } from '../../firebase';
import 'firebase/firestore';

import Feather from "react-native-vector-icons/Feather";
import FilterImg from '@assets/FilterIcon.png';
import BetImage from '@assets/Bet.png';

Feather.loadFont();

const ChallengeHistoryView = (props) => {

  const { navigation } = props;

  const [games, setGames] = useState({});
  const [challengeUsers, setChallengeUsers] = useState([]);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [openedChallenges, setOpenedChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  const loadMyChallenges = () => {
    firebase.firestore().collection("challenges")
      .where("users", "array-contains", firebase.auth().currentUser.uid)
      .onSnapshot(async snapshot => {
        let challenges = [];
        let pChallenges = [];
        let oChallenges = [];
        let cChallenges = [];
        let gameIds = [];
        let challegneUserIds = [];
        for (const doc of snapshot.docs) {
          let challenge = doc.data();
          if (challenge.status !== 'expired') {
            if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
              if (challenge.opponent !== "all") {
                if (!challegneUserIds.includes(challenge.opponent)) {
                  challegneUserIds = [...challegneUserIds, challenge.opponent];
                }
              }
            } else {
              if (!challegneUserIds.includes(challenge.challengeSenderId)) {
                challegneUserIds = [...challegneUserIds, challenge.challengeSenderId];
              }
            }
          }
          
          console.log("challenge status - ", challenge.status);
          if (challenge.status === 'pending') {
            pChallenges = [...pChallenges, challenge];
          } else if (challenge.status === 'accepted') {
            oChallenges = [...oChallenges, challenge];
          } else {
            cChallenges = [...cChallenges, challenge];
          }

          if (!gameIds.includes(challenge.gameID)) {
            gameIds = [...gameIds, challenge.gameID];
          }

          challenges = [...challenges, challenge];
        }
        console.log("game IDs list", gameIds);
        console.log("challenge User IDs list", challegneUserIds);
        await loadGamesList(gameIds);
        await loadChallengeUsers(challegneUserIds);
        setPendingChallenges(pChallenges);
        setOpenedChallenges(oChallenges);
        setCompletedChallenges(cChallenges);
      });
  };

  const splitIdsArray = (ids) => {
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

  const loadChallengeUsers = async (userIds) => {
    let userSplittedIdsArray = splitIdsArray(userIds);
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
    console.log("Loaded challenge users - ", users.length);
    setChallengeUsers(users);
  };

  const loadGamesList = async (gameIds) => {

    let gameSplittedIdsArray = splitIdsArray(gameIds);
    let games = [];
    for (let idx = 0; idx < gameSplittedIdsArray.length; idx++) {
      const querySnapshot = await firebase.firestore().collection("gameSchedule")
        .where("gameID", "in", gameSplittedIdsArray[idx])
        .get();
      
      querySnapshot.forEach(documentSnapshot => {
        let game = documentSnapshot.data();
        games = [...games, game];
      });
    }
    console.log("Loaded challenge games - ", games.length);
    setGames(games);

    // firebase.firestore().collection("gameSchedule").where("gameID", "in", gameIds)
    //   .get()
    //   .then(querySnapshot => {
    //     let gamesArray = {};
    //     querySnapshot.forEach(documentSnapshot => {
    //       let game = documentSnapshot.data();
    //       gamesArray[game.gameID] = game;
    //     });
    //     setGames(gamesArray);
    //   })
  }


  const challengeWinnerIsMe = (challenge) => {
    if (challenge.gameRealWinnerId === challenge.challengeGameWinnerId) {
      if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
        return true;
      } else {
        return false;
      }
    } else {
      if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
        return false;
      } else {
        return true;
      }
    }
  }

  const challengeSenderPointText = (challenge) => {
    if (challenge.gameRealWinnerId === challenge.challengeGameWinnerId) {
      return "+" + challenge.points;
    } else {
      return "-" + challenge.points;
    }
  }

  const challengeReceiverPointText = (challenge) => {
    if (challenge.gameRealWinnerId === challenge.challengeGameWinnerId) {
      return "-" + challenge.points;
    } else {
      return "+" + challenge.points;
    }
  }

  const challengeSenderName = (challenge) => {
    if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
      return firebase.auth().currentUser.email.substring(0, firebase.auth().currentUser.email.lastIndexOf("@"));
    } else {
      let user = challengeUsers.find(user => user.uid == challenge.challengeSenderId);
      if (user !== undefined) {
        return user.userName;
      } else {
        console.log("Found non-exisiting user id ", challenge.challengeSenderId);
        return "???";
      }
    }
  };

  const findChallengeOpponentName = (challenge) => {
    let userId = "";
    if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
      if (challenge.opponent === "all") {
        return "---";
      } else {
        userId = challenge.opponent;
      }
    } else {
      userId = challenge.challengeSenderId;
    }

    let user = challengeUsers.find(user => user.uid == userId);
    if (user !== undefined) {
      return user.userName;
    } else {
      console.log("Found non-exisiting user id ", userId);

      return "???";
    }
  }

  const findGameForGameID = (gameID) => {
    let game = games.find(game => game.gameID == gameID)
    return game;
  }

  const challengeReceiverName = (challenge) => {
    if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
      let user = challengeUsers.find(user => user.uid == challenge.opponent);
      if (user !== undefined) {
        return user.userName;
      } else {
        console.log("Found non-exisiting user id ", challenge.opponent);
        return "???";
      }
    } else {
      return firebase.auth().currentUser.email.substring(0, firebase.auth().currentUser.email.lastIndexOf("@"));
    }
  };

  const renderCompletedChallenge = (challenge) => {
    return (
      <View style={{
        flexDirection: 'column',
        borderColor: challengeWinnerIsMe(challenge) ? 'green' : 'red',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 1
      }}>
        {(findGameForGameID(challenge.gameID) !== undefined) && (
          <View>
            <Text style={{fontWeight: 'bold'}}>
              Game #{challenge.gameID}
            </Text>
            <Text style={{fontSize: 12}}>
              {findGameForGameID(challenge.gameID).gameDescription}
            </Text>
          </View>
        )}
          < View style={{
            height: 44,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10
          }}>
            {(findGameForGameID(challenge.gameID) !== undefined) && (
              <View style={{flexDirection: 'column', alignItems:'center', justifyContent: 'center', flex: 1}}>
                <Text style={{fontStyle:'italic'}}>Bet to</Text>
                <Text style={{ textAlign: 'center', color: 'black' }}>
                  {challenge.challengeGameWinnerId === findGameForGameID(challenge.gameID).player1ID ? findGameForGameID(challenge.gameID).player1Name : findGameForGameID(challenge.gameID).player2Name} to Win
                </Text>
              </View>
            )}
            <View style={{flexDirection: 'column', flex:2, marginLeft: 20}}>
              <View style={{flexDirection: 'row', height: 30, alignItems: 'center'}}>
                <Image source={BetImage} tintColor={'#000'} style={{tintColor: '#000'}}/>
                <Text style={{marginLeft: 10}}>{challengeSenderPointText(challenge)}</Text>
                <Text style={{marginLeft: 10, flex:1}}>{ challengeSenderName(challenge) }</Text>
              </View>
              <View style={{flexDirection: 'row', height: 30, alignItems: 'center'}}>
                <Image source={BetImage} tintColor={'#000'} style={{tintColor: '#000'}}/>
                <Text style={{marginLeft: 10}}>{challengeReceiverPointText(challenge)}</Text>
                <Text style={{marginLeft: 10, flex:1}}>{challengeReceiverName(challenge)}</Text>
              </View>
            </View>
          </View>
      </View >

    );
  }

  const renderChallengeItem = (challenge) => {
    return (
      <View style={{
        flexDirection: 'column',
        borderColor: 'rgba(0,0,0,0.2)',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        borderWidth: 1
      }}>
        {(findGameForGameID(challenge.gameID) !== undefined) && (
          <View>
            <Text style={{fontWeight: '300'}}>
              Game #{challenge.gameID}
            </Text>
            <Text>
              {findGameForGameID(challenge.gameID).gameDescription}
            </Text>
          </View>
        )}
          < View style={{
            height: 44,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10
          }}>
            {(findGameForGameID(challenge.gameID) !== undefined) && (
              <View style={{flexDirection: 'column', alignItems:'center', justifyContent: 'center', flex: 2}}>
                <Text style={{fontStyle:'italic'}}>Bet to</Text>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}>
                  {challenge.challengeGameWinnerId === findGameForGameID(challenge.gameID).player1ID ? findGameForGameID(challenge.gameID).player1Name : findGameForGameID(challenge.gameID).player2Name} to Win
                </Text>
              </View>
            )}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Image source={BetImage} tintColor={'#000'} style={{ tintColor: '#000' }}/>
            <Text style={{ fontWeight: 'bold', color: 'black', marginLeft: 5 }}>
              {challenge.points}pt
            </Text>
          </View>
          <Text style={{ flex: 2, textAlign: 'center', color: 'black' }}>
            {challenge.opponent === 'all' ? 'Open to All' : " vs " + findChallengeOpponentName(challenge) }
          </Text>
          {challenge.status == "pending" &&
            <View style={{ height: 20, width: 60, backgroundColor: 'red', borderRadius: 10, overflow: 'hidden', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                Pending
              </Text>
            </View>
          }
        </View>
      </View >

    );
  }

useEffect(() => {
  loadMyChallenges();
}, []);

return (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={{ width: "85%", alignSelf: "center", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Feather name="menu" size={25} color={'#000'} />
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Challenge History</Text>
      <TouchableOpacity onPress={() => {
      }}>
        <Image source={FilterImg} />
      </TouchableOpacity>
    </View>
    <ScrollView>
      {openedChallenges.length > 0 &&
        <View>
          <View style={{ width: '100%', height: 30, backgroundColor: '#0B214D', justifyContent: 'center', paddingLeft: 10 }}>
            <Text style={{ color: 'white' }}>
              Current Challenges
              </Text>
          </View>
          <FlatList
            style={{ marginLeft: 10, marginRight: 10, marginBottom: 10}}
            data={openedChallenges}
            renderItem={(item) => renderChallengeItem(item.item)}
            keyExtractor={(item) => item.id} />
        </View>}
      {pendingChallenges.length > 0 &&
        <View>
          <View style={{ width: '100%', height: 30, backgroundColor: '#0B214D', justifyContent: 'center', paddingLeft: 10 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Pending Challenges
              </Text>
          </View>
          <FlatList
            style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}
            data={pendingChallenges}
            renderItem={(item) => renderChallengeItem(item.item)}
            keyExtractor={(item) => item.id} />
        </View>}
      {completedChallenges.length > 0 &&
        <View>
          <View style={{ width: '100%', height: 30, backgroundColor: '#0B214D', justifyContent: 'center', paddingLeft: 10 }}>
            <Text style={{ color: 'white' }}>
              Completed Challenges
              </Text>
          </View>
          <FlatList
            style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}
            data={completedChallenges}
            renderItem={(item) => renderCompletedChallenge(item.item)}
            keyExtractor={(item) => item.id} />
        </View>}
    </ScrollView>
  </SafeAreaView>
);
};

export default ChallengeHistoryView;