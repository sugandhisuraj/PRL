import React from 'react';
import {View, StyleSheet, Image, TextInput} from 'react-native';

import {Heading} from './heading';
import {COLOR} from '../../../utils';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Upload} from '../../../icon';

const Description = ({url, description, edit, onChangeText,onUpload}) => {
  return (
    <View>
      <Heading
        backgroundColor={COLOR.BLUE}
        text={'Description'}
        color={COLOR.WHITE}
      />
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity disabled={!edit} onPress={onUpload} style={styles.uploadContainer}>
            {edit && <Upload style={styles.upload} />}
            <Image style={styles.avatar} source={{uri: url}} />
          </TouchableOpacity>
        </View>
        <TextInput
          editable={edit ? true : false}
          multiline={true}
          numberOfLines={10}
          style={styles.description}
          value={description}
          onChangeText={onChangeText}
          placeholder="Enter Your Description"
        />
      </View>
    </View>
  );
};
export default Description;

const styles = StyleSheet.create({
  container: {
    height: 185,
    backgroundColor: COLOR.WHITE,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upload: {position: 'absolute', zIndex: 99999},
  uploadContainer: {justifyContent: 'center', alignItems: 'center'},
  avatarContainer: {
    height: 159,
    width: '48%',
    paddingRight: 5,
    borderRadius: 15,
    position: 'relative',
  },
  avatar: {
    height: 159,
    width: '100%',
    paddingRight: 5,
    borderRadius: 15,
    marginTop: 15,
  },
  description: {
    height: 159,
    width: '48%',
    borderWidth: 1,
    borderColor: COLOR.BLACK,
    paddingLeft: 5,
    borderRadius: 15,
    marginTop: 15,
    textAlignVertical: 'top',
  },
});
