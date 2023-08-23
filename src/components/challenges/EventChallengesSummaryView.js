import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";

import { firebase } from '../../firebase';
import BackImg from '@assets/arrow_left.png';
import PointImg from '@assets/K.png';
import 'firebase/firestore';
import { format } from 'date-fns';
import ArrowRightImage from '@assets/arrow_right.png';
import ArrowDownImage from '@assets/ArrowDown.png';
import ArrowUpImage from '@assets/ArrowUp.png';

const EventChallengesSummaryView = ({ navigation, route }) => {

  const [me, setMe] = useState(null);
  const [event, setEvent] = useState(route.params.event);
  const [eventSummary, setEventSummary] = useState(route.params.eventPointsSummary);
  const [transactions, setTransactions] = useState([]);
  const [sortDirection, setSortDirection] = useState(0);

  const transactionsSnapshotUnsubscribe = useRef(null);
  const eventSummarySnapshotUnsubscribe = useRef(null);

  const loadTransactions = () => {

    transactionsSnapshotUnsubscribe.current = firebase.firestore().collection("playerChallengePointsTransactions")
      .where("eventID", "==", event.eventID)
      .where("userID", "==", me.uid)
      .onSnapshot((querySnapshot) => {
        let myTransactions = []

        querySnapshot.forEach(documentSnapshot => {
          let transaction = documentSnapshot.data();
          myTransactions = [...myTransactions, transaction];
        });
    
        setTransactions(myTransactions.sort((a, b) => {
          if (sortDirection === 0) {
            return b.transactionTime.toDate().getTime() > a.transactionTime.toDate().getTime()
          } else {
            return a.transactionTime.toDate().getTime() > b.transactionTime.toDate().getTime()
          }
        }));
      });
    
    console.log("snapshot registered with unsubscribe callback.");
  };

  const snapshotEventSummary = () => {
    eventSummarySnapshotUnsubscribe.current = firebase.firestore().collection("playerEventChallengePoints")
        .where("eventID", "==", event.eventID)
        .where("userID", "==", me.uid)
        .onSnapshot((querySnapshot) => {
          console.log("Event summary point updated => ", querySnapshot.size);
          if (querySnapshot.size > 0) {
            setEventSummary(querySnapshot.docs[0].data());
          }
        });
  };

  const transactionTypeString = (transaction) => {
    if (transaction.transactionType === 'EventSignup') {
      return "You joined to Event"
    } else if (transaction.transactionType === 'CreatedNewChallenge') {
      return "You created a new pick on Game #" + transaction.gameID
    } else if (transaction.transactionType === 'AcceptedChallenge') {
      return "You accepted a pick on Game #" + transaction.gameID
    } else if (transaction.transactionType === 'MyChallengeStarted') {
      return "Your pick was accepted on Game #" + transaction.gameID
    } else if (transaction.transactionType === 'MyChallengeDeclined') {
      return "Your pick was declined on Game #" + transaction.gameID
    } else if (transaction.transactionType === 'ChallengeWin') {
      return "Your pick won on Game #" + transaction.gameID
    } else if (transaction.transactionType === 'ChallengeLost') {
      return "Your pick lost on Game #" + transaction.gameID
    } else if (transaction.transactionType === 'MyChallengeExpired') {
      return "Your pick expired on Game #" + transaction.gameID
    } else if (transaction.transactionType === 'BuyPoint') {
      return "You purchased new points"
    } else if (transaction.transactionType === 'CancelMyChallenge') {
      return "You cancelled pick on Game #" + transaction.gameID
    } else {
      return transaction.transactionType
    }
  }

  const transactionPointDirection = (transaction) => {
    if (transaction.transactionType === 'EventSignup') {
      return 1
    } else if (transaction.transactionType === 'CreatedNewChallenge') {
      return -1
    } else if (transaction.transactionType === 'AcceptedChallenge') {
      return -1
    } else if (transaction.transactionType === 'MyChallengeStarted') {
      return 0
    } else if (transaction.transactionType === 'MyChallengeDeclined') {
      return 1
    } else if (transaction.transactionType === 'ChallengeWin') {
      return 1
    } else if (transaction.transactionType === 'ChallengeLost') {
      return -1
    } else if (transaction.transactionType === 'MyChallengeExpired') {
      return 1
    } else if (transaction.transactionType === 'BuyPoint') {
      return 1
    } else if (transaction.transactionType === 'CancelMyChallenge') {
      return 1
    } else {
      return 0
    }
  }

  const renderTransaction = (transaction) => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20, paddingTop: 10, paddingBottom: 10 }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text>
              {transactionTypeString(transaction)}
            </Text>
            {/* <Text style={{ fontSize: 11 }}>
              {format(transaction.transactionTime.toDate(), 'h:mm aaa, MMM d, yyyy')}
            </Text> */}
          </View>
          {(transactionPointDirection(transaction) == 1 || transactionPointDirection(transaction) == -1) &&
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Image source={PointImg}
                style={{ tintColor: (transactionPointDirection(transaction) == 1) ? '#5CDA68' : 'red', width: 20, height: 14 }}
                tintColor={(transactionPointDirection(transaction) == 1) ? '#5CDA68' : 'red'} />
              <Text
                style={{
                  fontWeight: 'bold',
                  marginLeft: 10,
                  color: (transactionPointDirection(transaction) == 1) ? '#5CDA68' : 'red'
                }}>
                {transactionPointDirection(transaction) == 1 ? "+" : ""}{transactionPointDirection(transaction) * transaction.transactionPoints} Pts
            </Text>
            </View>
          }
        </View>
        <View style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
      </View>
    );
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("user id => ", user.uid);
        setMe(user);
      } else {
        console.log("auth current user is Invalid");
      }
    });
    return () => {
      if (transactionsSnapshotUnsubscribe?.current) {
        console.log("unsubscribing transactions snapshot in EventChallengesSummaryView");
        transactionsSnapshotUnsubscribe.current();
      }
      if (eventSummarySnapshotUnsubscribe?.current) {
        console.log("unsubscribing event summary snapshot in EventChallengesSummaryView");
        eventSummarySnapshotUnsubscribe?.current();
      }
      unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (me) {
      loadTransactions();
      snapshotEventSummary();
    }
  }, [me, event]);

  useEffect(() => {
    setEvent(route.params.event);
    setEventSummary(route.params.eventPointsSummary);
  }, [route.params]);

  useEffect(() => {
    transactions.sort((a, b) => {
      if (sortDirection === 0) {
        return b.transactionTime.toDate().getTime() > a.transactionTime.toDate().getTime()
      } else {
        return a.transactionTime.toDate().getTime() > b.transactionTime.toDate().getTime()
      }
    })
    setTransactions([...transactions]);
  }, [sortDirection]);

  const renderSummaryPointsValuesView = useCallback(() => (
    <View>
      
      <View style={{ height: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
        <Text style={{ flex: 2, textAlign: 'right' }}>
          Total:
          </Text>
        <View style={{ width: 20 }} />
        <View style={{ flex: 3, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Image source={PointImg} style={{ tintColor: 'black', width: 20, height: 14 }} tintColor='black' />
          <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>
            {eventSummary.totalPoints === undefined ? 0 : eventSummary.totalPoints}pt
            </Text>
        </View>
      </View>

      <View style={{ height: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={{ flex: 2, textAlign: 'right' }}>
          In Pending:
        </Text>
        <View style={{ width: 20 }} />
        <View style={{ flex: 3, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Image source={PointImg} style={{ tintColor: 'red', width: 20, height: 14 }} tintColor='red' />
          <Text style={{ fontWeight: 'bold', marginLeft: 10, color: 'red' }}>
            {eventSummary.pointsInPending === undefined ? 0 : eventSummary.pointsInPending}pt
            </Text>
        </View>
      </View>

      <View style={{ height: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={{ flex: 2, textAlign: 'right' }}>
          In picks:
          </Text>
        <View style={{ width: 20 }} />
        <View style={{ flex: 3, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Image source={PointImg} style={{ tintColor: '#5CDA68', width: 20, height: 14 }} tintColor='#5CDA68' />
          <Text style={{ fontWeight: 'bold', marginLeft: 10, color: '#5CDA68' }}>
            {eventSummary.pointsInCurrentChallenges === undefined ? 0 : eventSummary.pointsInCurrentChallenges}pt
            </Text>
        </View>
      </View>

      <View style={{ height: 1, marginLeft: 20, marginRight: 20, backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />

      <View style={{ height: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={{ flex: 2, textAlign: 'right' }}>
          Available points:
          </Text>
        <View style={{ width: 20 }} />
        <View style={{ flex: 3, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Image source={PointImg} style={{ tintColor: 'black', width: 20, height: 14 }} tintColor='black' />
          <Text style={{ fontWeight: 'bold', marginLeft: 10 }}>
            {eventSummary.availablePoints === undefined ? 0 : eventSummary.availablePoints}pt
            </Text>
        </View>
      </View>
      

      <View style={{ height: 40, backgroundColor: '#0B214D', justifyContent: 'center', marginTop: 20 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 20 }}>Challenges</Text>
      </View>

      <TouchableOpacity style={{ height: 50, alignItems: 'center', flexDirection: 'row' }}
        onPress={() => {
          navigation.navigate("Event Challenges List", {
            event: event,
            show: 'pending'
          });
        }}>
        <Text style={{ color: 'black', marginLeft: 20, flex: 1 }}>
          Pending Picks
          </Text>
        {/* <Text style={{ fontWeight: 'bold' }}>
          {eventSummary.pointsInPending}pt
          </Text> */}
        <Image source={ArrowRightImage} style={{ tintColor: 'black', marginRight: 15, marginLeft: 15 }} tintColor="black" />
      </TouchableOpacity>

      <View style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />

      <TouchableOpacity style={{ height: 50, alignItems: 'center', flexDirection: 'row' }}
        onPress={() => {
          navigation.navigate("Event Challenges List", {
            event: event,
            show: 'current'
          });
        }}>
        <Text style={{ color: 'black', marginLeft: 20, flex: 1 }}>
          Current Picks
          </Text>
        {/* <Text style={{ fontWeight: 'bold' }}>
          {eventSummary.pointsInCurrentChallenges}pt
          </Text> */}
        <Image source={ArrowRightImage} style={{ tintColor: 'black', marginLeft: 15, marginRight: 15 }} tintColor="black" />
      </TouchableOpacity>

      <View style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />

      <TouchableOpacity style={{ height: 50, alignItems: 'center', flexDirection: 'row' }}
        onPress={() => {
          navigation.navigate("Event Challenges List", {
            event: event,
            show: 'all'
          });
        }}>
        <Text style={{ color: 'black', marginLeft: 20, flex: 1 }}>
          All Picks
          </Text>
        <Image source={ArrowRightImage} style={{ tintColor: 'black', marginRight: 15 }} tintColor="black" />
      </TouchableOpacity>

      <View style={{ height: 40, backgroundColor: '#0B214D', alignItems: 'center', flexDirection: 'row' }}>
        <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 20, flex: 1 }}>Event Point History</Text>
        <TouchableOpacity 
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => {
            console.log("change sort => ", sortDirection);
            if (sortDirection === 0) {
              setSortDirection(1);
            } else {
              setSortDirection(0);
            }
          }}>
          <Image 
            source={(sortDirection === 0) ? ArrowDownImage : ArrowUpImage} 
            style={{ width: 16, height: 16, resizeMode: 'contain'}}/>
        </TouchableOpacity>
      </View>
    </View>
  ), [eventSummary, sortDirection]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ height: 40, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <TouchableOpacity style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => {
            if (transactionsSnapshotUnsubscribe?.current) {
              console.log("unsubscribing transactions snapshot in EventChallengesSummaryView");
              transactionsSnapshotUnsubscribe.current();
            }
            if (eventSummarySnapshotUnsubscribe?.current) {
              console.log("unsubscribing event summary snapshot in EventChallengesSummaryView");
              eventSummarySnapshotUnsubscribe?.current();
            }
            navigation.goBack();
          }}>
          <Image style={{ tintColor: 'black' }} source={BackImg} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: 'black', fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>
          {event.eventName}
        </Text>
        <TouchableOpacity style={{ width: 40, height: 40 }}
          onPress={() => {
          }}>
        </TouchableOpacity>
      </View>
      <FlatList
        data={transactions}
        ListHeaderComponent={renderSummaryPointsValuesView()}
        renderItem={(item) => renderTransaction(item.item)}
        keyExtractor={(item) => item.transactionTime + item.transactionType} />
    </SafeAreaView>
  );
};

export default EventChallengesSummaryView;