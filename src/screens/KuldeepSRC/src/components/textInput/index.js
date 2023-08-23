import React from 'react';
import {TextInput, StyleSheet, View, Text} from 'react-native';
import {Union, Up} from '../../icon';
import {COLOR} from '../../utils';

const TextField = ({Icon, onPress, children, ...props}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textfield}
        {...props}
        underlineColorAndroid="transparent"
      />
      {Icon && <Icon onPress={onPress} style={styles.searchIcon} />}
      {children && (
        <View style={styles.childContainer}>
     
          <Up fill={COLOR.BLACK} style={{marginLeft: 5}} />
          <Text style={styles.childText}>$450</Text>
          <Union style={{marginLeft: 5}} />
          <Text style={styles.childText}>3</Text>
        </View>
      )}
    </View>
  );
};
export default TextField;
const styles = StyleSheet.create({
  childText: {
    marginLeft: 5,
    fontSize: 14,
    lineHeight: 17,
    color: COLOR.BLACK,
  },
  childContainer: {
    padding: 10,
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textfield: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 50,
    height: 40,
    fontSize: 16,
    paddingLeft: 20,
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchIcon: {
    padding: 10,
    position: 'absolute',
    right: 20,
  },
});
