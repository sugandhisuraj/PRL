// External Imports
import React, { useEffect } from 'react';
import { View, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import FontIcon from 'react-native-vector-icons/FontAwesome'
import styles from './indexCss';
import OTPTextView from 'react-native-otp-textinput';
import { useSelector, useDispatch } from 'react-redux';
import { readEvents } from '../../../store/actions';
//import EventSlider from '../Slider/EventSlider'
import {Root} from '@component';

import PRL from './PRL.png'

Entypo.loadFont();
const Data = [
  {
    Event: "event1"
  },
  {
    Event: "event2"
  },
  {
    Event: "event3"
  },
  {
    Event: "event4"
  },
]
function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const events = useSelector(state => state.event.events);
  useEffect(() => {
    dispatch(readEvents());
  }, []);
  const OTPVIEW = (
    <View style={{ backgroundColor: '#0B214D' }}>
      <Text style={{ color: '#FFFFFF', textAlign: 'center', paddingTop: 5 }}>Private Event Code</Text>
      <View style={styles.OtpContainer}>
        <OTPTextView
          handleTextChange={(e) => { }}
          containerStyle={styles.textInputContainer}
          textInputStyle={styles.roundedTextInput}
          offTintColor="#DCDCDC"
          tintColor="red"
        />
      </View>
    </View>
  )

  const WATCHLIVE = (

    <View style={{ backgroundColor: '#FFFFFF' }}>
      <TouchableOpacity onPress={() => navigation.navigate('EventsScreen')}>
        <Text style={{ color: '#01080C', textAlign: 'center', paddingVertical: 10, fontWeight: 'bold' }}>Watch Live Event</Text>
      </TouchableOpacity>
      {/* <TabViewExample /> */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 20 }}>
        <FontIcon name="angle-left" color="red" size={20} />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Text style={{ paddingHorizontal: 28, color: '#01080C' }}>Event</Text>
          <Text style={{ paddingHorizontal: 28, color: '#01080C' }}>Event</Text>
          <Text style={{ paddingHorizontal: 28, color: '#01080C' }}>Event</Text>
          <Text style={{ paddingHorizontal: 28, color: '#01080C' }}>Event</Text>
          <Text style={{ paddingHorizontal: 28, color: '#01080C' }}>Event</Text>
          <Text style={{ paddingHorizontal: 28, color: '#01080C' }}>Event</Text>
          <Text style={{ paddingHorizontal: 28, color: '#01080C' }}>Event</Text>
          <Text style={{ paddingHorizontal: 28, color: '#01080C' }}>Event</Text>
        </ScrollView>
        <FontIcon name="angle-right" color="red" size={20} />
      </View>
    </View>
  )
  const JOINPUBLIC = (

    <View style={{ backgroundColor: '#EC2939' }}>
      <TouchableOpacity onPress={() => navigation.navigate('EventsScreen')}>
        <Text style={{ color: '#FFFFFF', textAlign: 'center', paddingVertical: 10 }}>Join Public Event</Text>
      </TouchableOpacity>
      {/* <TabViewExample /> */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 20 }}>
        <FontIcon name="angle-left" color="white" size={20} />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {
            events.map((event, index) => {
              return <TouchableOpacity onPress={() => {
                navigation.navigate("EventInfoScreen", {
                  eventData: event
                });
              }}>
                <Text style={{ paddingHorizontal: 28, color: '#FFFFFF' }}>
                  {event.eventName}
                </Text>
              </TouchableOpacity>
            })
          }
        </ScrollView>
        <FontIcon name="angle-right" color="white" size={20} />
      </View>
    </View>
  )

  const UPDATEPROFILE = (
    <View style={{ backgroundColor: "#0B214D" }}>
      <Text style={{ color: '#FFFFFF', textAlign: 'center', paddingVertical: 20 }}>Update Your Profile</Text>
    </View>
  )

  const CHARITIES = (
    <View style={{ backgroundColor: '#FFFFFF' }}>
      <Text style={{ color: '#01080C', textAlign: 'center', paddingVertical: 10, fontWeight: 'bold' }}>Charities Supported</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 20, alignItems: 'center' }}>
        <FontIcon name="angle-left" size={20} />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 35 }}>
            <Image source={{ uri: "https://facebook.github.io/react-native/docs/assets/favicon.png" }} style={styles.profileCharity} />
          </View>
          <View style={{ paddingHorizontal: 35 }}>
            <Image source={{ uri: "https://facebook.github.io/react-native/docs/assets/favicon.png" }} style={styles.profileCharity} />
          </View>
          <View style={{ paddingHorizontal: 35 }}>
            <Image source={{ uri: "https://facebook.github.io/react-native/docs/assets/favicon.png" }} style={styles.profileCharity} />
          </View>
          <View style={{ paddingHorizontal: 35 }}>
            <Image source={{ uri: "https://facebook.github.io/react-native/docs/assets/favicon.png" }} style={styles.profileCharity} />
          </View>
          <View style={{ paddingHorizontal: 35 }}>
            <Image source={{ uri: "https://facebook.github.io/react-native/docs/assets/favicon.png" }} style={styles.profileCharity} />
          </View>
          <View style={{ paddingHorizontal: 35 }}>
            <Image source={{ uri: "https://facebook.github.io/react-native/docs/assets/favicon.png" }} style={styles.profileCharity} />
          </View>
        </ScrollView>
        <FontIcon name="angle-right" size={20} />
      </View>
      <Text style={{ color: '#01080C', textAlign: 'center', fontWeight: 'bold', paddingBottom: 10 }}>Charity Name</Text>
    </View>
  )



  return (
    <Root>
    <View style={{ flex: 1, backgroundColor: '#EDCF80' }}>

      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 12 }}>
        <View>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Entypo name="menu" size={40} color="black" style={{ marginRight: 120, marginLeft: 10 }} />
          </TouchableOpacity>
        </View>
        <View>
          <Image source={PRL} height={20} style={styles.profileImg} />
        </View>
      </View>
      <View style={{ paddingVertical: 5 }} />
      {OTPVIEW}
      <View style={{ paddingVertical: 5 }} />
      {/* <EventSlider /> */}
      {WATCHLIVE}
      <View style={{ paddingVertical: 5 }} />
      {JOINPUBLIC}
      <View style={{ paddingVertical: 5 }} />
      {UPDATEPROFILE}
      <View style={{ paddingVertical: 5 }} />
      {CHARITIES}
    </View>
    </Root>
  );
}


export default HomeScreen; 