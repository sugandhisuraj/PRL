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

class EventDesc extends React.Component {

  render() {
    return (
        <Fragment>
        <View
          style={{
            backgroundColor: '#EDCF80',
            height: 32,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20
          }}>
          <Text
            style={{
              color: '#01080C',
              fontSize: 16,
              lineHeight: 19,
              fontWeight: 'bold', 
             
            }}>
            {this.props.data?.eventGenre}
          </Text>
          <Text
            style={{
              color: '#01080C',
              fontSize: 16,
              lineHeight: 19,
              fontWeight: 'bold',
            }}>
            {this.props.data?.eventCategory}
          </Text>
          <Text
            style={{
              color: '#01080C',
              fontSize: 16,
              lineHeight: 19,
              fontWeight: 'bold',
            }}>
            {this.props.data?.eventSubCategory}
          </Text>
        </View>
        <View style={{height: 50, margin: 15}}>
            <Text style={{fontSize: 16, lineHeight: 19, color: "#000"}}>{this.props.data.eventDescription}</Text>
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
  },
});

export default EventDesc;
