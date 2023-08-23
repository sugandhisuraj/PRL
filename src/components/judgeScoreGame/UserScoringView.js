import React, { useEffect, useState } from 'react';
import { firebase } from '../../firebase';
import 'firebase/firestore';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Video } from 'expo-av';
import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView } from 'react-native-safe-area-context';

const UserScoringView = ({ navigation, route }) => {

  const { userID, eventID, myScore, gameStatus, gameScoreId,  userProfile, eventName } = route.params;

  const [inputScore, setInputScore] = useState(myScore ?? 1)
  const [userEventProfile, setUserEventProfile] = useState();

  const [me, setMe] = useState();

  const onSubmitScore = async () => {
    if  (gameScoreId && me) {
      let updateData = {};
      updateData[`scores.${userID}.${me.uid}`] = inputScore
      await firebase.firestore().collection('gameScores').doc(gameScoreId).update(updateData)
      navigation.goBack()
    }
  }

  useEffect(() => {
    if (eventID && userID) {
      console.log("eventID => ", eventID, "userID => ", userID);
      firebase.firestore().collection('playerEventProfile')
        .where('eventID', '==', eventID)
        .where('userID', '==', userID)
        .get()
        .then(querySnapshot => {
          console.log(querySnapshot.docs)
          if (querySnapshot.docs.length > 0) {
            console.log("user event profile", querySnapshot.docs[0].data())
            setUserEventProfile(querySnapshot.docs[0].data());
          }
      });
    }
  }, [eventID, userID]);

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

  return (
    <SafeAreaView style={styles.safeAreaStyles}>
      <TouchableOpacity style={{ marginLeft: 20 }}
        onPress={() => {
          navigation.goBack();
        }}>
          <Feather name="chevron-left" size={25} color={'black'} style={{color: 'black'}} />
      </TouchableOpacity>
      <ScrollView style={{ width: '100%', height: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, width: '100%' }}>
          
          {(userEventProfile && userEventProfile.profilePlayerPicture !== undefined && userEventProfile.profilePlayerPicture !== '') &&
            <Image source={{uri: userEventProfile.profilePlayerPicture}} style={{
              width: 80,
              height: 60,
              marginRight: 15
            }}/>
          }

          <Image source={{uri: userProfile.userAvatar}} style={styles.userAvatar}/>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>
            {userProfile.userName} 
          </Text>
        </View>

        <View style={styles.eventNameBar}>
          <Text style={{ fontWeight: 'bold', color: 'black' }}>{ eventName }</Text>
        </View>

        <View style={styles.profileHeaderBar}>
          <Text style={{ fontWeight: 'bold', color: 'black' }}>{ userProfile.userName }</Text>
          <Text style={{ fontWeight: 'normal', color: 'black' }}>{ userEventProfile?.profileNickName ?? '' }</Text>
        </View>

        <View style={styles.profileCaptionBar}>
          <Text style={{ fontWeight: 'bold', color: 'white' }}>Player Profile</Text>
          <View style={{flex: 1}} />
          {((gameStatus === 'Open for Submissions' || gameStatus === 'Submission Closing' || gameStatus === 'Submit and Judge') && (userID === me?.uid)) &&
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PlayerProfileScreen', {
                  userID,
                  eventID,
                  ob: 100,
                })
              }}>
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Edit</Text>
            </TouchableOpacity>
          }
        </View>

        <View style={{ width: '100%', paddingHorizontal: 20 }}>
          <Text style={styles.questionText}>{ userEventProfile?.profileQ1Label }</Text>
          <Text style={styles.answerText}>{ userEventProfile?.profileA1 ?? '-- No answer --' }</Text>
          <Text style={styles.questionText}>{ userEventProfile?.profileQ2Label }</Text>
          <Text style={styles.answerText}>{ userEventProfile?.profileA2 ?? '-- No answer --'  }</Text>
          <Text style={styles.questionText}>{ userEventProfile?.profileQ3Label }</Text>
          <Text style={styles.answerText}>{ userEventProfile?.profileA3 ?? '-- No answer --'  }</Text>
          <Text style={styles.questionText}>{ userEventProfile?.profileQ4Label }</Text>
          <Text style={styles.answerText}>{ userEventProfile?.profileA4 ?? '-- No answer --'  }</Text>
        </View>

        <View style={styles.mediaPanel}>
          <View style={styles.mediaContentBox}>
            <Text style={styles.questionText}>{ userEventProfile?.profileImageQ ?? 'PHOTO'  }</Text>
            <Image style={styles.mediaBox} resizeMode={'contain'} source={{ uri: userEventProfile?.profilePlayerPicture }}/>
          </View>
          <View style={{width: 80}} />
          <View style={styles.mediaContentBox}>
            <Text style={styles.questionText}>{ userEventProfile?.profileVideoQ ?? 'VIDEO'  }</Text>
            <View style={styles.mediaBox}>
              <Video
                source={{uri: userEventProfile?.profileVideo}}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                shouldPlay={true}
                useNativeControls
                style={{
                  width: '100%',
                  height: '100%',
                  alignSelf: "center",
                }}
              />
            </View>
          </View>
        </View>

        {(gameStatus === 'Submit and Judge' || gameStatus === 'Judging Open' || gameStatus === 'Judging Closing' || gameStatus === 'Judging 5 Min Warning' || gameStatus === 'Final') &&
          <>          
            <View style={styles.scoreInputBox}>
              <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 20 }}>
                {(gameStatus !== 'Final') ? 'Enter your Score 1(low) to 10(highest)' : gameStatus}
              </Text>
                <View style={styles.scoreSubmitPanel}>
                  <TouchableOpacity 
                    disabled={(gameStatus === 'Final') || inputScore <= 1}
                    onPress={() => setInputScore(inputScore - 1)}
                    style={styles.scoreSubmitControlButtons}>
                    <Text style={{ fontWeight: 'bold', color: inputScore === 1 ? 'gray' : (gameStatus === 'Final') ? 'gray' : 'black', fontSize: 24}}>
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 24, width: 80, textAlign: 'center'}}>
                    { inputScore }
                  </Text>
                  <TouchableOpacity 
                    disabled={(gameStatus === 'Final') || inputScore === 10}
                    onPress={() => setInputScore(inputScore + 1)}
                    style={styles.scoreSubmitControlButtons}>
                    <Text style={{ fontWeight: 'bold', color: inputScore === 10 ? 'gray' : (gameStatus === 'Final') ? 'gray' : 'black', fontSize: 24}}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
            </View>
            {(me && me.uid !== userID) &&
              <TouchableOpacity 
                disabled={gameStatus === 'Final'}
                onPress={onSubmitScore}
                style={[styles.enterScoreButton, gameStatus === 'Final' && {backgroundColor: 'gray'}]}>
                <Text style={styles.enterScoreText}>
                  {route.params.myScore ? 'Update Score' : 'Submit Score'}
                </Text>
              </TouchableOpacity>
            }
          </>
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserScoringView;

