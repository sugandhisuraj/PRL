import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Alert,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ActivityIndicator
} from "react-native";

import { firebase } from '../../firebase';
import 'firebase/firestore';

import Feather from "react-native-vector-icons/Feather";
import AntDesign from 'react-native-vector-icons/AntDesign';
import FilterImg from '@assets/FilterIcon.png';

import FilterEventSidebar from "./EventFilterSideBar"

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import BottomSheet from 'react-native-bottomsheet';
import { StatusBar } from "react-native";

Feather.loadFont();
MaterialIcons.loadFont();

const useComponentWillUnmount = handler => {
  return useEffect(() => handler, []);
}

const GamesListView = (props) => {

  const [filterEventDataLoaded, setFilterEventDataLoaded] = useState(false);
  const [filterDataLoading, setFilterDataLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [contestTypes, setContestTypes] = useState([]);

  const [filterEventCategoryName, setFilterEventCategoryName] = useState("");
  const [filterEventSubCategoryName, setFilterEventSubCategoryName] = useState("");
  const [filterEventGenreName, setFilterGenreName] = useState("");
  const [filterEventContestTypeName, setFilterEventContestTypeName] = useState("");

  const [contests, setContests] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [allEvents, setAllEvents] = useState([]);
  const [allContests, setAllContests] = useState([]);

  const { navigation, route } = props;

  const [loadingData, setLoadingData] = useState(true);

  const [filterShowing, setFilterShowing] = useState(false);

  const [me, setMe] = useState(null);
  const [myProfile, setMyProfile] = useState(null);

  const [gameHostStatusArray, setGameHostStatusArray] = useState(null);

  const loadEventDataForFiltering = async () => {
    let querySnapshot = await firebase.firestore().collection("eventCategories")
        .get();

    let eventCategories = [];
    querySnapshot.forEach(documentSnapshot => {
      let eventCategory = documentSnapshot.data();
      eventCategories = [...eventCategories, eventCategory];
    });

    setCategories(eventCategories);

    querySnapshot = await firebase.firestore().collection("eventSubCategories")
        .get();

    let eventSubCategories = [];
    querySnapshot.forEach(documentSnapshot => {
      let eventCategory = documentSnapshot.data();
      eventSubCategories = [...eventSubCategories, eventCategory];
    });

    setSubCategories(eventSubCategories);

    querySnapshot = await firebase.firestore().collection("eventGenreTypes")
        .get();

    let eventGenreTypes = [];
    querySnapshot.forEach(documentSnapshot => {
      let eventCategory = documentSnapshot.data();
      eventGenreTypes = [...eventGenreTypes, eventCategory];
    });

    setGenres(eventGenreTypes);

    querySnapshot = await firebase.firestore().collection("contestTypes")
        .where("isActive", "==", true)
        .get();

    let eventContestTypes = [];
    querySnapshot.forEach(documentSnapshot => {
      let eventCategory = documentSnapshot.data();
      eventCategory.value=eventCategory.contestType;
      eventContestTypes = [...eventContestTypes, eventCategory];
    });
    console.log("Event contest types => ", eventContestTypes);
    setContestTypes(eventContestTypes);

    setFilterEventDataLoaded(true);
    setFilterDataLoading(false);
  };

  const splitEventIdsArray = (eventIds) => {
    if (eventIds.length > 0) {
      let splittedIds = [];
      let seeker = 0;
      while(seeker < eventIds.length) {
        let elementSplitIds = [];
        for (let idx = 0; idx < 10; idx++) {
          if (seeker + idx < eventIds.length) {
            elementSplitIds.push(eventIds[seeker + idx]);
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

  const loadEvents = async (eventIds) => {

    let eventSplittedIdsArray = splitEventIdsArray(eventIds);
    let evs = [];
    for (idx = 0; idx < eventSplittedIdsArray.length; idx++) {
      const querySnapshot = await firebase.firestore().collection("events")
        .where("eventID", "in", eventSplittedIdsArray[idx])
        .get();

      
      querySnapshot.forEach(documentSnapshot => {
        let event = documentSnapshot.data();
        evs = [...evs, event];
      });
    }
    
    return evs.filter(ev => ev.eventID !== undefined && ev.eventID !== "").sort((event1, event2) => event1.eventName > event2.eventName);
  };

  const loadContests = async (eventIDs) => {

    let eventSplittedIdsArray = splitEventIdsArray(eventIDs);
    let cnts = [];

    for (idx = 0; idx < eventSplittedIdsArray.length; idx++) {
      const querySnapshot = await firebase.firestore().collection("contests")
        .where("eventID", "in", eventSplittedIdsArray[idx])
        .get();
            
      querySnapshot.forEach(documentSnapshot => {
        let contest = documentSnapshot.data();
        cnts = [...cnts, contest];
      });
    }
    let filtered = cnts.filter(cnt => cnt.contestID !== undefined && cnt.contestID !== "").sort((contest1, contest2) => contest1.contestName > contest2.contestName);
    return filtered;
  };

  let unsubscribeRefsArray = [];

  const [gameStatusArray, setGameStatusArray] = useState([]);

  useComponentWillUnmount(() => {
    console.log("Component will unmount!");
    if (unsubscribeRefsArray.length > 0) {
      unsubscribeRefsArray.forEach(ref => {
        ref();
      });
    }
    unsubscribeRefsArray = [];
  })

  const configureGameStatusListening = (gameIds) => {
    let gameIdsSplittedArray = splitEventIdsArray(gameIds);
    
    if (unsubscribeRefsArray.length > 0) {
      unsubscribeRefsArray.forEach(ref => {
        ref();
      });
    }
    
    unsubscribeRefsArray = [];
    
    for (idx = 0; idx < gameIdsSplittedArray.length; idx++) {

      const unsubscribeRef = firebase.firestore().collection("gameScheduleStatus")
        .where("gameID", "in", gameIdsSplittedArray[idx])
        .onSnapshot((querySnapshot) => {
          if (!querySnapshot.empty) {

            const statusArray = gameStatusArray;

            querySnapshot.forEach(documentSnapshot => {

              let gameStatusData = documentSnapshot.data();

              const arrayIndex = statusArray.findIndex(element => element.gameID === gameStatusData.gameID);

              if (arrayIndex !== -1) {
                statusArray[arrayIndex] = gameStatusData;
              } else {
                statusArray.push(gameStatusData);
              }
            });
            // console.log("new game status array => ", statusArray);
            
            setGameStatusArray([...statusArray]);
          }
        });
      
      unsubscribeRefsArray.push(unsubscribeRef);
    }
  }

  const loadMyProfile = () => {
    if (me != null) {
      const myUserId = me.uid;
      firebase.firestore().collection("users").doc(myUserId)
        .get()
        .then(docSnapshot => {
          if (docSnapshot.exists) {
            setMyProfile(docSnapshot.data());
          }
        });
    }
  };

  const loadAllGames = async () => {

    console.log("Loading games");

    const myUserId = firebase.auth().currentUser.uid;
    const userContestsQuery = await firebase.firestore().collection("userEnteredContests")
      .where("userID", "==", myUserId)
      .get();

    let myEventIds = [];
    
    userContestsQuery.forEach(documentSnapshot => {
      const userContest = documentSnapshot.data();
      const eventId = userContest.eventID;
      if (eventId !== undefined && !myEventIds.includes(eventId)) {
        myEventIds = [...myEventIds, eventId];
      }
    });

    const myEvents = await loadEvents(myEventIds);
    setAllEvents(myEvents);

    const myContests = await loadContests(myEventIds);
    setAllContests(myContests);

    let eventSplittedIdsArray = splitEventIdsArray(myEventIds);
    let gameContests = [];

    let gameIds = [];

    for (idx = 0; idx < eventSplittedIdsArray.length; idx++) {

      const gamesQuery = await firebase.firestore().collection("gameSchedule").where("eventID", "in", eventSplittedIdsArray[idx]).get();

      gamesQuery.forEach(documentSnapshot => {

        let game = documentSnapshot.data();
        if (gameIds.includes(`${game.gameID}`) === false) {
          gameIds = [...gameIds, `${game.gameID}`];
        }
        
        if (route.params.isMine === false || (myUserId === game.player1ID || myUserId === game.player2ID)) {
          game.gameScheduleId = documentSnapshot.id;
          let existingContest = gameContests.some(e => e.contestID === game.contestID);
          if (existingContest) {
            let contest = gameContests.find(e => e.contestID === game.contestID);
            contest.data = [...contest.data, game];
          } else {
            const gameContest = myContests.find(contest => contest.contestID == game.contestID);
            const gameEvent = myEvents.find(event => event.eventID == game.eventID);
            gameContests = [...gameContests, 
              { contestID: game.contestID, 
                contestName: gameContest === undefined ? game.contestName : gameContest.contestName,
                eventID: game.eventID, 
                eventCategory: gameEvent.eventCategory,
                contestTypeID: gameContest === undefined ? game.contestTypeID : gameContest.contestTypeID,
                eventContestType: gameEvent.eventContestType,
                eventGenre: gameEvent.eventGenre,
                eventSubCategory: gameEvent.eventSubCategory,
                eventName: gameEvent === undefined ? "???" : gameEvent.eventName,
                data: [game] 
              }];
          }
        }
      });
    }

    console.log("Loaded game IDs list => ", gameIds);
    configureGameStatusListening(gameIds);

    gameContests.forEach(contest => {
      contest.data.sort((game1, game2) => {
        if (game1.gameID > game2.gameID) {
          return 1;
        } else if (game1.gameID < game2.gameID) {
          return -1;
        } else {
          return 0;
        }
      })
    })

    gameContests.sort((contest1, contest2) => {
      let contestName1 = (contest1.eventName + contest1.contestName).toLowerCase();
      let contestName2 = (contest2.eventName + contest2.contestName).toLowerCase();
      if (contestName1 > contestName2) {
        return 1;
      } else if (contestName1 < contestName2) {
        return -1;
      } else {
        return 0;
      }
    });

    setContests(gameContests);
    setFilteredResults(gameContests);
    setLoadingData(false);
    setRefreshing(false);
    console.log("Games loading completed");
  };

  const statusOfGame = (game) => {  // 0 for live, 1 for completed, 2 for upcoming, 3 for On Deck, 4 for Sign In, 5 for Message

    const status = gameStatusArray.find(element => element.gameID === `${game.gameID}`);
    if (status !== undefined) {
      let statusText = status.status;

      if (!isJudgeScoreTypeGame(game)) {  
        if (status.player1Live === player1Live  && true === status.player2Live) {
          return 0;
        }  
      }

      let player1Live = status.player1Live;
      let player2Live = status.player2Live;

      if (true === player1Live  && true === player2Live) {
        return 0;
      } else if (statusText === "Final") {
        return 1;
      } else if (statusText === "Upcoming") {
        return 2;
      } else if (statusText === "On Deck") {
        return 3;
      } else if (statusText === "Sign In") {
        return 4;
      } else if (statusText === "Message") {
        return 5;
      } else {
        return 6;
      }
    }

    if ((game.player1IsLive === true && game.player2IsLive === true)) {
      return 0;
    } else if (game.gameStatus === 'Final') {
      return 1;
    } else if (game.gameStatus === 'Upcoming') {
      return 2;
    } else if (game.gameStatus === 'On Deck') {
      return 3;
    } else if (game.gameStatus === 'Sign In') {
      return 4;
    } else if (game.gameStatus === 'Message') {
      return 5;
    } else {
      return 6;
    }
  };

  const isGameLive = (game) => {

    const status = gameStatusArray.find(element => element.gameID === `${game.gameID}`);
    if (status !== undefined) {
      let player1Live = status.player1Live;
      let player2Live = status.player2Live;

      return (player1Live === true && player2Live === true)
    }

    return (game.player1IsLive === true && game.player2IsLive === true)
  };

  const contestNameForContestId = (contestID) => {
    const contest = allContests.find(element => element.contestID === contestID)
    if (contest === undefined) {
      return "???";
    } else {
      if (contest.contestName === undefined) {
        return "???";
      } else {
        return contest.contestName;
      }
    }
  }

  const eventNameForEventId = (eventID) => {
    const event = allEvents.find(element => element.eventID === eventID)
    if (event === undefined) {
      return "???";
    } else {
      if (event.eventName === undefined) {
        return "???";
      } else {
        return event.eventName;
      }
    }
  }

  const eventLogoForEventId = (eventID) => {
    const event = allEvents.find(element => element.eventID === eventID)
    if (event) {
      return event.eventLogo;
    } else {
      return "";
    }
  }

  const isJudgeScoreTypeGame = (game) => {
    const contestTypeId = contestTypeIdForContestID(game.contestID);
    return contestTypeId === "Judges Scoring"
  }

  const contestTypeIdForContestID = (contestID) => {
    const contest = allContests.find(
      (element) => element.contestID === contestID
    );
    if (contest === undefined) {
      return '';
    } else {
      if (contest.contestTypeID === undefined) {
        return '';
      } else {
        return contest.contestScoringType;
      }
    }
  };

  useEffect(() => {
    filterContestFully();
  }, [contests]);

  const filterContestFully = () => {
    setFilteredResults(contests.filter(contest => {
      let filtered = true;
      if (filterEventCategoryName !== "") {
        filtered = filtered && (contest.eventCategory === filterEventCategoryName)
      }
      
      if (filterEventSubCategoryName !== "") {
        filtered = filtered && (contest.eventSubCategory === filterEventSubCategoryName)
      }

      if (filterEventSubCategoryName !== "") {
        filtered = filtered && (contest.eventSubCategory === filterEventSubCategoryName)
      }

      if (filterEventGenreName !== "") {
        filtered = filtered && (contest.eventGenre === filterEventGenreName)
      }

      if (filterEventContestTypeName !== "") {
        filtered = filtered && (contest.eventContestType === filterEventContestTypeName)
      }
      return filtered;
    }));
  }

  const showBottomSheet = (gameScheduleId) => {
    let options = gameHostStatusArray.map(hostStatus => hostStatus.gameStatus);
    options.push('Cancel');
    BottomSheet.showBottomSheetWithOptions({
      options: options,
      title: 'Change status to send message',
      dark: true,
      cancelButtonIndex: options.length - 1,
    }, (value) => {
      console.log("value => ", value);
      if (value < options.length - 1) {
        const newStatus = options[value];
        console.log("new status ", newStatus);
        firebase.firestore().collection("gameSchedule").doc(gameScheduleId).update({
          gameStatus: newStatus
        }).then(() => {
          // let contestIndex = contests.findIndex(contest => contest.data.some(game => game.gameScheduleId === gameScheduleId));
          // if (contestIndex !== -1) {
          //   let containingContest = contests[contestIndex];
          //   let gameIndex = containingContest.data.findIndex(game => game.gameScheduleId === gameScheduleId);
          //   if (gameIndex !== -1) {
          //     let currentGame = contests[contestIndex].data[gameIndex];
          //     currentGame.hostStatus = newStatus;
          //     contests[contestIndex].data[gameIndex] = currentGame;
          //     console.log("Updating current game status => ", currentGame.hostStatus);
          //     setContests([...contests]);
          //   }
          // }
        });
      }
    });
  }

  const openGameDetails = (game) => {
    if (isJudgeScoreTypeGame(game)) {
      navigation.navigate("JudgeScoreGame", {
        gameScheduleId: game.gameScheduleId,
        eventID: game.eventID,
        contestID: game.contestID,
        eventName: eventNameForEventId(game.eventID),
        contestName: contestNameForContestId(game.contestID),
        gameID: game.gameID,
      })
    } else {
      if (game.player1ID === "" || game.player2ID === "") {
        Alert.alert("", "The players of this game have not been determined yet.  Please check back later.", [{ text: 'OK', onPress: () => { } }]);
      } else {
        let status = statusOfGame(game);
        if (status == 0) { // live
          navigation.navigate("GameScreen", {
            gameScheduleId: game.gameScheduleId,
            gameID: game.gameID,
            pageTitle: 'Game #' + game.gameID
          });
        } else if (status == 1) { // completed
          navigation.navigate("CompletedGameScreen", {
            game: game,
            gameScheduleId: game.gameScheduleId
          });
        } else {  // upcoming
          if (game.player1ID == firebase.auth().currentUser.uid || game.player2ID == firebase.auth().currentUser.uid) { // Player should open game page
            navigation.navigate("GameScreen", {
              gameScheduleId: game.gameScheduleId,
              gameID: game.gameID,
              pageTitle: 'Game #' + game.gameID
            });
          } else {  // For audience,  open upcoming game page
            navigation.navigate("UpcomingGameScreen", {
              game: game,
              gameScheduleId: game.gameScheduleId
            });
          }
        }
      }
    }
  };

  const gameStatusBackgroundColor = (game) => {
    const gameStatus = statusOfGame(game);
    if (gameStatus === 0) {
      return 'rgba(0, 255, 0, 0.5)';
    } else if (gameStatus === 3) {
      return '#add8e6';
    } else if (gameStatus === 4) {
      return '#ff8000';
    } else {
      return 'white';
    }
  }

  const statusTextForGame = (game) => {
    const gameStatus = statusOfGame(game);
    if (gameStatus === 0) {
      return 'Live';
    } else if (gameStatus === 1) {
      return 'Completed';
    } else if (gameStatus === 2) {
      return 'Upcoming';
    } else if (gameStatus === 3) {
      return 'On Deck';
    } else if (gameStatus === 4) {
      return 'Sign In';
    } else if (gameStatus === 5) {
      return 'Message';
    } else {
      return game.gameStatus;
    }
  }

  useEffect(() => {

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setMe(user);
      } else {
        console.log("auth current user is Invalid");
      }
    });
    return () => unsubscribe();

  }, []);

  useEffect(() => {
    if (myProfile !== null && (myProfile.userType === 'admin' || myProfile.userType === 'host')) {
      firebase.firestore().collection("gameStatuses").where('isActive', '==', true).orderBy("sortOrder").get()
        .then(statusQuerySnapshot => {
          console.log("game host status array => ", statusQuerySnapshot);
          setGameHostStatusArray(statusQuerySnapshot.docs.map(doc => doc.data()));
        })
        .catch(err => {
          console.log("game host status array err => ", err);
        });
    }
  }, [myProfile]);

  useEffect(() => {
    if (me != null) {
      loadMyProfile();
      loadAllGames();
    }
  }, [me]);

  useEffect(() => {
    filterContestFully();
  },[filterEventCategoryName, filterEventSubCategoryName, filterEventGenreName, filterEventContestTypeName, gameStatusArray]);

  const renderItem = (game) => {
    return (
      <TouchableOpacity onPress={() => { openGameDetails(game); }} 
        style={{backgroundColor: gameStatusBackgroundColor(game) }}
        >

        <View style={{paddingTop: 15, paddingBottom: 15, flexDirection: 'row' }}>
          <View style={{ justifyContent: 'center', width: 90, marginLeft: 10 }}>
            {(eventLogoForEventId(game.eventID) === undefined || eventLogoForEventId(game.eventID) === '') ? 
              <Image style={{ width: 72, height: 25 }}
                source={require('../../assets/PRLLogo300.png')} /> :
              <Image style={{ width: 72, height: 72 }}
                resizeMode={"contain"}
                source={{ uri: eventLogoForEventId(game.eventID) }} />
            }
          </View>
          <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', width: '100%', paddingRight: 10, alignItems: "center" }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, flex: 1 }}>Game #{game.gameID}</Text>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'black' }}>
                  { statusTextForGame(game) }
                </Text>
              </View>
              {true == game.gameRecordingOn &&
              <MaterialIcons 
                name={ true == game.gameRecordingOn ? "videocam" : "videocam-off" }
                style={{ marginLeft: 10 }}
                color="rgba(0, 0, 0, 0.6)"
                size={24}/>
              }
              
            </View>
            <View style={{ marginTop: 10, flexDirection: 'row', alignItems:'center' }}>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                {(game.player1ID === "" || game.player2ID === "") ? (
                  <Text style={{ fontSize: 12 }}>
                    The players of this game have not been determined yet.  Please check back later.
                  </Text>
                ) : (
                  <>
                    {isJudgeScoreTypeGame(game) ? (
                      <>
                        <View style={{ 
                          backgroundColor: 'green',
                          width: 10,
                          height: 10,
                          borderRadius: 5
                          }} />
                        <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }}>
                          {game.gameDescription}
                        </Text>
                      </>
                    ) : (
                    <>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        {game.player1ID == firebase.auth().currentUser.uid ? "You" : game.player1Name}
                      </Text>
                      <Text style={{ fontSize: 16 }}>
                        &nbsp;vs&nbsp;
                      </Text>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                        {game.player2ID == firebase.auth().currentUser.uid ? "You" : game.player2Name}
                      </Text>
                    </>
                    )}
                  </>
                  )}
              </View>
              {(myProfile !== null && (myProfile.userType === 'admin' || myProfile.userType === 'host') && (statusOfGame(game) !== 0)) &&
                <TouchableOpacity
                  onPress={() => showBottomSheet(game.gameScheduleId)}
                  style={{
                    width: 80, 
                    height: 20, 
                    borderRadius: 3, 
                    borderColor: 'gray', 
                    borderWidth: 1, 
                    marginRight: 10,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  <Text
                    style={{ fontSize: 10, color: 'gray' }}>
                      Change Status
                      {/* { game.hostStatus ? game.hostStatus : "Status" } */}
                  </Text>
                </TouchableOpacity>
              }
            </View>
            
            <Text style={{ color: "#3f3f3f", fontSize: 12, marginTop: 10 }}>{game.gameDescription}</Text>
          </View>
        </View>
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', height: 1 }} />
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View style={{ width: "100%", backgroundColor:'white', alignSelf: "center", height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: 15, paddingRight: 0 }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Feather name="menu" size={25} color={'#000'} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
          {route.params.isMine == true ? "My Games" : "All Games"}
        </Text>
        <TouchableOpacity
          style={{ width: 50 }}
          onPress={async () => {
            if (filterEventDataLoaded === false) {
              setFilterDataLoading(true);
              await loadEventDataForFiltering();
            }
            setFilterShowing(true);
          }}>
          <Image source={FilterImg} />
        </TouchableOpacity>
      </View>
      {loadingData ? 
        <ActivityIndicator style={{marginTop: 30}} />
      : 
        <>
        { filteredResults.length == 0 ? 
        <Text style={{ width: '100%', textAlign: 'center', marginTop: 20, color: '#7f7f7f'}}>
          No Games have been scheduled yet for your Events.  Please check back later
        </Text>
        :
        <SectionList
          style={{backgroundColor: 'white'}}
          sections={ filteredResults }
          extraData={ gameStatusArray }
          renderItem={({ item }) => renderItem(item)}
          renderSectionHeader={({ section: { contestID, eventID } }) => (
            <View style={{flexDirection: 'row', backgroundColor: '#0B214D', alignItems: 'center'}}>
              <Text style={{ flex: 1, color: 'white', padding: 10, fontSize: 18 }}>
                { eventNameForEventId(eventID) + " - " + contestNameForContestId(contestID)}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ContestChatScreen', { contestID, eventID, contestName: contestNameForContestId(contestID), eventName: eventNameForEventId(eventID)});
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 44,
                  height: 44
                }}>
                <AntDesign name="message1" size={18} color="white"/>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ChannelRoom", {
                    eventId: eventID,
                    eventName:  eventNameForEventId(eventID)
                  });
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 44,
                  height: 44
                }}>
                  <MaterialIcons 
                    name="group"
                    color="white"
                    size={24}/>
              </TouchableOpacity>
            </View>
            
          )}
          keyExtractor={(item, index) => item + index}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              loadAllGames();
            }} />
          } />
        }
        </>
      }

      {filterDataLoading && (
        <View style={{ position: 'absolute', width: '100%', height: Dimensions.get('window').height, backgroundColor: 'rgba(0,0,0,0.4)'}}>
          <ActivityIndicator style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}} color="white"/>
        </View>
      )}

      <FilterEventSidebar
        filterVisible={filterShowing}
        categories={categories}
        subCategories={subCategories}
        genres={genres}
        contestTypes={contestTypes}
        setIsFilterVisible={() => {
          setFilterShowing(i => !i);
        }}
        onCategorySelected={(eventCategory) => {
          setFilterEventCategoryName(eventCategory.name);
        }}
        onSubCategorySelected={(eventSubCategory) => {
          setFilterEventSubCategoryName(eventSubCategory.name);
        }}
        onGenreSelected={(genre) => {
          setFilterGenreName(genre.name);
        }}
        onContestTypeSelected={(contestType) => {
          console.log("Contest type => ", contestType);
          setFilterEventContestTypeName(contestType);
        }}
        onCleared={() => {
          setFilterEventCategoryName("");
          setFilterEventSubCategoryName("");
          setFilterGenreName("");
          setFilterEventContestTypeName("");
        }}
        />
    </SafeAreaView>
  );
};

export default GamesListView;