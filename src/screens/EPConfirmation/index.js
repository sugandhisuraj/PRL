// External Imports
import React from 'react';
import { View, Image, Text, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import styles from './indexCss';
import { Button } from 'native-base'
import HeaderBlack from "../Header/HeaderBlack";
import { useSelector, connect } from 'react-redux';
import { getFromToDate, getHp } from '@utils';
import { useBackHandler } from '@react-native-community/hooks';
function EPConfirmationScreen({ navigation, route }) {
  const { auth } = useSelector(state => state);
  const {
    eventData,
    selectedFeesData,
  } = route.params;

  useBackHandler(() => {
    return navigation.pop(3);
  })
  console.log('TEST_NG2 - ', JSON.stringify(eventData));
  const EventInfo = (
    <View style={{ paddingVertical: 10, width: '90%', alignSelf: 'center', marginBottom: 20 }}>
      <View style={{ padding: 5 }}>
        <Text style={{ fontSize: 16, color: '#0B214D', fontWeight: 'bold' }}>Event Information</Text>
      </View>
      <View style={{ padding: 5 }}>
        <Text style={{ fontSize: 16, color: '#0B214D' }}>{eventData?.eventInformation}</Text>
      </View>
      {/*<View style={{ padding: 5 }}>
        <Text style={{ fontSize: 16, color: '#0B214D' }}>Game schedule will be sent on</Text>
      </View>
      <View style={{ padding: 5 }}>
        <Text style={{ fontSize: 16, color: '#0B214D' }}>Game schedule will be sent on</Text>
      </View>
      <View style={{ padding: 5 }}>
        <Text style={{ fontSize: 16, color: '#0B214D' }}>Good Luck!</Text>
      </View> */}
    </View>
  )

  const OrderDetails = (
    <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <Text style={{ fontSize: 16, color: '#0B214D' }}>Order Details</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 10 }}>
        <View>
          <Image source={{ uri: eventData?.eventLogo }} style={styles.profileImg} />
        </View>
        <View>
          <Text style={{ fontSize: 16, color: '#0B214D', fontWeight: 'bold' }}>{eventData.eventName}</Text>
          <Text style={{ fontSize: 16, color: '#0B214D' }}>From {getFromToDate(eventData.eventDate, eventData.eventDateEnd)}</Text>
          <Text style={{ fontSize: 16, color: '#0B214D' }}>{eventData?.charityData?.charityName}</Text>
        </View>
      </View>
      <View style={{ padding: 5 }}>
        {
          selectedFeesData.map((i) => {
            return (
              <Text style={{ fontSize: 16, color: '#0B214D', marginTop: 5 }}>
                {i.contestName}
              </Text>
            );
          })
        }


      </View>
    </View>
  )

  const ButtonBlock = (
    <View style={{ alignItems: 'center', paddingBottom: 10 }}>
      <View style={{ flexDirection: 'row', }}>
        <Button
          onPress={() => {
            navigation.navigate('EventInfoStack', {
              screen: 'PlayerProfileScreen',
              params: {
                ...{
                  userID: auth.userCol.uid,
                  eventID: eventData.eventID
                }
              }
            });
          }}
          style={styles.ButtonView}>
          <Text style={styles.ButtonText}>Edit Your profile</Text>
        </Button>
        {/* {     how to give spacing here between buttons} */}
        <Button style={styles.ButtonView}
          onPress={() => {
            return navigation.navigate('EventInfoStack', {
              screen: 'PlayerListScreen',
              params: {
                event: eventData,
                index: 0,
                allEvents: []
              }
            });
          }}
        >
          <Text style={styles.ButtonText}>Scout Competition</Text>
        </Button>
      </View>
      <View>
        <Button
          onPress={() => { navigation.pop(4); }}
          style={styles.ButtonView2}>
          <Text style={styles.ButtonText}>See Other Events</Text>
        </Button>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <HeaderBlack
        onBackPress={() => {
          return navigation.pop(4);
        }} />
      <ScrollView>
        <View style={{ paddingHorizontal: 20, justifyContent: 'center', alignSelf: 'center' }}>
          <View style={{ paddinTop: 10 }}>
            <Text style={{ fontSize: 20, color: '#0B214D', fontWeight: 'bold' }}>Order confirmed</Text>
          </View>
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ fontSize: 16, color: '#0B214D', fontWeight: 'bold' }}>An email reciept has been sent to {auth.userCol.email}</Text>
          </View>
        </View>

        <View style={{ borderWidth: 0.7, borderColor: 'black', width: '90%', alignSelf: 'center' }} />


        {OrderDetails}
        <View style={{ borderWidth: 0.7, borderColor: 'black', width: '90%', alignSelf: 'center' }} />
        {EventInfo}

        <View style={{ backgroundColor: '#EDCF80', paddingVertical: 5, paddingLeft: 20 }}>
          <View >
            <Text style={{ fontSize: 16, color: '#0B214D', fontWeight: 'bold' }}>Charity Note!</Text>
          </View>
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ fontSize: 16, color: '#0B214D', fontWeight: 'bold' }}>{eventData?.eventThankYou || ''}</Text>
          </View>
        </View>


        {ButtonBlock}

      </ScrollView>
    </SafeAreaView>
  );
}


export default connect()(EPConfirmationScreen);