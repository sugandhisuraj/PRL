import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

const Button = ({onPress, backgroundColor, color,text, ...props}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      {...props}
      style={[styles.btnContainer, {backgroundColor: backgroundColor}]}>
      <Text style={[styles.btnText, {color: color}]}>{text}</Text>
    </TouchableOpacity>
  );
};
export default Button
const styles = StyleSheet.create({
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
