import React, {Fragment} from 'react';
import {StyleSheet, View, Text} from 'react-native';

//Import Vector Icons
import Antdesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import Colors from '../common/Colors';
import ContestDetail from "./ContestDetail";

//Load Vector Icons
Antdesign.loadFont();
Feather.loadFont();

class ContestDesc extends React.Component {
  render() {
    const { Contest, Event } = this.props
    return ( 
      <Fragment>
        <View style={styles.HeaderBar}>
          <Text style={styles.HeaderText}>{Event.eventName}</Text>
          <Text style={styles.HeaderText}>{Event.charityData?.charityName}</Text>
        </View>
        <View style={{margin:10}}>
            <ContestDetail Details={Contest} Event={Event} />
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  HeaderBar: {
    backgroundColor: Colors.Yellow,
    height: 32,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  HeaderText: {
    color: '#000',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',

  },
});

export default ContestDesc;
