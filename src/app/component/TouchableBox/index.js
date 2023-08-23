import React, { memo } from "react";
import { Image, View, TouchableOpacity, Text } from "react-native";

import LogoPNG from "@assets/PRLLogo.png";

import Styles from "./indexCss";

const TouchableBox = (props) => {
  const { logo, name ,containerStyle = {}, textStyle = {}, onPress } = props;
  return (
    <TouchableOpacity style={[Styles.CustomBoxView, containerStyle]} onPress={onPress}>
      <View style={[Styles.CustomBoxView, containerStyle]}>
        <Image style={Styles.CustomBoxBGImage} source={logo} />
        <Text style={[Styles.CustomBoxText,textStyle ]}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(TouchableBox);
