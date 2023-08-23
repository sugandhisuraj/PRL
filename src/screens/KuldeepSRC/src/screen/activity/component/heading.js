import React from 'react';
import {Text, StyleSheet} from 'react-native';

const Heading = ({text}) => <Text style={styles.heading}>{text}</Text>;
export default Heading
const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 10,
  },
});
