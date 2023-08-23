import React, {Fragment} from 'react';
import {StyleSheet, View, Text} from 'react-native';

//Import Vector Icons
import Antdesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import Colors from '../common/Colors';

//Load Vector Icons
Antdesign.loadFont();
Feather.loadFont();

class ContestDetail extends React.Component {
  render() {
    return (
      <Fragment>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <View>
            <View
              style={{
                height: 80,
                width: 80,
                backgroundColor: Colors.Grey,
              }}
            />
          </View>
          <View style={{width: '70%'}}>
            <View>
              <Text style={styles.eventDetailBoldText}>
                Contest Type Name
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 19,
                }}>
                 
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.eventDetailBoldText, {marginVertical: 15}]}>
              (Pending Approval)
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
  },
});

export default ContestDetail;
