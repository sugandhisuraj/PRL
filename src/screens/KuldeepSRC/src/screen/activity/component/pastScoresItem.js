import React from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import {COLOR} from '../../../utils';

const BigText = ({text}) => <Text style={styles.bigText}>{text}-</Text>;
const SmallText = ({text}) => <Text style={styles.smallText}>{text}</Text>;
const PastScroresItem = () => {
  return (
    <View>
      <View style={styles.container}>
        <Image
          style={styles.avatar}
          source={{uri: 'https://via.placeholder.com/150'}}
        />
        <View style={{flexDirection: 'row'}}>
          <BigText text="21" />
          <SmallText text="15" />
        </View>
        <Image
          style={styles.avatar}
          source={{uri: 'https://via.placeholder.com/150'}}
        />
      </View>
    </View>
  );
};
export default PastScroresItem;
const styles = StyleSheet.create({
  avatar: {height: 40, width: 40, borderRadius: 50},
  container: {
    height: 90,
    width: 200,
    marginRight: 10,
    backgroundColor: COLOR.BLUE,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  bigText: {
    fontWeight: 'bold',
    fontSize: 32,
    lineHeight: 39,
    color: 'white',
  },
  smallText: {
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 39,
    color: 'white',
  },
});
