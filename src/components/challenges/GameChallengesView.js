import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from "react-native";

import CreateChallengeView from '../game/createChallenge';
import BackImg from '@assets/arrow_left.png';
import RBSheet from "react-native-raw-bottom-sheet";
import { firebase } from '../../firebase';
import 'firebase/firestore';

const dimensionWindow = Dimensions.get("window");

const GameChallengesListView = ({ navigation, route }) => {

    const [challenges, setChallenges] = useState([]);
    const [challengeUsers, setChallengeUsers] = useState([]);
    const [incomingChallenges, setIncomingChallenges] = useState([]);

    const [refreshIncomingChallenges, setRefreshIncomingChallenges] = useState(false);
    const [refreshChallenges, setRefreshChallenges] = useState(false);

    const renderChallengeItem = (challenge) => {
        return (
            <View style={{ paddingLeft:10, paddingRight:10, height: 40, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 5, borderWidth: 1, marginTop: 5, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', flex: 1, color: 'white' }}>
                    {challenge.challengeGameWinnerId === route.params.game.player1ID ? route.params.game.player1Name : route.params.game.player2Name} Win
                </Text>
                <Text style={{ flex: 1, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                    {challenge.points}pt
                </Text>
                <Text style={{ flex: 2, textAlign: 'center', fontSize: 12, color: 'white' }}>
                    {challenge.opponent === 'all' ? 'Open to All' : findChallengeUserName(challenge.opponent)}
                </Text>
                {challenge.status == "pending" &&
                    <View style={{ height: 20, width: 60, backgroundColor: 'red', borderRadius: 10, overflow: 'hidden', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                            Pending
                        </Text>
                    </View>
                }
            </View>
        );
    }

    const renderIncomingChallengeItem = (challenge) => {
        return (
          <View style={{
            height: 100,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 15,
            borderWidth: 1,
            marginTop: 5,
            flexDirection: 'column',
            padding: 10
          }}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
              {findChallengeUserName(challenge.challengeSenderId)} 
              &nbsp;bets&nbsp;
              {challenge.points}pts&nbsp;on&nbsp;{challenge.challengeGameWinnerId === route.params.game.player1ID ? route.params.game.player1Name : route.params.game.player2Name} 
              &nbsp;to win&nbsp;
              {challenge.opponent === 'all' ? "" : " (sent you directly)"}
            </Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity style={{ backgroundColor: 'red', width: 120, height: 40, borderRadius: 20, justifyContent: 'center' }}
                onPress={() => { 
                    acceptChallenge(challenge); 
                }}>
                <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                  Accept Bet
                </Text>
              </TouchableOpacity>
              <View style={{ width: 20 }} />
              <TouchableOpacity style={{ backgroundColor: 'transparent', width: 120, height: 40, borderRadius: 20, borderColor: 'red', borderWidth: 1, justifyContent: 'center' }}
                onPress={() => {
                  denyChallenge(challenge);
                }}>
                <Text style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
                  Deny Bet
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }

    const acceptChallenge = (challenge) => {
        let updatingData = {
          acceptedAt: new Date().getTime(),
          status: "accepted",
          opponent: firebase.auth().currentUser.uid,
          users: [...challenge.users, firebase.auth().currentUser.uid]
        };
        let ref = firebase.firestore().collection("challenges").doc(challenge.id);
        ref.update(updatingData);
      }
    
      const denyChallenge = (challenge) => {
        if (challenge.opponent === "all") {
          if (challenge.declinedUsers === undefined) {
            challenge.declinedUsers = [firebase.auth().currentUser.uid];
          } else {
            challenge.declinedUsers = [...challenge.declinedUsers, firebase.auth().currentUser.uid];
          }
          let ref = firebase.firestore().collection("challenges").doc(challenge.id)
          ref.update({declinedUsers: challenge.declinedUsers});
        } else {
          let ref = firebase.firestore().collection("challenges").doc(challenge.id)
          ref.update({declinedAt: new Date().getTime(), status:"declined"});
        }
      }

    const loadIncomingChallenges = () => {
        firebase.firestore().collection("challenges")
            .where("status", "==", "pending")
            .where("gameScheduleId", "==", route.params.gameScheduleId)
            .where("opponent", "in", [firebase.auth().currentUser.uid, "all"])
            .onSnapshot(async snapshot => {
                let challenges = [];
                let userIds = [];
                for (const doc of snapshot.docs) {
                    let challenge = doc.data();
                    if (challenge.opponent !== 'all' || !(challenge.declinedUsers !== undefined && challenge.declinedUsers.includes(firebase.auth().currentUser.uid))) {
                        if (challenge.challengeSenderId !== firebase.auth().currentUser.uid) {
                            if (!userIds.includes(userId => userId == challenge.challengeSenderId) && !challengeUsers.includes(user => user.uid == challenge.challengeSenderId)) {
                                userIds = [...userIds, challenge.challengeSenderId];
                            }
                            challenges = [...challenges, challenge];
                        }
                    }
                }
                await loadChallengeUsers(userIds);
                setIncomingChallenges(challenges);
            });
    }

    const loadGameChallenges = async () => {

        console.log("Game Challenges View - ", route.params.gameScheduleId);

        firebase.firestore().collection("challenges")
            .where("users", "array-contains", firebase.auth().currentUser.uid)
            .where("gameScheduleId", "==", route.params.gameScheduleId)
            .onSnapshot(async snapshot => {
                let challenges = [];
                let userIds = [];
                for (const doc of snapshot.docs) {
                    let challenge = doc.data();
                    if (challenge.challengeSenderId === firebase.auth().currentUser.uid) {
                        if (challenge.opponent !== "all") {
                            if (!userIds.includes(userId => userId == challenge.opponent) && !challengeUsers.includes(user => user.uid == challenge.opponent)) {
                                userIds = [...userIds, challenge.opponent];
                            }
                        }
                    } else {
                        if (!userIds.includes(userId => userId == challenge.opponent) && !challengeUsers.includes(user => user.uid == challenge.opponent)) {
                            userIds = [...userIds, challenge.opponent];
                        }
                    }
                    challenges = [...challenges, challenge];
                }
                await loadChallengeUsers(userIds);
                setChallenges(challenges);
            });
    }

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
        setChallengeUsers([...challengeUsers, ...users]);
      };

    const findChallengeUserName = (userId) => {
        let user = challengeUsers.find(user => user.uid == userId);
        if (user !== undefined) {
            return user.userName;
        } else {
            console.log("unknown user id - ", userId);
            return "???";
        }
    }

    useEffect(() => {
        loadGameChallenges();
        loadIncomingChallenges();
    }, []);

    useEffect(() => {
        console.log("challenge users - ", challengeUsers);
        setRefreshChallenges(!refreshChallenges);
        setRefreshIncomingChallenges(!refreshIncomingChallenges);
    }, [challengeUsers]);

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#0B214D' }}>
                <View style={{ height: 40, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Image style={{ tintColor: 'white' }} source={BackImg} />
                    </TouchableOpacity>
                    <Text style={{ flex: 1, color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
                        My Picks
                    </Text>
                    <TouchableOpacity style={{ width: 40, height: 40 }}
                        onPress={() => {
                            this.RBSheet.open();
                        }}>
                        <Text style={{ color: 'white', fontSize: 30 }}>+</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                {incomingChallenges.length > 0 &&
                    <View style={{padding: 10}}>
                        <View style={{ width: '100%', height: 30, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', paddingLeft: 10}}>
                            <Text style={{color: 'white'}}>
                                Incoming Picks
                            </Text>
                        </View>
                        <FlatList
                            data={incomingChallenges}
                            extraData={refreshIncomingChallenges}
                            renderItem={(item) => renderIncomingChallengeItem(item.item)}
                            keyExtractor={(item) => item.id} />
                    </View>}
                {challenges.length > 0 &&
                    <View style={{padding: 10}}>
                        <View style={{ width: '100%', height: 30, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', paddingLeft: 10}}>
                            <Text style={{color: 'white'}}>
                                My Picks
                            </Text>
                        </View>
                        <FlatList
                            data={challenges}
                            extraData={refreshChallenges}
                            renderItem={(item) => renderChallengeItem(item.item)}
                            keyExtractor={(item) => item.id} />
                    </View>}
                {(challenges.length === 0 && incomingChallenges.length === 0) &&
                    <View style={{padding: 10, flex: 1, height: '100%', textAlign: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'white', paddingTop: 30}}>
                            You have do not have any picks yet.  They can be entered for Upcoming games
                        </Text>
                    </View>
                }
                </ScrollView>
            </SafeAreaView>
            <RBSheet
                ref={ref => {
                    this.RBSheet = ref;
                }}
                height={dimensionWindow.height - 160}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                    raggableIcon: { backgroundColor: "#000" },
                    container: { borderTopLeftRadius: 15, borderTopRightRadius: 15 }
                }}>
                <CreateChallengeView
                    game={route.params.game}
                    gameScheduleId={route.params.gameScheduleId}
                    gameID={route.params.game.gameID}
                    eventID={route.params.game.eventID}
                    player1Id={route.params.game.player1ID}
                    player2Id={route.params.game.player2ID}
                    player1Name={route.params.game.player1Name}
                    player2Name={route.params.game.player2Name}
                    onDismiss={() => { this.RBSheet.close() }} />
            </RBSheet>
        </>
    );
};

export default GameChallengesListView;