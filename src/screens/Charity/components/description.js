import React from 'react';

import { View, StyleSheet, Image, TextInput, Text, ScrollView } from 'react-native';


import { Heading } from './heading';
import { COLOR } from '../../KuldeepSRC/src/utils';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Upload } from '../../KuldeepSRC/src/icon';

const Description = ({ url, description, edit, onChangeText, onUpload, onChangeDescText, Userdesc, component }) => {
  return (
    <View>
      <Heading
        backgroundColor={COLOR.BLUE}
        text={'Description'}
        color={COLOR.WHITE}
      />
      <View style={styles.container}>
        <View style={styles.avatarContainer}>

          <View
            disabled={true} onPress={onUpload}
            style={styles.uploadContainer}>
            {/* {edit && <Upload style={styles.upload} />} */}
            {/* <Image style={styles.avatar} source={{uri: url}} /> */}
            {component ? component(url, styles.avatar) : <Image style={styles.avatar} source={{ uri: url }} />}
          </View>
        </View>
        {
          edit ?
            <TextInput
              editable={edit}
              multiline={true}
              numberOfLines={10}
              style={styles.description}
              value={Userdesc == null ? description : Userdesc}
              onChangeText={onChangeDescText}
              placeholder="Enter Your Description"
            />
            :
            <ScrollView 
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={styles.description}>
              <View style={{height: 5}}/>
              <Text style={{color: 'black'}}>{Userdesc == null ? description : Userdesc}</Text>
              <View style={{height: 20}}/>
            </ScrollView>
        }
      </View>
    </View>
  );
};
export default Description;

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: COLOR.WHITE,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upload: { position: 'absolute', zIndex: 99999 },
  uploadContainer: { justifyContent: 'center', alignItems: 'center' },
  avatarContainer: {
    height: 159,
    width: '48%',
    paddingRight: 5,
    borderRadius: 15,
    position: 'relative',
  },
  avatar: {
    height: 140,
    width: 160,
    borderRadius: 15,
    marginTop: 15,
    paddingHorizontal: 0
  },
  description: {
    height: 180,
    width: '40%',
    borderWidth: .5,
    borderColor: COLOR.BLACK,
    paddingLeft: 5,
    // borderRadius: 15,
    marginTop: 15,
    textAlignVertical: 'top',
  },
});