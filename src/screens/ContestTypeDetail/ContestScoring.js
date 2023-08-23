import React, {Fragment} from 'react';
import {StyleSheet, View, Text} from 'react-native';

//Import Vector Icons
import Antdesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import Colors from '../common/Colors';

//Load Vector Icons
Antdesign.loadFont();
Feather.loadFont();

class ContestScoring extends React.Component {
  render() {
    return (
      <Fragment>
        <View style={styles.HeaderBar}>
          <Text style={styles.HeaderText}>Scoring</Text>
        </View>
        <View style={{height: 50, margin: 10}}>
          <Text style={{fontSize: 16, lineHeight: 19}}>Scoring from DB</Text>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  HeaderBar: {
    backgroundColor: Colors.Blue,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  HeaderText: {
    color: Colors.White,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
    paddingLeft: 15
  },
});

export default ContestScoring;
