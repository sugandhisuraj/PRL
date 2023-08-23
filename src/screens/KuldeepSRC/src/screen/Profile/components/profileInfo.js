import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Back, Email, Forward, Phone} from '../../../icon';
import {COLOR} from '../../../utils';

const ProfileInfo = ({name,web,email,phone}) => {
  return (
    <View>
      <View style={styles.infoContainer}>
        <Back />
        <View style={styles.center}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.web}>{web}</Text>
        </View>
        <Forward />
      </View>
      <View style={styles.metaContainer}>
        <Email style={{marginLeft: 13}} />
        <Text style={styles.text}>{email}</Text>
        <Phone style={{marginLeft: 13}} />
        <Text style={styles.text}>{phone}</Text>
      </View>
    </View>
  );
};
export default ProfileInfo;

const styles = StyleSheet.create({
  infoContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 58,
    paddingVertical: 0,
    alignItems: 'center',
  },
  center: {justifyContent: 'center', alignItems: 'center'},
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
    color: COLOR.BLACK,
  },
  web: {fontSize: 16, lineHeight: 19, color: COLOR.BLACK},
  metaContainer: {
    marginTop: 10,
    padding: 58,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {marginLeft: 13, fontSize: 16, lineHeight: 19},
});
