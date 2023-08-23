import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
  SectionList,
} from "react-native";

import BackImg from '@assets/arrow_left.png';

import { firebase } from '../../firebase';
import 'firebase/firestore';
import { FlatList } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
import PointArrowImage from '@assets/challenge_point_arrow.png'
import PointReverseArrowImage from '@assets/challenge_point_arrow_to_left.png'
import CreateChallengeView from '../game/createChallenge';

const GameChallengesListView = ({ navigation, route }) => {

  const [me, setMe] = useState(null);
  const [gameID, setGameID] = useState(route.params.gameID);
  const [gameSchedule, setGameSchedule] = useState(route.params.gameSchedule);
  const [challenges, setChallenges] = useState(route.params.challenges);
  const [challengeUsers, setChallengeUsers] = useState([]);
  const [type, setType] = useState(route.params.type);

  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [currentChallenges, setCurrentChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  const challengesQuerySnapshotUnsubscribe = useRef(null);

  const RBSheetRef = useRef(null);

  const dimensionWindow = Dimensions.get("window");

  const getChallengesData = useCallback(() => {
    return [
      {
        title: "Current",
        data: currentChallenges
      },
      {
        title: "Pending",
        data: pendingChallenges
      },
      {
        title: "Completed",
        data: completedChallenges
      }
    ];
  }, [currentChallenges, pendingChallenges, completedChallenges]);

  const gamePlayerName = (playerId) => {
    if (playerId === gameSchedule.player1ID) {
      return gameSchedule.player1Name;
    } else {
      return gameSchedule.player2Name;
    }
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

  const loadChallengeUsers = async () => {
    let userIds = [];
    for (const challenge of challenges) {
      if (me.uid !== challenge.challengeSenderId) {
        if (!userIds.includes(challenge.challengeSenderId)) {
          userIds = [...userIds, challenge.challengeSenderId];
        }
      }

      if (challenge.opponent !== 'all' && challenge.opponent !== me.uid) {
        if (!userIds.includes(challenge.opponent)) {
          userIds = [...userIds, challenge.opponent];
        }
      }
    }

    console.log("challenge userIds => ", userIds)

    let userSplittedIdsArray = splitIdsArray(userIds);
    let users = [];

    const promises = userSplittedIdsArray.map(async idsArray => {
      const querySnapshot = await firebase.firestore().collection("users")
      .where("uid", "in", idsArray)
      .get();
    
      querySnapshot.forEach(documentSnapshot => {
        let user = documentSnapshot.data();
        users = [...users, user];
      });
    })

    await Promise.all(promises);

    console.log("challenge users => ", users);
    setChallengeUsers([...challengeUsers, ...users]);
  }

  const findChallengeUsername = (userId) => {
    if (userId === 'all') {
      return "All";
    } else if (me !== null && userId === me.uid) {
      return "You";
    } else {
      let challengeUser = challengeUsers.find(user => user.uid === userId);
      if (challengeUser !== undefined) {
        if (challengeUser.userName !== "")  {
          return challengeUser.userName;
        } else if (challengeUser.userNickname !== "") {
          return challengeUser.userNickname;
        } else {
          return challengeUser.email.substring(0, challengeUser.email.indexOf('@'));
        }
        
      } else {
        return "---";
      }
    }
  }

  const cancelChallenge = async (challenge) => {
    firebase.firestore().collection("challenges").doc(challenge.id).delete().then(() => {
      console.log("Successfully cancelled my challenge");
      setChallenges(challenges.filter(item => item.id !== challenge.id));
    }).catch((error) => {
      console.log("Cancel challenge error => ", error);
    });
  }

  const acceptChallenge = (challenge) => {
    let updatingData = {
      acceptedAt: new Date().getTime(),
      status: "accepted",
      opponent: me.uid,
      users: [...challenge.users, me.uid]
    };

    if (challenge.opponent === 'all') {
      updatingData.users.filter(value => value !== 'all');
    }
    
    let ref = firebase.firestore().collection("challenges").doc(challenge.id);
    ref.update(updatingData).then(() => {
      console.log("Successfully accepted challenge");
      setChallenges(challenges.filter(item => item.id !== challenge.id));
    });
  }

  const denyChallenge = (challenge) => {
    
    if (challenge.opponent === "all") {
      if (challenge.declinedUsers === undefined) {
        challenge.declinedUsers = [me.uid];
      } else {
        challenge.declinedUsers = [...challenge.declinedUsers, me.uid];
      }
      let ref = firebase.firestore().collection("challenges").doc(challenge.id)
      ref.update({declinedUsers: challenge.declinedUsers}).then(() => {
        console.log("Successfully accepted challenge");
        setChallenges(challenges.filter(item => item.id !== challenge.id));
      });
    } else {
      let ref = firebase.firestore().collection("challenges").doc(challenge.id)
      ref.update({declinedAt: new Date().getTime(), status:"declined"}).then(() => {
        console.log("Successfully accepted challenge");
        setChallenges(challenges.filter(item => item.id !== challenge.id));
      });
    }
  }

  const loadChallengesOfGame = () => {
    challengesQuerySnapshotUnsubscribe.current = firebase.firestore().collection("challenges")
      .where("users", "array-contains-any", [me.uid, "all"])
      .where("gameID", "==", gameID)
      .onSnapshot(async snapshot => {
          let items = [];
          let userIds = [];
          for (const doc of snapshot.docs) {
              let challenge = doc.data();
              if (challenge.challengeSenderId === me.uid) {
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
              items = [...items, challenge];
          }
          console.log("Loaded challenges of game => ", items.length);

          setChallenges(items);

          setPendingChallenges(items.filter(challenge => challenge.status === "pending"));
          setCurrentChallenges(items.filter(challenge => challenge.status === "accepted"));
          setCompletedChallenges(items.filter(challenge => challenge.status === "completed"));
      });
  }

  const renderTopHeader = () => (
    <View style={{height: 24, backgroundColor: 'rgba(0, 0, 0, 0.2)', alignItems: 'center', flexDirection: 'row'}}>
      <Text style={{flex: 1, textAlign: 'left', fontWeight: 'bold', marginLeft: 20, marginRight: 20}}>
        {challenges.length} {type} picks
      </Text>
    </View>
  )

  const renderGameSection = () => (
    <View style={{flexDirection: 'column', marginLeft: 20, marginRight: 20, alignItems: 'center'}}>
      <View style={{
        height: 40, 
        flexDirection: 'row', 
        backgroundColor:"#DCE4F9", 
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
        }}>
        <Text style={{flex: 1, textAlign: 'center', fontWeight: 'bold'}}>
          {gameSchedule.player1Name}
        </Text>
        <Text style={{flex: 1, textAlign: 'center', fontWeight: 'bold'}}>
          {gameSchedule.player2Name}
        </Text>
      </View>

      <Text style={{marginTop: 10, fontWeight: 'bold', fontStyle:'italic', textAlign: 'center', marginBottom: 10}}>
        {gameSchedule.gameDescription}
      </Text>

      <TouchableOpacity
        style={{ width: 180, height: 36, backgroundColor: '#0B214D', justifyContent: 'center', borderRadius: 18, alignItems: 'center', marginBottom: 15}}
        onPress={() => {
          RBSheetRef.current.open();
        }}>
        <Text style={{ color: 'white' }}>Create a New Pick</Text>
      </TouchableOpacity>
    </View>
  )

  const userNameUnderPlayerForChallenge = (challenge, playerId) => {
    if (challenge.challengeGameWinnerId === playerId) {
      return findChallengeUsername(challenge.challengeSenderId);
    } else {
      return findChallengeUsername(challenge.opponent);
    }
  }

  const challengeSendDirection = (challenge) => {
    if (challenge.challengeGameWinnerId === gameSchedule.player1ID) {
      return 1;
    } else {
      return -1;
    }
  }

  const userWonUnderPlayerForChallenge = (challenge, playerId) => {
    if (challenge.challengeGameWinnerId === playerId) {
      if (challenge.challengeGameWinnerId === challenge.gameRealWinnerId) {
        return 1
      } else {
        return -1
      }
    } else {
      if (challenge.challengeGameWinnerId === challenge.gameRealWinnerId) {
        return -1
      } else {
        return 1
      }
    }
  }

  const renderChallenge = (challenge) => {
    
    return (
      <View style={{flexDirection: 'column'}}>

        <View style={{height: 1, backgroundColor: 'rgba(0,0,0,0.1)'}} />

        {(challenge.status === 'pending' || challenge.status === 'accepted') &&
        <Text style={{textAlign: 'center', width: '100%', marginTop: 10, marginBottom: 10}}>
          <Text style={{fontWeight: 'bold', fontSize: 14}}>{ findChallengeUsername(challenge.challengeSenderId) }</Text>
          &nbsp;bet {challenge.points} points to&nbsp;
          <Text style={{fontWeight: 'bold', fontSize: 14}}>{ gamePlayerName(challenge.challengeGameWinnerId) }</Text>
          &nbsp;win.
        </Text>
        }

        <View style={{flexDirection: 'row', marginLeft: 20, marginRight: 20, height: 70, justifyContent: 'center', alignItems: 'center'}}>

          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{
              width: 120, 
              height: 60, 
              justifyContent: 'center', 
              alignItems: 'center', 
              borderRadius: 10, 
              borderColor: 'rgba(0,0,0,0.1)', 
              backgroundColor: (challenge.status === 'completed' && userWonUnderPlayerForChallenge(challenge, gameSchedule.player1ID)) ? '#0FDF56' : 'transparent',
              borderWidth:1}}>

              <Text style={{ fontSize: 14 }}>
              { userNameUnderPlayerForChallenge(challenge, gameSchedule.player1ID) }
              </Text>
              {challenge.status === 'completed' && (
                <Text style={{fontWeight: 'bold', fontSize: 14}}>
                  {userWonUnderPlayerForChallenge(challenge, gameSchedule.player1ID) ? "+" : "-"}
                  {challenge.points} Points
                </Text>
              )}
            </View>
          </View>
          <View style={{flexDirection:'column', alignItems: 'center'}}>
            {(challenge.status === 'pending' || challenge.status === 'accepted') &&
              <Text style={{fontWeight: 'bold', fontSize: 14}}>{challenge.points} Points</Text>
            }
            <Image source={challengeSendDirection(challenge) === 1 ? PointArrowImage : PointReverseArrowImage} 
              style={{ width: 26, height: 30, tintColor: 'black', resizeMode: 'contain' }}/>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

            <View style={{
              width: 120, 
              height: 60, 
              justifyContent: 'center', 
              alignItems: 'center', 
              borderRadius: 10, 
              borderColor: 'rgba(0,0,0,0.1)', 
              backgroundColor: (challenge.status === 'completed' && userWonUnderPlayerForChallenge(challenge, gameSchedule.player2ID)) ? '#0FDF56' : 'transparent',
              borderWidth:1}}>
              <Text style={{ fontSize: 14 }}>
              { userNameUnderPlayerForChallenge(challenge, gameSchedule.player2ID) }
              </Text>
              {challenge.status === 'completed' && (
                <Text style={{fontWeight: 'bold', fontSize: 14}}>
                  {userWonUnderPlayerForChallenge(challenge, gameSchedule.player2ID) ? "-" : "+"}
                  {challenge.points} Points
                </Text>
              )}
            </View>

          </View>
        </View>

        {challenge.status === 'pending' &&
          <View style={{flexDirection: 'row', marginLeft: 20, marginRight: 20, marginTop: 10, alignItems: 'center', marginBottom: 10}}>
            <Text style={{fontSize: 14, flex: 1}}>
              {(me !== null && me.uid === challenge.challengeSenderId) ? 
                `Waiting for ${challenge.opponent === 'all' ? 'someone' : findChallengeUsername(challenge.opponent)} to accept.` 
                : "Accept to start pick."
              }
            </Text>
            {(me !== null && me.uid === challenge.challengeSenderId) ?
              <TouchableOpacity 
                style={{ backgroundColor: 'red', borderRadius: 5, width: 60, height: 24, justifyContent: 'center'}}
                onPress={() => {
                  cancelChallenge(challenge);
                }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12, textAlign: 'center'}}>
                    Cancel
                  </Text>
              </TouchableOpacity>
              :
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity 
                  style={{ backgroundColor: '#5CDA68', borderRadius: 5, width: 60, height: 24, justifyContent: 'center'}}
                  onPress={() => {
                    acceptChallenge(challenge);
                  }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12, textAlign: 'center'}}>
                      Accept
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ backgroundColor: 'red', borderRadius: 5, width: 60, height: 24, justifyContent: 'center', marginLeft: 10}}
                  onPress={() => {
                    denyChallenge(challenge);
                  }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12, textAlign: 'center'}}>
                      Decline
                    </Text>
                </TouchableOpacity>
              </View>
            }
          </View>
        }
      </View>
    );
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User ME => ", user.uid);
        setMe(user);
      } else {
        console.log("auth current user is Invalid");
      }
    });
    return () => {
      if (challengesQuerySnapshotUnsubscribe?.current) {
        challengesQuerySnapshotUnsubscribe?.current();
      }
      unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (me) {
      loadChallengeUsers();
    }
    
  }, [challenges, me]);

  useEffect(() => {
    console.log("challenges => ", route.params.challenges);
    setGameID(route.params.gameID);
    setGameSchedule(route.params.gameSchedule);
    setChallenges(route.params.challenges);
    setType(route.params.type);
  }, [route.params]);

  useEffect(() => {
    if (type === 'All' && me !== null) {
      loadChallengesOfGame();
    }
  }, [type, gameID, me]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ height: 60, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => {
            if (challengesQuerySnapshotUnsubscribe?.current) {
              challengesQuerySnapshotUnsubscribe?.current();
            }
            navigation.goBack();
          }}>
          <Image style={{ tintColor: 'black' }} source={BackImg} />
        </TouchableOpacity>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>
            Game #{gameID}
          </Text>
          <Text style={{ color: 'black', fontSize: 16}}>
            { type } Picks
          </Text>
        </View>
        {gameSchedule.gameStatus !== 'Final' ?
          <TouchableOpacity style={{ width: 40, height: 40 }}
            onPress={() => {
              RBSheetRef.current.open();
            }}>
              <Text style={{fontWeight: 'bold', fontSize: 30, color: 'black'}}>+</Text>
          </TouchableOpacity>
        :
          <View style={{ width: 40, height: 40 }} />
        }
      </View>

      {renderGameSection()}

      {type === "All"?
      <SectionList
        sections={getChallengesData()}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => renderChallenge(item)}
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
            {((title === "Pending" && pendingChallenges.length === 0) 
            || (title === "Current" && currentChallenges.length === 0) 
            || (title === "Completed" && completedChallenges.length === 0)) &&
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
        data={ challenges }
        ListHeaderComponent={ renderTopHeader() }
        renderItem={(item) => renderChallenge(item.item)}
        extraData={ challengeUsers }
        keyExtractor={(item) => item.id} />
      }
      
      <RBSheet
        ref={ref => {
          RBSheetRef.current = ref;
        }}
        height={dimensionWindow.height - 80}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
            wrapper: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            raggableIcon: { backgroundColor: "#000" },
            container: { borderTopLeftRadius: 15, borderTopRightRadius: 15 }
        }}>
        <CreateChallengeView
            game={gameSchedule}
            gameScheduleId={gameSchedule.gameScheduleId}
            eventID={gameSchedule.eventID}
            gameID={gameSchedule.gameID}
            player1Id={gameSchedule.player1ID}
            player2Id={gameSchedule.player2ID}
            player1Name={gameSchedule.player1Name}
            player2Name={gameSchedule.player2Name}
            onDismiss={() => { RBSheetRef.current.close() }} />
    </RBSheet>
      
    </SafeAreaView>
  );
};

export default GameChallengesListView;