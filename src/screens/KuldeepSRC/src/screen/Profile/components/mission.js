import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Heading} from './heading';
import {COLOR} from '../../../utils';

const Mission = ({text}) => {
  return (
    <View>
      <Heading backgroundColor={COLOR.LIGHT_YELLOW} text={'Mission'} />
      <View style={styles.metaContainer}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};
export default Mission;

const styles = StyleSheet.create({
  container: {
    height: 35,
    width: '100%',
    backgroundColor: COLOR.LIGHT_YELLOW,
    marginTop: 20,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  header: {fontWeight: 'bold', fontSize: 16, lineHeight: 19},
  metaContainer: {height: 66, backgroundColor: COLOR.WHITE, padding: 20},
  text: {fontSize: 16, lineHeight: 19},
});
