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

class ContestDescSection extends React.Component {
  render() {
    return (
      <Fragment>
        <View style={styles.HeaderBar}>
          <Text style={styles.HeaderText}>Bracket Type</Text>
          <Text style={styles.HeaderText}>Highest Points</Text>
        </View>
        <View style={{height: 50, margin: 10}}>
            <Text style={{fontSize: 16, lineHeight: 19}}>Description</Text>
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
    color: Colors.Black,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
  },
});

export default ContestDescSection;
