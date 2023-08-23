import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLOR} from '../../../utils';

const TopCharityItem = ({item}) => {
  const {title, event, fund} = item;
  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.footer}>
          <View style={styles.row}>
            <Text style={styles.txt}>
              <Text style={{fontWeight: 'bold'}}>{event}  </Text>Events Held
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.txt}>
              Donated <Text style={{fontWeight: 'bold'}}>{fund}</Text>
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.overlay} />
    </View>
  );
};

export default TopCharityItem;
const styles = StyleSheet.create({
  title: {fontSize: 14, color: '#FFFFFF'},
  dataContainer: {padding: 7, zIndex: 9999, height: '100%'},
  container: {
    height: 130,
    width: 200,
    marginRight:10,
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
  footer: {position: 'absolute', bottom: 0, padding: 10, paddingHorizontal: 0},
});
