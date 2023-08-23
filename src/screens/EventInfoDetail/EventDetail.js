import React, {Fragment} from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

//Import Vector Icons
import Antdesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

//Load Vector Icons
Antdesign.loadFont();
Feather.loadFont();

class EventDetail extends React.Component {

  render() {
    return (
        <Fragment>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly',}}>
          <View>
            <View
              style={{
                height: 80,
                width: 80,
                backgroundColor: '#C4C4C4',
              }}
            />
          </View>
          <View style={{width: '70%'}}>
            <View>
              <Text
                style={styles.eventDetailBoldText}>
                {this.props.data.eventName}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 19,
                  color: '#000',
                  marginTop: 3
                }}>
                {this.props.data.eventDate}
              </Text>
            </View>
            <View>
              <Text
                style={[styles.eventDetailBoldText,{marginVertical: 10}]}>
                Charity: Rotary Club
              </Text>
            </View>
          </View>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  eventDetailBoldText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 'bold',
    color: "#000"
  },
});

export default EventDetail;
