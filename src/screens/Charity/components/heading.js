import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const Heading = ({backgroundColor, text, color}) => (
  <View style={[styles.container, {backgroundColor: backgroundColor}]}>
    <Text style={[styles.header, {color: color}]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 35,
    width: '100%',
    marginTop: 20,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  header: {fontWeight: 'bold', fontSize: 16, lineHeight: 19},
});
