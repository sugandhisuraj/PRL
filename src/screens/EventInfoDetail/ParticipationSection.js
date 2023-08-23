import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

//Import Vector Icons
import Antdesign from 'react-native-vector-icons/AntDesign';

import Colors from '../common/Colors';

//Load Vector Icons
Antdesign.loadFont();

class ParticipationSection extends React.Component {
  render() {
    return (
      <Fragment>
        <View style={styles.SectionView}>
          <Text style={styles.sectionText}>Participation</Text>
          {!this.props.shouldNotSignUp && <TouchableOpacity
            onPress={() => this.props.navigation.navigate('EventInfoStack', {
              screen: 'EventPaymentSignupScreen',
              params: {
                eventData: this.props.data
              }
            })}
            style={styles.signUpTouch}>
            <View style={styles.signUpView}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </View>
          </TouchableOpacity>}
        </View>
        <View
          style={{
            flexDirection: 'row',
            margin: 10,
            justifyContent: 'space-evenly',
          }}>
          <View
            style={[
              styles.BoxView,
              {
                backgroundColor: Colors.Blue,
              },
            ]}>
            <Text style={styles.BoxViewText}>Watch as </Text>
            <Text style={styles.BoxViewText}>Spectator</Text>
          </View>
          <View
            style={[
              styles.BoxView,
              {
                backgroundColor: Colors.Red,
              },
            ]}>
            <Text style={styles.BoxViewText}>Player in </Text>
            <Text style={styles.BoxViewText}>the Contest</Text>
          </View>
          <View
            style={[
              styles.BoxView,
              {
                backgroundColor: Colors.Yellow,
              },
            ]}>
            <Text style={styles.BoxViewText}>Be a</Text>
            <Text style={styles.BoxViewText}>Sponsor</Text>
          </View>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  SectionView: {
    backgroundColor: Colors.Red,
    height: 32,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  sectionText: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
    paddingLeft: 15,
  },
  signUpTouch: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
  },
  signUpView: {
    zIndex: 10,
    height: 38,
    width: 100,
    backgroundColor: Colors.Blue,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 19,
    color: '#FFF',
  },
  BoxView: {
    height: 80,
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BoxViewText: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center'
  },
});

export default ParticipationSection;
