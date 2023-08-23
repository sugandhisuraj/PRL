import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Earth, People, Up,Trophy} from '../../../icon';
import {COLOR} from '../../../utils';

const PastEventItem = ({item}) => {
  const {title, name, people,place, fund} = item;
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
            <Trophy style={{marginTop: 3}} fill="white" />
            <Text style={styles.txt}>{place}</Text>
          </View>
          <View style={styles.row}>
            <Up style={{marginTop: 3}} fill="white" />
            <Text style={styles.txt}>{fund}</Text>
          </View>
        </View>
      </View>

      <View style={styles.overlay} />
    </View>
  );
};

export default PastEventItem;
const styles = StyleSheet.create({
  title: {fontSize: 14, color: '#FFFFFF'},
  dataContainer: {padding: 7, zIndex: 9999, height: '100%'},
  container: {
    height: 180,
    width: 200,
    marginRight: 10,
    marginTop: 10,
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
    alignItems: 'center',
  },
  txt: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 10,
    textAlign: 'center',
  },
  footer: {position: 'absolute', bottom: 0, padding: 10},
});
