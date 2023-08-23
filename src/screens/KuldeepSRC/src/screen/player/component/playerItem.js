import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {RightArrow} from '../../../icon';

const PlayerItem = () => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Image
          style={styles.img}
          source={{uri: 'https://via.placeholder.com/150'}}
        />
        <View style={{marginLeft: 20}}>
          <Text style={styles.name}>Name</Text>
          <Text style={styles.otherInfo}>Nick Name</Text>
          <Text style={styles.otherInfo}>Competing in Darts, Cornhole</Text>
        </View>
      </View>
      <RightArrow />
    </View>
  );
};
export default PlayerItem
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 110,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  info: {flexDirection: 'row', alignItems: 'center'},
  img: {height: 80, width: 80, borderRadius: 50},
  name: {fontWeight: 'bold', fontSize: 18, lineHeight: 22},
  otherInfo: {fontSize: 16, lineHeight: 22},
});