const styles = StyleSheet.create({
  safeAreaStyles: {
    flex: 1,
    flexDirection: 'column'
  },
  userAvatar: {
    width: 50,
    height: 50,
    backgroundColor: '#C4C4C4',
    borderRadius: 25,
    marginLeft: 20
  },
  eventNameBar: {
    backgroundColor: '#F4DAA2',
    height: 44,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileCaptionBar: {
    backgroundColor: '#0B214D',
    height: 30,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  profileHeaderBar: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },
  questionText: { fontWeight: 'bold', color: 'black', marginTop: 30 },
  answerText: { color: 'black', marginTop: 10, marginLeft: 20 },
  mediaPanel: {
    width: '100%',
    paddingHorizontal: 30,
    flexDirection: 'row',
    marginTop: 30
  },
  mediaBox: {
    height: 120,
    width: '100%',
    marginTop: 15,
    backgroundColor: '#C4C4C4'
  },
  mediaContentBox: {
    flex: 1,
    alignItems: 'center'
  },
  enterScoreButton: {
    marginTop: 30,
    backgroundColor: '#EC2939',
    padding: 15,
    height: 50,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 30
  },
  enterScoreText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15,
  },
  scoreSubmitPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  scoreInputBox: {
    backgroundColor: '#F4DAA2',
    height: 120,
    padding: 20,
    marginTop: 30,
    width: '100%',
    alignItems: 'center'
  },
  scoreSubmitControlButtons: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
})