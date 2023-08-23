import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Antdesign from 'react-native-vector-icons/AntDesign';

import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';
import Styles from './indexCss';
Feather.loadFont();
Antdesign.loadFont();
const Header = (props) => {
    const {
        containerStyle = {},
        heading = "Add Heading",
        menuOnPress,
        leftOnPress,
        RightComponent = null,
        hideMenu = false,
        disableBack = false
    } = props;
    return (
        <View style={[Styles.container, containerStyle]}>
            {!hideMenu && <TouchableOpacity 
            style={Styles.commonMargin} onPress={menuOnPress}>
                <Feather name="menu" size={25} color={'#000'} />
            </TouchableOpacity>}
            <TouchableOpacity style={{ marginLeft: getWp(20) }} 
            disabled={disableBack}
            onPress={leftOnPress}>
                <Antdesign name="left" size={25} color={'#000'} />
            </TouchableOpacity>
            {
                RightComponent ? 
                    <RightComponent /> : 
                <Text style={Styles.headerHeadingText}>
                    {heading}
                </Text>
            }
        </View>
    );
}

export default Header;