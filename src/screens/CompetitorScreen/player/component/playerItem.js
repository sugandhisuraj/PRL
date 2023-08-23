import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RightArrow } from '../../../KuldeepSRC/src/icon';
import Avatar from '@assets/avatar1.jpg';
import { getWp, getHp } from '@utils';
const PlayerItem = ({ item, navigation, navEventId }) => {
  //console.log('COMP_SINGLE_ITEM_CHECK - ', JSON.stringify(item));
  let profileImg = { type: 'source', Avatar };
  if (item?.userData?.userAvatar?.length > 0) {
    profileImg = { type: 'uri', Avatar: item?.userData?.userAvatar };
  }
  // console.log('ITEM_CHECk_1806 - ', JSON.stringify(item));
  let completeContestText = '';
  if (item.contestData?.length > 0) {
    completeContestText = item.contestData.map(i => {
      if (i?.contestName) {
        return i?.contestName;
      }
      return '';
    }).join(',');
  }
  let userType = item?.userEnteredContest?.userContestParticipationType || '';
  if (userType) {
    userType = `(${userType})`;
  } else {
    userType = '';
  }
  return (
    <View style={styles.container}>
      <View style={{ width: '20%', overflow: 'hidden' }}>
        <Image
          style={styles.img}
          source={profileImg.type == 'uri' ? { uri: profileImg.Avatar } : profileImg.Avatar}
        //source={{uri: item.userAvatar}}
        />
      </View>
      <View style={{ marginLeft: 20, width: '80%' }}>
        <Text style={styles.name}> 
            {item?.userData?.userName || ''}
            {' '+userType}
            </Text>
        <Text style={styles.otherInfo}>{item?.userData?.userNickname || ''}</Text>
        <Text style={[styles.otherInfo, { marginTop: 10 }]}>{completeContestText}</Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('EventInfoStack', {
            screen: 'PlayerProfileScreen',
            params: {
              ...{
                userID: item.userData.uid,
                eventID: navEventId,
                onBackPress: () => {
                  navigation.navigate('CompetitorDrawerScreen');
                }
              }
            }
          });
        }}
        style={{
          right: 15,
          top: 20,
          position: 'absolute',
          // borderWidth: 1, 
          // borderColor: 'red', 
          padding: 15
        }}>
        <RightArrow />
      </TouchableOpacity>
    </View>
  );
};
export default PlayerItem
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  info: { flexDirection: 'row', alignItems: 'center' },
  img: { height: getWp(80), width: getWp(80), borderRadius: 50 },
  name: { fontWeight: 'bold', fontSize: 18, lineHeight: 22, color: 'black' },
  otherInfo: { fontSize: 16, lineHeight: 22, color: 'black', width: '90%' },
});
