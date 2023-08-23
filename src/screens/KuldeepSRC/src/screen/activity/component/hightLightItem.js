import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
 const HighLightItem = ({Icon, text}) => (
  <View style={styles.highlightContainer}>
    <Icon />
    <Text style={styles.hightlightText}>{text}</Text>
  </View>
);
export default HighLightItem

const styles = StyleSheet.create({
  highlightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },
  hightlightText: {
    marginLeft: 10,
    textAlign: 'center',
    fontSize: 14,
    color: '#949AB1',
  },
});
