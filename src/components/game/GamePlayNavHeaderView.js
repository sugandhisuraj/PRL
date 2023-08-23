import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

MaterialIcons.loadFont();
AntDesign.loadFont();

const GamePlayNavHeaderView = (props) => {

    const { game } = props;

    return (
      <View style={ styles.navContainer }>

        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            props.onBack()
          }}>
          <MaterialIcons name="chevron-left" size={30}/>
        </TouchableOpacity>

        <View style={styles.navTitleView}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
            Game #{game.gameID}
          </Text>
        </View>

        <View style={styles.buttons} />

      </View>
    );
};

export default GamePlayNavHeaderView;

const styles = StyleSheet.create({
  navContainer: { 
    height: 44, 
    alignItems: 'center',
    flexDirection: 'row' 
  },

  buttons: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },

  navTitleView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  navTitle: {
    fontWeight: 'bold', 
    textAlign: 'center'
  },

  messageIconView: {
    justifyContent: 'center', 
    width: 30,
    height: 30,
    alignItems: 'center'
  },

  redDotView: {
    backgroundColor: 'red',
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute', 
    right: 6,
    top: 8
  }
});