import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { firebase } from "../../firebase";
import "firebase/firestore";

import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { parse } from "date-fns";

Feather.loadFont();

const JudgeScoreGame = ({ navigation, route }) => {
  const [contestUsers, setContestUsers] = useState([]);
  const [gameScores, setGameScores] = useState({});
  const [userProfiles, setUserProfiles] = useState({});
  const [userEventProfiles, setUserEventProfiles] = useState({});
  const gameScoresRef = useRef();
  const [me, setMe] = useState(null);
  const [gameScheduleId, setGameScheduleId] = useState(
    route.params?.gameScheduleId
  );
  const [gameSchedule, setGameSchedule] = useState();
  const gameScheduleRef = useRef();

  const [gameScoreId, setGameScoreId] = useState();

  const userAveragesScore = useCallback(
    (userId) => {
      if (gameScores && gameScores[userId]) {
        const scoresArray = Object.values(gameScores[userId]);
        const sum = scoresArray.reduce((acc, cur) => acc + cur);
        return scoresArray.length > 0 ? sum / scoresArray.length : 0;
      } else {
        return 0;
      }
    },
    [gameScores]
  );

  const gameScoreBoard = useMemo(() => {
    const list = contestUsers.map((contestUser) => {
      if (userProfiles[contestUser.userID]) {
        return {
          ...contestUser,
          score: gameScores,
          profile: userProfiles[contestUser.userID],
        };
      }
      return {
        ...contestUser,
        score: gameScores,
      };
    });
    if (gameSchedule?.gameStatus === "Final") {
      return list.sort((item1, item2) => {
        return userAveragesScore(item1.userID) > userAveragesScore(item2.userID)
          ? -1
          : 1;
      });
    } else {
      return list;
    }
  }, [contestUsers, gameScores, userProfiles, gameSchedule]);

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
  };

  useEffect(() => {
    if (contestUsers) {
      let contestUserIDs = contestUsers.map(
        (contestUser) => contestUser.userID
      );
      if (userProfiles) {
        contestUserIDs = contestUserIDs.filter(
          (contestUserId) => userProfiles[contestUserId] === undefined
        );
      }

      if (contestUserIDs.length > 0) {
        const idsArray = splitIdsArray(contestUserIDs);
        Promise.all(
          idsArray.map((ids) =>
            firebase
              .firestore()
              .collection("users")
              .where("uid", "in", ids)
              .get()
          )
        ).then((profileQueryResultsArray) => {
          let userProfilesArray = [];
          profileQueryResultsArray.forEach((profileQueryResults) => {
            userProfilesArray = [
              ...userProfilesArray,
              ...profileQueryResults.docs.map((doc) => doc.data()),
            ];
          });

          let profileDictionary = {};
          userProfilesArray.forEach((userProfile) => {
            profileDictionary[userProfile.uid] = userProfile;
          });
          console.log(profileDictionary);
          setUserProfiles({ ...userProfiles, ...profileDictionary });
        });

        Promise.all(
          idsArray.map((ids) =>
            firebase
              .firestore()
              .collection("playerEventProfile")
              .where("userID", "in", ids)
              .where("eventID", "==", route.params.contestID)
              .get()
          )
        ).then((profileQueryResultsArray) => {
          let userProfilesArray = [];
          profileQueryResultsArray.forEach((profileQueryResults) => {
            userProfilesArray = [
              ...userProfilesArray,
              ...profileQueryResults.docs.map((doc) => doc.data()),
            ];
          });

          let profileDictionary = {};
          userProfilesArray.forEach((userProfile) => {
            profileDictionary[userProfile.userID] = userProfile;
          });
          console.log("Event User Profiles => ", profileDictionary);
          setUserEventProfiles({ ...userEventProfiles, ...profileDictionary });
        });
      }
    }
  }, [contestUsers, userProfiles, userEventProfiles]);

  const snapshotGameScores = async () => {
    const gameID = route.params.gameID;

    let gameScoreDocId;
    let shouldCreateGameScoreDocument = false;
    try {
      const gameScoresQuerySnapshot = await firebase
        .firestore()
        .collection("gameScores")
        .where("gameID", "==", gameID)
        .get();
      if (gameScoresQuerySnapshot.docs.length === 0) {
        shouldCreateGameScoreDocument = true;
      } else {
        gameScoreDocId = gameScoresQuerySnapshot.docs[0].id;
        setGameScoreId(gameScoreDocId);
      }
    } catch (err) {
      shouldCreateGameScoreDocument = true;
    }

    if (shouldCreateGameScoreDocument) {
      const doc = firebase.firestore().collection("gameScores").doc();
      gameScoreDocId = doc.id;
      setGameScoreId(gameScoreDocId);
      await doc.set({
        gameID,
        scores: {},
      });
    }

    gameScoresRef.current = firebase
      .firestore()
      .collection("gameScores")
      .doc(gameScoreDocId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          console.log(doc.data().scores);
          setGameScores(doc.data().scores);
        } else {
          console.log("DOC NO EXISTS");
        }
      });
  };

  const getMyScore = useCallback(
    (userId) => {
      if (me) {
        if (gameScores && gameScores[userId]) {
          return gameScores[userId][me.uid];
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    },
    [me, gameScores]
  );

  const userScoresCount = useCallback(
    (userId) => {
      if (gameScores && gameScores[userId]) {
        const scoresArray = Object.values(gameScores[userId]);
        return scoresArray.length;
      } else {
        return 0;
      }
    },
    [gameScores]
  );

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.profile) {
            navigation.navigate("UserScoringView", {
              eventID: route.params.contestID,
              gameScoreId,
              contestID: route.params.contestID,
              gameID: route.params.gameID,
              userProfile: item.profile,
              userID: item.userID,
              eventName: route.params.eventName,
              myScore: getMyScore(item.userID),
              gameStatus: gameSchedule?.gameStatus,
            });
          }
        }}
        style={[
          styles.itemViewContainer,
          { backgroundColor: index % 2 === 0 ? "#F4DAA2" : "white" },
        ]}
      >
        {"Final" == gameSchedule?.gameStatus && (
          <Text style={styles.itemViewIndexing}>#{index + 1}</Text>
        )}

        <Image
          source={{ uri: item.profile?.userAvatar }}
          style={styles.itemViewUserAvatar}
        />

        {/* {(userEventProfiles[item.userID] && userEventProfiles[item.userID].profilePlayerPicture !== undefined && userEventProfiles[item.userID].profilePlayerPicture !== '') &&
          <Image 
            source={{ uri: userEventProfiles[item.userID].profilePlayerPicture }}
            style={styles.itemViewUserEventProfilePicture}/>
        } */}

        <View style={styles.itemViewMiddleContent}>
          <Text style={styles.userNameText}>
            {item.profile ? item.profile.userName : item.userID}
          </Text>
          {gameSchedule &&
          (gameSchedule.gameStatus.includes("Judg") ||
            gameSchedule.gameStatus === "Final") ? (
            <>
              {item.userID !== me.uid && (
                <>
                  {getMyScore(item.userID) ? (
                    <View
                      style={{
                        marginTop: 5,
                        flexDirection: "column",
                      }}
                    >
                      <Text style={{ fontSize: 12, color: "black" }}>
                        You submitted score: {getMyScore(item.userID)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          if (item.profile) {
                            navigation.navigate("UserScoringView", {
                              eventID: route.params.contestID,
                              gameScoreId,
                              contestID: route.params.contestID,
                              gameID: route.params.gameID,
                              userProfile: item.profile,
                              userID: item.userID,
                              myScore: getMyScore(item.userID),
                              eventName: route.params.eventName,
                              gameStatus: gameSchedule?.gameStatus,
                            });
                          }
                        }}
                        style={styles.viewScoreButton}
                      >
                        <Text style={styles.viewScoreText}>View</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      {gameSchedule?.gameStatus !== "Final" && (
                        <TouchableOpacity
                          onPress={() => {
                            if (item.profile) {
                              navigation.navigate("UserScoringView", {
                                eventID: route.params.contestID,
                                gameScoreId,
                                contestID: route.params.contestID,
                                gameID: route.params.gameID,
                                userProfile: item.profile,
                                userID: item.userID,
                                eventName: route.params.eventName,
                                gameStatus: gameSchedule?.gameStatus,
                              });
                            }
                          }}
                          style={styles.submitScoreButton}
                        >
                          <Text style={styles.enterScoreText}>Enter Score</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {item.userID === me?.uid &&
                gameSchedule &&
                gameSchedule.gameStatus !== "Submission Closed" && (
                  <TouchableOpacity
                    onPress={() => {
                      if (item.profile) {
                        navigation.navigate("UserScoringView", {
                          eventID: route.params.contestID,
                          gameScoreId,
                          contestID: route.params.contestID,
                          gameID: route.params.gameID,
                          userProfile: item.profile,
                          userID: item.userID,
                          eventName: route.params.eventName,
                          gameStatus: gameSchedule?.gameStatus,
                        });
                      }
                    }}
                    style={styles.submitScoreButton}
                  >
                    <Text style={styles.enterScoreText}>Submit Entry</Text>
                  </TouchableOpacity>
                )}
            </>
          )}
        </View>
        {/* <View style={{ width: 240, marginRight: 15}}>
          <Text style={{ fontWeight: 'bold', color: 'black' }}>
            {userEventProfiles[item.userID] ? `Q: ${userEventProfiles[item.userID].profileQ1Label}` : ''}
          </Text>
          <Text style={{ fontWeight: 'normal', color: 'black' }}>
            {userEventProfiles[item.userID] ? `A: ${userEventProfiles[item.userID].profileA1}` : ''}
          </Text>
        </View> */}
        <View>
          {gameSchedule?.gameStatus === "Final" && (
            <Text style={styles.userNameText}>
              {userAveragesScore(item.userID).toFixed(2)} Avg{" "}
              <Text style={{ fontWeight: "normal" }}>from</Text>
            </Text>
          )}
          {(gameSchedule?.gameStatus === "Submit and Judge" ||
            gameSchedule?.gameStatus === "Judging Open" ||
            gameSchedule?.gameStatus === "Judging Closing" ||
            gameSchedule?.gameStatus === "Judging 5 Min Warning" ||
            gameSchedule?.gameStatus === "Final") && (
            <Text style={styles.userNameText}>
              {userScoresCount(item.userID)} Judges
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    setGameScheduleId(route.params?.gameScheduleId);
  }, [route.params?.gameScheduleId]);

  useEffect(() => {
    if (gameScheduleId) {
      gameScheduleRef.current = firebase
        .firestore()
        .collection("gameSchedule")
        .doc(gameScheduleId)
        .onSnapshot((doc) => {
          setGameSchedule(doc.data());
        });
    }
  }, [gameScheduleId]);

  useEffect(() => {
    const eventID = route.params.eventID;
    const contestID = route.params.contestID;

    const usersSubscribe = firebase
      .firestore()
      .collection("userEnteredContests")
      .where("eventID", "==", eventID)
      .where("contestID", "==", contestID)
      .onSnapshot((querySnapshot) => {
        setContestUsers(querySnapshot.docs.map((doc) => doc.data()));
      });

    snapshotGameScores();

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setMe(user);
      } else {
        console.log("auth current user is Invalid");
      }
    });

    return () => {
      usersSubscribe();
      unsubscribe();
      gameScoresRef.current?.();
      gameScheduleRef.current?.();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaStyles}>
      <View style={{ alignItems: "center", flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Feather
            name="chevron-left"
            size={25}
            color={"black"}
            style={{ color: "black" }}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 20, marginRight: 20 }}>
          <Text
            style={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}
          >
            {route.params.eventName} - {route.params.contestName}
          </Text>
        </View>
        <View style={{ width: 40, height: 40 }}></View>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 14,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          ScoreBoard
        </Text>

        <Text
          style={{
            fontWeight: "normal",
            fontSize: 14,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          {gameSchedule?.gameStatus ?? "Scheduled"}
        </Text>

        <View style={{ height: 20 }} />
        <FlatList
          data={gameScoreBoard}
          extraData={userEventProfiles}
          renderItem={({ item, index }) => renderItem(item, index)}
        />
      </View>
    </SafeAreaView>
  );
};

export default JudgeScoreGame;

const styles = StyleSheet.create({
  itemViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  itemViewIndexing: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
    color: "black",
  },
  itemViewUserAvatar: {
    width: 50,
    height: 50,
    backgroundColor: "#C4C4C4",
    borderRadius: 25,
  },
  itemViewUserEventProfilePicture: {
    width: 80,
    height: 50,
    backgroundColor: "#C4C4C4",
    marginLeft: 10,
  },
  itemViewMiddleContent: {
    flex: 1,
    marginHorizontal: 10,
  },
  userNameText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "black",
  },
  myScoreText: {
    fontSize: 15,
    color: "black",
  },
  submitScoreButton: {
    backgroundColor: "#27AE60",
    padding: 7,
    width: 120,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  enterScoreText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 15,
  },
  viewScoreButton: {
    backgroundColor: "#0B214D",
    padding: 7,
    width: 80,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  viewScoreText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 15,
  },
  safeAreaStyles: {
    flex: 1,
    flexDirection: "column",
  },
});
