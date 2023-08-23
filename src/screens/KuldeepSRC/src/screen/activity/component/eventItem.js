import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Earth, People, Calendar} from '../../../icon';
import {COLOR} from '../../../utils';

const EventItem = ({item}) => {
  const {title, name, people, fund} = item;
  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.footer}>
          <View style={styles.row}>
            <Earth />
            <Text style={styles.txt}>{name}</Text>
          </View>
          <View style={styles.row}>
            <People />
            <Text style={styles.txt}>{people}</Text>
          </View>
          <View style={styles.row}>
            <Calendar style={{marginTop: 3}} fill="white" />
            <Text style={styles.txt}>{fund}</Text>
          </View>
          
        </View>
      </View>

      <View style={styles.overlay} />
    </View>
  );
};

export default EventItem;
const styles = StyleSheet.create({
  title: {fontSize: 14, color: '#FFFFFF'},
  dataContainer: {padding: 7, zIndex: 9999, height: '100%'},
  container: {
    height: 150,
    width: 200,

    marginTop:10
  },

  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: COLOR.BLUE,
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems:"center"
  },
  txt: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 10,
    textAlign:"center",

  },
  footer: {position: 'absolute', bottom: 0, padding: 10},
});
