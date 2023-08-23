import React from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';

import {Heading} from './heading';
import {COLOR} from '../../../utils';
import {Upload} from '../../../icon';

const FooterButton = ({onSubmit, onEdit, onCancel}) => {
  return (
    <View style={styles.footerBtnContainer}>
      <TouchableOpacity
        onPress={onSubmit}
        style={[styles.btnContainer, {backgroundColor: COLOR.RED}]}>
        <Text style={[styles.btnText, {color: COLOR.WHITE}]}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onEdit}
        style={[styles.btnContainer, {backgroundColor: COLOR.LIGHT_YELLOW}]}>
        <Text style={[styles.btnText, {color: COLOR.BLACK}]}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onCancel}
        style={[styles.btnContainer, {backgroundColor: COLOR.BLUE}]}>
        <Text style={[styles.btnText, {color: COLOR.WHITE}]}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const WatchVideo = ({url, edit, onSubmit, onEdit, onCancel}) => {
  return (
    <View>
      <Heading
        backgroundColor={COLOR.RED}
        text={'Watch Video'}
        color={COLOR.WHITE}
      />
      <View style={[styles.container, edit && styles.editContainer]}>
        <Image
          style={edit ? styles.editavatar : styles.avatar}
          source={{uri: url}}
        />
        {edit && (
          <TouchableOpacity style={styles.uploadBtn}>
            <Upload fill={COLOR.BLUE} />
            <Text style={styles.uploadText}>Upload 501C3</Text>
          </TouchableOpacity>
        )}
      </View>
      {edit && (
        <FooterButton onSubmit={onSubmit} onEdit={onEdit} onCancel={onCancel} />
      )}
    </View>
  );
};
export default WatchVideo;

const styles = StyleSheet.create({
  container: {
    // height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 20,
  },
  avatar: {
    height: 167,
    width: 270,

    borderRadius: 15,
    marginBottom: 25,
  },
  editavatar: {
    height: 125,
    width: 202,

    borderRadius: 15,
    marginBottom: 25,
  },
  editContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  uploadBtn: {
    height: 125,
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {fontSize: 16, lineHeight: 19, marginTop: 10},
  footerBtnContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  btnContainer: {
    height: 50,
    width: 100,

    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 19,
  },
});
