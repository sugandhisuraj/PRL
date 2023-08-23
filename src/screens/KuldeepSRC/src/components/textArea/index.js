import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {COLOR} from '../../utils';

const TextArea = ({...props}) => {
  return (
    <TextInput
      multiline={true}
      numberOfLines={3}
      style={styles.textfield}
      {...props}
    />
  );
};
export default TextArea;
const styles = StyleSheet.create({
  textfield: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    fontSize: 16,
    paddingLeft: 20,
    textAlignVertical: 'top',
    height: 70,
  },
});
