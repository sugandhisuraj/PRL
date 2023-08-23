import React, { Fragment } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';

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
    const { Contest, Event, contestBracketTypes } = this.props
    let bracketType = '';
    let currentBracketType = contestBracketTypes.find((b, i) => {
      if (b.contestBracketTypeID == Contest.contestBracketType) {
        return true;
      }
    });
    if (currentBracketType) {
      bracketType = currentBracketType.name;
    }
    // console.log('CURRENT_LOOP - ', contestBracketTypes.length); 
    // console.log('CURRENT_EXE_BRC - ', bracketType);
    return (
      <Fragment>
        <View style={styles.HeaderBar}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{ maxWidth: 150 }}>
            <Text style={styles.HeaderText}>{Contest.contestScoringType}</Text>
          </ScrollView>

          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{ maxWidth: 150 }}>
            <Text style={styles.HeaderText}>{bracketType}</Text>
          </ScrollView>
        </View>
        <View style={{ height: 30, margin: 15 }}>
          <Text style={{ fontSize: 16, lineHeight: 19, color: '#000' }}>{Contest.contestDescription}</Text>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  HeaderBar: {
    backgroundColor: Colors.Yellow,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  HeaderText: {
    color: Colors.Black,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
  },
});

export default ContestDescSection;
