import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextField } from '../../KuldeepSRC/src/components';
import { Back, Email, Forward, Phone } from '../../KuldeepSRC/src/icon';
import { COLOR } from '../../KuldeepSRC/src/utils';
import { transformFirebaseValues } from '@utils';


const ProfileInfo = ({ name, web, email, phone, edit, onNext, onPrevious, Username, onChangeNameText, Userweb, onChangeWebText, onChangeEmailText, Useremail, Userphone, onChangePhoneText }) => {

  const loadProfileData = async () => {
    const charitiesData = await charitiesCollection.get();
    let charityData = transformFirebaseValues(charitiesData, 'charityID')
    setCharityArray(charityData)
  }

  useEffect(() => {
    loadProfileData();
  }, [])

  return (
    <View>
      <View style={styles.infoContainer}>
        {!edit && <TouchableOpacity
          style={{ borderWidth: 0, borderColor: 'red', padding: 10 }}
          onPress={onPrevious}>
          <Back />
        </TouchableOpacity>}
        {edit ? (
          <View style={styles.ecenter}>
            <TextField
              // placeholder="Enter Charity Name"
              placeholder={Username == null ? name : Username}
              onChangeText={onChangeNameText}
              value={Username}
            />
            <TextField
              placeholder={Userweb == null ? web : Userweb}
              onChangeText={onChangeWebText}
              value={Userweb} />
          </View>
        ) : (
            <View style={styles.center}>
              <Text style={styles.name}>
                {name}
              </Text>

              <Text style={styles.web}>{web}</Text>
            </View>
          )}
        {!edit && <TouchableOpacity
          style={{ borderWidth: 0, borderColor: 'red', padding: 10 }}
          onPress={onNext}>
          <Forward />
        </TouchableOpacity>}

      </View>
      {edit ? (
        <View style={styles.emetaContainer}>
          {/* <Email style={{marginLeft: 13}} /> */}

          <TextField
            placeholder={Useremail == null ? email : Useremail}
            onChangeText={onChangeEmailText}
            value={Useremail}
          //  placeholder={value==null ?text:value}
          //  onChangeText={onChangeText}
          //  value={value}
          />
          <TextField
            placeholder={Userphone == null ? phone : Userphone}
            onChangeText={onChangePhoneText}
            value={Userphone} />
          {/* <Phone style={{marginLeft: 13}} />
  <Text style={styles.text}>{phone}</Text> */}
        </View>
      ) : (
          <View style={styles.metaContainer}>
            <Email style={{ marginLeft: 13 }} />

            <Text style={styles.text}>{email}</Text>
            <Phone style={{ marginLeft: 13 }} />
            <Text style={styles.text}>{phone}</Text>
          </View>
        )}
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
    alignSelf: 'center'
  },
  center: {
    justifyContent: 'center', alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'red',
    width: '110%',
    paddingHorizontal: 20
  },
  ecenter: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 100,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
    color: COLOR.BLACK,
    textAlign: 'center',
  },
  web: { fontSize: 16, lineHeight: 19, color: COLOR.BLACK },
  metaContainer: {
    marginTop: 10,
    padding: 58,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emetaContainer: {
    marginTop: 10,
    padding: 10,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // width:"100%"
  },
  text: { marginLeft: 13, fontSize: 14, lineHeight: 19 },
});
