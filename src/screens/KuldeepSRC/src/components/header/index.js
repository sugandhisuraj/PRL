import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {Menu, Back, Edit} from '../../icon';
import {bigHitSlop, COLOR} from '../../utils';

const Header = ({onBack, onEdit,menuOnPress = () => {},hideMenu = false}) => {
  return (
    <LinearGradient
      colors={[COLOR.LIGHT_YELLOW, COLOR.WHITE]}
      style={{height: 171}}>
      <View style={styles.container}>
        <View style={styles.row}>
          {hideMenu ? null : <TouchableOpacity hitSlop={bigHitSlop} onPress={menuOnPress}>
            <Menu />
          </TouchableOpacity>}
          {onBack && (
            <TouchableOpacity onPress={onBack} hitSlop={bigHitSlop}>
              <Back style={{marginLeft: 30}} />
            </TouchableOpacity>
          )}
        </View>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} hitSlop={bigHitSlop}>
            <Edit />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 40,
    padding: 30,
  },
  row: {justifyContent: 'space-between', flexDirection: 'row'},
});
export default Header;
